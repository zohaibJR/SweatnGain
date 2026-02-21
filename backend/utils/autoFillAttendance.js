import Attendance from '../models/Attendence.js';

/**
 * Auto-fills missing attendance days between the last recorded day and today.
 * 
 * Rules:
 * - Sunday → always mark as Present (rest day), carry forward last weight
 * - Mon–Sat → mark as Absent if user didn't submit, carry forward last weight
 * 
 * This runs when user submits attendance, ensuring no gaps in history.
 */
export const autoFillAbsentDays = async (userId) => {
  const lastAttendance = await Attendance.findOne({ user: userId }).sort({ date: -1 });

  if (!lastAttendance) return; // No previous record — nothing to backfill

  const lastDate = new Date(lastAttendance.date);
  lastDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from the day AFTER the last recorded date
  let currentDate = new Date(lastDate);
  currentDate.setDate(currentDate.getDate() + 1);

  // Track the most recent weight as we fill forward
  let carryWeight = lastAttendance.weight;

  while (currentDate < today) {
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday

    const status = dayOfWeek === 0 ? 'Present' : 'Absent';

    try {
      await Attendance.create({
        user: userId,
        date: new Date(currentDate),
        status,
        weight: carryWeight
      });

      console.log(
        `📅 Auto-filled ${status} for user ${userId} on ` +
        `${currentDate.toDateString()} — weight: ${carryWeight} kg`
      );
    } catch (err) {
      // Skip if duplicate (unique index will throw)
      if (err.code !== 11000) {
        console.error(`Auto-fill error on ${currentDate.toDateString()}:`, err.message);
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
};