import express from 'express';
import {
  submitAttendance,
  getLast7DaysWeight,
  getLatestWeight,
  getMonthlyAttendance,
  getWeightChange,
  getLast7DaysWeightRecords,
  getLast7DaysAttendanceRecords,
  getLast10DaysAttendancePie // <-- import new controller
} from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/', submitAttendance);
router.get('/last7days', getLast7DaysWeight);
router.get('/latest', getLatestWeight);
router.get('/weight-change', getWeightChange);
router.get('/monthly', getMonthlyAttendance);

router.get('/last7days/weight-records', getLast7DaysWeightRecords);
router.get('/last7days/attendance-records', getLast7DaysAttendanceRecords);

// New route for last 10 days Pie Chart
router.get('/last10days/pie', getLast10DaysAttendancePie);

export default router;
