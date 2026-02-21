import cron from 'node-cron';
import User from '../models/user.js';
import Attendance from '../models/Attendence.js';

// ⏰ Run every day at 23:59
cron.schedule('59 23 * * *', async () => {
  console.log('🕚 Running end-of-day attendance cron...');

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    const users = await User.find();

    for (const user of users) {
      // Skip if attendance already marked today (user manually submitted)
      const alreadyMarked = await Attendance.findOne({ user: user._id, date: today });
      if (alreadyMarked) {
        console.log(`⏭️ Skipping ${user.email} — already marked for today`);
        continue;
      }

      // Get last recorded weight to carry forward
      const lastAttendance = await Attendance.findOne({ user: user._id }).sort({ date: -1 });
      const weightToUse = lastAttendance ? lastAttendance.weight : 0;

      if (dayOfWeek === 0) {
        // SUNDAY → auto mark Present (rest day), carry forward last weight
        await Attendance.create({
          user: user._id,
          date: today,
          status: 'Present',
          weight: weightToUse
        });
        console.log(`✅ Auto Present (Sunday rest day) for ${user.email} — weight: ${weightToUse} kg`);
      } else {
        // MON–SAT → user didn't submit → mark Absent, carry forward last weight
        await Attendance.create({
          user: user._id,
          date: today,
          status: 'Absent',
          weight: weightToUse
        });
        console.log(`❌ Auto Absent for ${user.email} — weight: ${weightToUse} kg`);
      }
    }

    console.log('✅ End-of-day cron completed.');
  } catch (error) {
    console.error('❌ Cron Error:', error);
  }
});