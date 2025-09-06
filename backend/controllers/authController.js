const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

const createOtpEmailTemplate = (otp, type = 'verification', userName = 'there') => {
  const templates = {
    verification: {
      title: 'Welcome! Verify Your Account',
      emoji: '🎉',
      message: `Welcome to our platform, ${userName}! 🎉<br>Thank you for joining us. To complete your registration and secure your account, please use the verification code below.`,
      label: 'Your Verification Code'
    },
    resend: {
      title: 'Verification Code (Resent)',
      emoji: '🔐',
      message: `Hi ${userName}! 👋<br>We've resent your verification code as requested. Please use the code below to complete your account verification.`,
      label: 'Your New Verification Code'
    },
    reregistration: {
      title: 'Account Update - Verification Required',
      emoji: '🔄',
      message: `Hi ${userName}! 👋<br>We've updated your account information. To ensure security, please verify your account again using the code below.`,
      label: 'Your Verification Code'
    }
  };

  const template = templates[type] || templates.verification;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
            overflow: hidden;
            position: relative;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(180deg); }
        }
        
        .logo {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255,255,255,0.3);
            position: relative;
            z-index: 1;
        }
        
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
            font-weight: 600;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: relative;
            z-index: 1;
        }
        
        .header p {
            color: rgba(255,255,255,0.9);
            margin: 10px 0 0;
            font-size: 16px;
            position: relative;
            z-index: 1;
        }
        
        .content {
            padding: 50px 40px;
            text-align: center;
        }
        
        .welcome-text {
            color: #333333;
            font-size: 18px;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .otp-container {
            background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
            border: 2px dashed #667eea;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            position: relative;
        }
        
        .otp-label {
            color: #667eea;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
        }
        
        .otp-code {
            font-size: 48px;
            font-weight: 700;
            color: #333333;
            font-family: 'Courier New', monospace;
            letter-spacing: 8px;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .timer {
            margin-top: 30px;
            padding: 15px;
            background: rgba(255, 107, 107, 0.1);
            border-radius: 10px;
            color: #ff6b6b;
            font-weight: 600;
        }
        
        .timer-icon {
            font-size: 18px;
            margin-right: 8px;
        }
        
        .security-note {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 30px 0;
            border-radius: 5px;
            text-align: left;
        }
        
        .security-note h3 {
            color: #333333;
            margin: 0 0 10px;
            font-size: 16px;
        }
        
        .security-note p {
            color: #666666;
            margin: 0;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666666;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            color: #ffffff;
            text-decoration: none;
            line-height: 40px;
            transition: all 0.3s ease;
        }
        
        .divider {
            height: 2px;
            background: linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%);
            margin: 30px 0;
            border: none;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 20px;
                border-radius: 15px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .otp-code {
                font-size: 36px;
                letter-spacing: 4px;
            }
            
            .otp-container {
                padding: 20px;
            }
        }
        
        .pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .badge {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            margin-left: 10px;
            display: inline-block;
        }
        
        .welcome-badge {
            background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
        }
        
        .update-badge {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo pulse">${template.emoji}</div>
            <h1>
                ${template.title}
                ${type === 'verification' ? '<span class="badge welcome-badge">New User</span>' : ''}
                ${type === 'resend' ? '<span class="badge">Resent</span>' : ''}
                ${type === 'reregistration' ? '<span class="badge update-badge">Updated</span>' : ''}
            </h1>
            <p>Secure access to your account</p>
        </div>
        
        <div class="content">
            <p class="welcome-text">
                ${template.message}
            </p>
            
            <div class="otp-container">
                <div class="otp-label">${template.label}</div>
                <div class="otp-code">${otp}</div>
            </div>
            
            <div class="timer">
                <span class="timer-icon">⏰</span>
                This code will expire in ${type === 'verification' || type === 'reregistration' ? '5' : '10'} minutes
            </div>
            
            <hr class="divider">
            
            <div class="security-note">
                <h3>🛡️ Security Notice</h3>
                <p>
                    For your security, never share this code with anyone. Our team will never ask for your verification code via phone, email, or any other method. If you didn't request this verification, please contact our support team immediately.
                </p>
            </div>
            
            <p style="color: #666666; margin-top: 30px;">
                ${type === 'verification' ? 
                  "Having trouble? Don't worry! You can always request a new verification code from our app." :
                  "If you didn't request this verification, please ignore this email or contact our support team."
                }
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Need Help?</strong></p>
            <p>Contact our support team at noreply@gmail.com</p>
            
            <p style="margin-top: 20px; font-size: 12px; color: #999;">
                © 2025 Skill Switch. All rights reserved.<br>
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and password are required' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Please enter a valid email address' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        error: 'Password must be at least 6 characters long' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing && existing.isVerified) {
      return res.status(400).json({ 
        success: false,
        error: 'An account with this email already exists and is verified' 
      });
    }

    const hashed = await bcrypt.hash(password, 12); 
    const otp = generateOtp();

    if (existing && !existing.isVerified) {
      // Update existing unverified user
      existing.name = name.trim();
      existing.password = hashed;
      existing.otp = otp;
      existing.otpExpires = Date.now() + 5 * 60 * 1000;
      existing.lastOtpSent = Date.now();
      await existing.save();

      const htmlTemplate = createOtpEmailTemplate(otp, 'reregistration', name.trim());
      
      const mailOptions = {
        from: {
          name: 'Skill Switch',
          address: process.env.EMAIL_USER
        },
        to: normalizedEmail,
        subject: '🔄 Account Updated - Verification Required',
        html: htmlTemplate,
        text: `Hi ${name}! Your account has been updated. Your verification code is ${otp}. It will expire in 5 minutes.`
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({ 
        success: true,
        message: 'Account updated successfully! Please check your email for the verification code.',
        data: {
          email: normalizedEmail,
          expiresIn: '5 minutes'
        }
      });
    }

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
      lastOtpSent: Date.now(),
      isVerified: false,
    });
    await user.save();

    const htmlTemplate = createOtpEmailTemplate(otp, 'verification', name.trim());
    
    const mailOptions = {
      from: {
          name: 'Skill Switch',
        address: process.env.EMAIL_USER
      },
      to: normalizedEmail,
      subject: '🎉 Welcome! Verify Your Account',
      html: htmlTemplate,
      text: `Welcome ${name}! Your verification code is ${otp}. It will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({ 
      success: true,
      message: 'Registration successful! Please check your email for the verification code.',
      data: {
        email: normalizedEmail,
        expiresIn: '5 minutes'
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to create account. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && { debug: err.message })
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false,
        error: 'Please verify your account before logging in. Check your email for the verification code.',
        requiresVerification: true,
        email: normalizedEmail
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' } 
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        lastLogin: user.lastLogin
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Login failed. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && { debug: err.message })
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ 
        success: false,
        error: 'Email and verification code are required' 
      });
    }

    email = email.toLowerCase().trim();
    otp = otp.toString().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'No account found with this email address' 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        success: false,
        error: 'Account is already verified' 
      });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid verification code. Please check and try again.' 
      });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ 
        success: false,
        error: 'Verification code has expired. Please request a new one.',
        expired: true 
      });
    }

    user.isVerified = true;
    user.verifiedAt = new Date();
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return res.status(200).json({ 
      success: true,
      message: 'Account verified successfully! You are now logged in.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        verifiedAt: user.verifiedAt
      }
    });

  } catch (err) {
    console.error('verifyOtp error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Verification failed. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && { debug: err.message })
    });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    let { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email address is required' 
      });
    }

    email = email.toLowerCase().trim();
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'No account found with this email address' 
      });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false,
        error: 'Account is already verified' 
      });
    }

    const now = Date.now();
    const lastOtpTime = user.lastOtpSent || 0;
    const timeDiff = now - lastOtpTime;
    const minWaitTime = 60 * 1000; // 1 minute

    if (timeDiff < minWaitTime) {
      const remainingTime = Math.ceil((minWaitTime - timeDiff) / 1000);
      return res.status(429).json({
        success: false,
        error: `Please wait ${remainingTime} seconds before requesting another verification code`,
        remainingTime
      });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; 
    user.lastOtpSent = now;
    await user.save();

    const htmlTemplate = createOtpEmailTemplate(otp, 'resend', user.name);
    
    const mailOptions = {
      from: {
          name: 'Skill Switch',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🔐 Your Verification Code (Resent)',
      html: htmlTemplate,
      text: `Hi ${user.name}! Your new verification code is ${otp}. It will expire in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true,
      message: 'Verification code has been resent to your email',
      data: {
        email: email,
        expiresIn: '10 minutes',
        resentAt: new Date().toISOString()
      }
    });

  } catch (err) {
    console.error('resendOtp error:', err);
    return res.status(500).json({ 
      success: false,
      error: 'Unable to resend verification code. Please try again later.',
      ...(process.env.NODE_ENV === 'development' && { debug: err.message })
    });
  }
};