require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

/* --------------------------- DB CONNECTION --------------------------- */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

/* ------------------------------- MODEL ------------------------------- */
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

/* -------------------- MIDDLEWARE & STATIC FILES ---------------------- */
app.use(cors());
app.use(express.json());

/* --------------------------- AUTH LOGIC ------------------------------ */
const JWT_SECRET = process.env.JWT_SECRET || 'sha256';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existing = await User.findOne({ email });

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    if (existing && existing.isVerified) {
      return res
        .status(400)
        .json({ error: 'User already exists and verified' });
    }

    if (existing && !existing.isVerified) {
      existing.name = name;
      existing.password = hashed;
      existing.otp = otp;
      existing.otpExpires = Date.now() + 5 * 60 * 1000;
      await existing.save();

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your verification code (re-registration)',
        text: `Your verification code is ${otp}. It will expire in 5 minutes.`,
      });

      return res.json({
        message: 'User exists but not verified. OTP resent to email.',
      });
    }

    const user = new User({
      name,
      email,
      password: hashed,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
      isVerified: false,
    });

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your verification code',
      text: `Your verification code is ${otp}. It will expire in 5 minutes.`,
    });

    return res.json({ message: 'Registered. OTP sent to email.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({
        error: 'Please verify your account before logging in.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      message: 'Login successful',
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: 'Missing email or otp' });

    email = email.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.isVerified)
      return res.status(400).json({ error: 'Already verified' });

    if (!user.otp || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({ message: 'Account verified' });
  } catch (err) {
    console.error('verifyOtp error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    email = email.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.isVerified)
      return res.status(400).json({ error: 'Already verified' });

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your verification code (resend)',
      text: `Your verification code is ${otp}. It will expire in 10 minutes.`,
    });

    return res.json({ message: 'OTP resent to email' });
  } catch (err) {
    console.error('resendOtp error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

/* -------------------------- START SERVER ----------------------------- */
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
