const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let otpStore = {}; // temporary storage { email: otp }

async function sendMail(receiverMail, otp) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "oweshkhan1856@gmail.com",
      pass: "umbq wxrx pjyl elsm",  
    },
  });

  await transporter.sendMail({
    from: '"Oweshs-org" <oweshkhan1856@gmail.com>',
    to: receiverMail,
    subject: "OTP for Login",
    text: `Your OTP is: ${otp}`,
  });
}

// Route to send OTP
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp; // save OTP for that email

    await sendMail(email, otp);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route to verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email]; // remove OTP after success
    res.json({ success: true, message: "OTP verified" });
  } else {
    res.json({ success: false, message: "Invalid OTP" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
