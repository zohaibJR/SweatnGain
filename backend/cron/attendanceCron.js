import cron from 'node-cron';
import User from '../models/user.js';
import Attendance from '../models/Attendence.js';

// ⏰ Run every day at 23:59
cron.schedule('59 23 * * *', async () => {
    console.log('🕚 Running end-of-day attendance cron');

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        const users = await User.find();

        for (const user of users) {

            // Check if attendance already exists for today
            const alreadyMarked = await Attendance.findOne({ user: user._id, date: today });
            if (alreadyMarked) continue;

            // Get last recorded weight
            const lastAttendance = await Attendance.findOne({ user: user._id }).sort({ date: -1 });
            const weightToUse = lastAttendance ? lastAttendance.weight : 0; // 0 if no previous record

            if (dayOfWeek === 0) {
                // SUNDAY → mark Present, carry forward weight
                await Attendance.create({
                    user: user._id,
                    date: today,
                    status: 'Present',
                    weight: weightToUse
                });
                console.log(`✅ Auto Present marked for ${user.email} (Sunday)`);

            } else {
                // WEEKDAY → mark Absent, carry forward weight
                await Attendance.create({
                    user: user._id,
                    date: today,
                    status: 'Absent',
                    weight: weightToUse
                });
                console.log(`❌ Auto Absent marked for ${user.email}`);
            }
        }

    } catch (error) {
        console.error('Cron Error:', error);
    }
});
