const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Testimony = require('../models/Testimony');
const Event = require('../models/Event');
const Account = require('../models/Account');

// --- TESTIMONIES ---

// @route   POST /api/content/testimony
// @desc    Submit a testimony
// @access  Private
router.post('/testimony', auth, async (req, res) => {
  try {
    const { title, content, branch } = req.body;
    const newTestimony = new Testimony({
      user: req.user.id,
      title,
      content,
      branch
    });
    const testimony = await newTestimony.save();
    res.json(testimony);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/content/testimonies/:branchId
// @desc    Get testimonies for a branch
// @access  Public (or Private)
router.get('/testimonies/:branchId', async (req, res) => {
  try {
    const testimonies = await Testimony.find({ branch: req.params.branchId, isApproved: true }) // Only approved
      .sort({ date: -1 });
    res.json(testimonies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// --- EVENTS ---

// @route   GET /api/content/events
// @desc    Get all events
// @access  Public
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/content/events
// @desc    Create an event (Admin only ideally)
// @access  Private 
router.post('/events', auth, async (req, res) => {
  try {
    const { title, description, date, branch, type } = req.body;
    const newEvent = new Event({
      title, description, date, branch, type
    });
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// --- ACCOUNTS ---

// @route   GET /api/content/accounts/:branchId
// @desc    Get distinct account details for a branch
// @access  Public
router.get('/accounts/:branchId', async (req, res) => {
  try {
    const accounts = await Account.find({ branch: req.params.branchId });
    res.json(accounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/content/accounts
// @desc    Add account details
// @access  Private
router.post('/accounts', auth, async (req, res) => {
  try {
    const { bankName, accountNumber, accountName, branch, type } = req.body;
    const newAccount = new Account({
      bankName, accountNumber, accountName, branch, type
    });
    const account = await newAccount.save();
    res.json(account);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
