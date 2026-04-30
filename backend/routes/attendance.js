const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// @route   POST /api/attendance/check-in
// @desc    Start attendance session via geofence
// @access  Private
router.post('/check-in', auth, async (req, res) => {
  const { branchId, serviceType } = req.body;

  try {
    // Check if user already has a session today for this branch
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      user: req.user.id,
      branch: branchId,
      date: { $gte: today }
    });

    if (attendance) {
      if (attendance.status === 'checked-in') {
        return res.json(attendance); // Already checked in
      }
      attendance.status = 'checked-in';
      attendance.checkInTime = new Date();
    } else {
      attendance = new Attendance({
        user: req.user.id,
        branch: branchId,
        status: 'checked-in',
        checkInTime: new Date(),
        serviceType: serviceType || 'Sunday Service'
      });
    }

    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/attendance/check-out
// @desc    End attendance session via geofence
// @access  Private
router.post('/check-out', auth, async (req, res) => {
  const { branchId } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      user: req.user.id,
      branch: branchId,
      status: 'checked-in',
      date: { $gte: today }
    });

    if (!attendance) {
      return res.status(404).json({ msg: 'No active session found' });
    }

    const checkOutTime = new Date();
    const diffMs = checkOutTime.getTime() - attendance.checkInTime.getTime();
    const durationMinutes = Math.round(diffMs / 60000);

    attendance.checkOutTime = checkOutTime;
    attendance.duration = (attendance.duration || 0) + durationMinutes;
    attendance.status = 'present'; // Session completed

    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/attendance
// @desc    Manual attendance mark
// @access  Private
router.post('/', auth, async (req, res) => {
  const { branch, status, serviceType, userId } = req.body;

  try {
    const newAttendance = new Attendance({
      user: userId || req.user.id, 
      branch,
      status,
      serviceType
    });

    const attendance = await newAttendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/attendance/user/:userId
// @desc    Get attendance history for a user
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    // Users can only see their own attendance unless admin/steward (check role logic later if needed)
    if (req.user.id !== req.params.userId) {
      // Ideally check for admin role here
    }

    const attendance = await Attendance.find({ user: req.params.userId }).sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/attendance/branch/:branchId
// @desc    Get attendance stats for a branch
// @access  Private (Admin/Steward)
router.get('/branch/:branchId', auth, async (req, res) => {
  try {
    const attendance = await Attendance.find({ branch: req.params.branchId }).populate('user', ['fullName', 'email']);
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
