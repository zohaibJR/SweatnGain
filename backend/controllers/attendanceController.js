import Attendance from '../models/Attendence.js';
import User from '../models/user.js';
import { autoFillAbsentDays } from '../utils/autoFillAttendance.js';

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

// ---------------- SUBMIT ATTENDANCE ----------------
export const submitAttendance = async (req, res) => {
  try {
    const { email, status, weight } = req.body;
    if (!email || !status || weight === undefined)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await autoFillAbsentDays(user._id);

    const alreadyMarked = await Attendance.findOne({ user: user._id, date: today });
    if (alreadyMarked)
      return res.status(400).json({ message: "Attendance already marked today" });

    await Attendance.create({ user: user._id, date: today, status, weight: parseFloat(weight) });
    res.status(201).json({ message: "Attendance submitted successfully" });
  } catch (error) {
    console.error("Submit Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- CHECK TODAY ATTENDANCE ----------------
export const checkTodayAttendance = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await Attendance.findOne({ user: user._id, date: today });
    res.json({ marked: !!record, status: record ? record.status : null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET LAST 7 DAYS ATTENDANCE RECORDS ----------------
export const getLast7DaysAttendanceRecords = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const signupDate = new Date(user.createdAt);
    signupDate.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    const startDate = signupDate > sevenDaysAgo ? signupDate : sevenDaysAgo;

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startDate, $lte: today }
    }).sort({ date: -1 });

    res.json(records.map(r => ({ date: formatDate(r.date), status: r.status })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET LAST 7 DAYS WEIGHT RECORDS ----------------
export const getLast7DaysWeightRecords = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const signupDate = new Date(user.createdAt);
    signupDate.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    const startDate = signupDate > sevenDaysAgo ? signupDate : sevenDaysAgo;

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startDate, $lte: today }
    }).sort({ date: -1 });

    res.json(records.map(r => ({ date: formatDate(r.date), weight: r.weight })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET LAST 7 DAYS (for chart) ----------------
export const getLast7DaysWeight = async (req, res) => {
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
    }).sort({ date: 1 });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET LATEST WEIGHT ----------------
export const getLatestWeight = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const latest = await Attendance.findOne({ user: user._id })
      .sort({ date: -1 }).select('weight');
    res.json({ weight: latest ? latest.weight : null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET MONTHLY ATTENDANCE ----------------
export const getMonthlyAttendance = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const totalDays    = endOfMonth.getDate();

    const presentCount = await Attendance.countDocuments({
      user: user._id, status: 'Present',
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    res.json({ totalDays, presentCount, month: now.toLocaleString('default', { month: 'long' }) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET WEIGHT CHANGE ----------------
export const getWeightChange = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const records = await Attendance.find({ user: user._id }).sort({ date: 1 });

    if (records.length < 2) {
      return res.json({ change: 0, firstWeight: records[0]?.weight || 0, latestWeight: records[0]?.weight || 0 });
    }

    const firstWeight  = records[0].weight;
    const latestWeight = records[records.length - 1].weight;
    res.json({ firstWeight, latestWeight, change: latestWeight - firstWeight });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET MONTHLY ATTENDANCE PIE ----------------
export const getMonthlyAttendancePie = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const totalDays    = endOfMonth.getDate();

    const presentCount = await Attendance.countDocuments({
      user: user._id, status: 'Present',
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    res.json({ presentCount, absentCount: totalDays - presentCount, totalDays, month: now.toLocaleString('default', { month: 'long' }) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET LAST 10 DAYS ATTENDANCE PIE ----------------
export const getLast10DaysAttendancePie = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const firstAttendance = await Attendance.findOne({ user: user._id }).sort({ date: 1 });
    const registrationDate = firstAttendance ? new Date(firstAttendance.date) : new Date(user.createdAt);
    registrationDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 9);

    const startDate = registrationDate > tenDaysAgo ? registrationDate : tenDaysAgo;

    const records = await Attendance.find({ user: user._id, date: { $gte: startDate, $lte: today } });

    const totalDays    = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const presentCount = records.filter(r => r.status === 'Present').length;

    res.json({ totalDays, presentCount, absentCount: totalDays - presentCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET FULL MONTH RECORDS (filterable by month/year) ----------------
export const getMonthlyRecords = async (req, res) => {
  try {
    const { email, month, year } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const now          = new Date();
    const targetYear   = year  ? parseInt(year)  : now.getFullYear();
    const targetMonth  = month !== undefined ? parseInt(month) : now.getMonth();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(targetYear, targetMonth + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      user: user._id,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ date: -1 });

    const result = records.map(r => ({
      date: r.date,
      formattedDate: formatDate(r.date),
      dayName: new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }),
      status: r.status,
      weight: r.weight
    }));

    const presentCount = result.filter(r => r.status === 'Present').length;
    const absentCount  = result.filter(r => r.status === 'Absent').length;

    res.json({
      records: result,
      summary: {
        totalRecords: result.length,
        presentCount,
        absentCount,
        month: startOfMonth.toLocaleString('default', { month: 'long' }),
        year: targetYear
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};