import express from 'express';
import {
  submitAttendance,
  getLast7DaysWeight,
  getLatestWeight,
  getMonthlyAttendance,
  getWeightChange,
  getLast7DaysWeightRecords,
  getLast7DaysAttendanceRecords,
  getLast10DaysAttendancePie,
  getMonthlyAttendancePie,
  checkTodayAttendance
} from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/', submitAttendance);
router.get('/check-today', checkTodayAttendance);
router.get('/last7days', getLast7DaysWeight);
router.get('/last7days/weight-records', getLast7DaysWeightRecords);
router.get('/last7days/attendance-records', getLast7DaysAttendanceRecords);
router.get('/last10days/pie', getLast10DaysAttendancePie);
router.get('/latest', getLatestWeight);
router.get('/weight-change', getWeightChange);
router.get('/monthly', getMonthlyAttendance);
router.get('/monthly/pie', getMonthlyAttendancePie);

export default router;