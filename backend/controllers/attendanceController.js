import Attendance from '../models/Attendence.js';
import User from '../models/user.js';

// ---------------- SUBMIT ATTENDANCE ----------------
export const submitAttendance = async (req, res) => {
  try {
    const { email, status, weight } = req.body;

    if (!email || !status || weight === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Normalize today date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Prevent duplicate attendance
    const alreadyMarked = await Attendance.findOne({
      user: user._id,
      date: today
    });

    if (alreadyMarked) {
      return res.status(400).json({
        message: "Attendance already marked today"
      });
    }

    await Attendance.create({
      user: user._id,
      date: today,
      status,
      weight
    });

    res.status(201).json({ message: "Attendance submitted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- LAST 7 DAYS WEIGHT ----------------
export const getLast7DaysWeight = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startDate, $lte: today }
    }).sort({ date: 1 });

    res.json(records);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- LATEST WEIGHT ----------------
export const getLatestWeight = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const latest = await Attendance.findOne({ user: user._id })
      .sort({ date: -1 })
      .select("weight");

    res.json({
      weight: latest ? latest.weight : null
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/attendanceController.js

export const getMonthlyAttendance = async (req, res) => {
  try {
    const { email } = req.query;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const totalDays = endOfMonth.getDate();

    const presentCount = await Attendance.countDocuments({
      user: user._id,
      status: 'Present',
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    res.json({
      totalDays,
      presentCount,
      month: now.toLocaleString('default', { month: 'long' })
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- WEIGHT CHANGE ----------------
export const getWeightChange = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get earliest and latest attendance records
    const records = await Attendance.find({ user: user._id }).sort({ date: 1 }); // oldest to newest

    if (records.length < 2) {
      return res.json({ change: 0 }); // not enough data
    }

    const firstWeight = records[0].weight;
    const latestWeight = records[records.length - 1].weight;

    const change = latestWeight - firstWeight;

    res.json({
      firstWeight,
      latestWeight,
      change
    });

  } catch (error) {
    console.error("Weight change fetch failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ---------------- MONTHLY ATTENDANCE PIE ----------------
export const getMonthlyAttendancePie = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const totalDays = endOfMonth.getDate();

    const presentCount = await Attendance.countDocuments({
      user: user._id,
      status: 'Present',
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const absentCount = totalDays - presentCount;

    res.json({ presentCount, absentCount, totalDays, month: now.toLocaleString('default', { month: 'long' }) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- LAST 10 DAYS ATTENDANCE PIE ----------------
export const getLast10DaysAttendancePie = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find user registration date (first attendance or user creation)
    const firstAttendance = await Attendance.findOne({ user: user._id }).sort({ date: 1 });
    const registrationDate = firstAttendance ? firstAttendance.date : user.createdAt;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start date = max(today - 9 days, registration date)
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 9);

    const startDate = registrationDate > tenDaysAgo ? registrationDate : tenDaysAgo;

    // Get attendance records in that period
    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startDate, $lte: today }
    }).sort({ date: 1 });

    // Calculate Present and Absent days
    const totalDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1; // inclusive
    const presentCount = records.filter(r => r.status === 'Present').length;
    const absentCount = totalDays - presentCount;

    res.json({
      totalDays,
      presentCount,
      absentCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- LAST 7 DAYS WEIGHT RECORDS ----------------
export const getLast7DaysWeightRecords = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startDate, $lte: today }
    })
      .sort({ date: -1 })
      .select("date weight -_id");

    const formatted = records.map(item => ({
      date: item.date.toISOString().split("T")[0],
      weight: item.weight
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ---------------- LAST 7 DAYS ATTENDANCE RECORDS ----------------
export const getLast7DaysAttendanceRecords = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startDate, $lte: today }
    })
      .sort({ date: -1 })
      .select("date status -_id");

    const formatted = records.map(item => ({
      date: item.date.toISOString().split("T")[0],
      status: item.status
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};






