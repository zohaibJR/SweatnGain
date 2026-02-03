import Attendance from '../models/Attendence.js';

export const autoFillAbsentDays = async (userId) => {
  const lastAttendance = await Attendance
    .findOne({ user: userId })
    .sort({ date: -1 });

  // If no previous attendance, do nothing
  if (!lastAttendance) return;

  const lastDate = new Date(lastAttendance.date);
  lastDate.setHours(0,0,0,0);

  const today = new Date();
  today.setHours(0,0,0,0);

  let nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + 1);

  while (nextDate < today) {
    await Attendance.create({
      user: userId,
      date: new Date(nextDate),
      status: 'Absent',
      weight: lastAttendance.weight // 🔁 carry forward
    });

    nextDate.setDate(nextDate.getDate() + 1);
  }
};
