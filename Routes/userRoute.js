const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const sendMail = require('../nodemailer/sentMail');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, mailid, password } = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                error: 'Username already exists'
            });
        }

        const saltRounds = 11;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            username,
            password: hashedPassword,
            mailid
        });

        await user.save();

        return res.status(200).json({
            message: 'Registration completed successfully'
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: 'Registration failed'
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                error: 'Login failed'
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                error: 'Login failed'
            });
        }

        return res.status(200).json({
            message: 'Login successful'
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: 'Login failed'
        });
    }
});



router.post("/forgotpassword", async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        error: "user not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    );

    const expiryTime =
      Date.now() + 5 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = expiryTime;

    await user.save();
    await sendMail(user.mailid, otp);

    return res.status(200).json({
      message: "OTP sent to mail",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Failed",
    });
  }
});


router.post("/verify-otp", async (req, res) => {
    try {
        const { username, otp } = req.body;

        if (!username || !otp) {
            return res.status(400).json({
                error: "username and otp are required",
            });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                error: "user not found",
            });
        }

        if (!user.otp) {
            return res.status(400).json({
                error: "OTP already used or expired",
            });
        }

        if (new Date() > new Date(user.otpExpiry)) {
            user.otp = null;
            user.otpExpiry = null;

            await user.save();

            return res.status(400).json({
                error: "OTP expired",
            });
        }

        if (String(user.otp) !== String(otp)) {
            return res.status(400).json({
                error: "Invalid OTP",
            });
        }

        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        return res.status(200).json({
            message: "OTP verified successfully",
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            error: "Failed",
        });
    }
});



module.exports = router;
