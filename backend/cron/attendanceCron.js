import cron from 'node-cron';
import User from '../models/user.js';
import Attendance from '../models/Attendence.js';

// ⏰ Run every day at 23:59
cron.schedule('59 23 * * *', async () => {
  console.log('🕚 Running end-of-day auto absent cron');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const users = await User.find();

    for (const user of users) {

      // Check if attendance already exists for today
      const alreadyMarked = await Attendance.findOne({
        user: user._id,
        date: today
      });

      if (alreadyMarked) continue;

      // Get last attendance for weight
      const lastAttendance = await Attendance
        .findOne({ user: user._id })
        .sort({ date: -1 });

      // If no history, skip
      if (!lastAttendance) continue;

      await Attendance.create({
        user: user._id,
        date: today,
        status: 'Absent',
        weight: lastAttendance.weight
      });

      console.log(`❌ Auto Absent marked for ${user.email}`);
    }

  } catch (error) {
    console.error('Cron Error:', error);
  }
});
