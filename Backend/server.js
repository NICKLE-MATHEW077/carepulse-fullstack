const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// ==================================================
// MONGODB CONNECTION
// ==================================================

mongoose
  .connect("mongodb://127.0.0.1:27017/carepulse")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// ==================================================
// EMAIL CONFIGURATION
// ==================================================

// IMPORTANT:
// Replace these two values with your CarePulse Gmail
// address and Google App Password.

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: "nicklemathew07@gmail.com",
    pass: "aenp onam nlew hnpg",
  },
});

// ==================================================
// USER SCHEMA
// ==================================================

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

// ==================================================
// USER MODEL
// ==================================================

const User = mongoose.model("User", userSchema);

// ==================================================
// APPOINTMENT SCHEMA
// ==================================================

const appointmentSchema = new mongoose.Schema(
  {
    // Appointment reference number
    reference: {
      type: String,
      required: true,
      unique: true,
    },

    // Logged-in user
    username: {
      type: String,
      required: true,
    },

    // Patient details
    patientName: {
      type: String,
      required: true,
    },

    age: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    // Doctor details
    doctorName: {
      type: String,
      required: true,
    },

    speciality: {
      type: String,
      required: true,
    },

    qualification: {
      type: String,
      default: "",
    },

    rating: {
      type: String,
      default: "",
    },

    doctorImage: {
      type: String,
      default: "",
    },

    // Appointment date and time
    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    arrivalTime: {
      type: String,
      default: "",
    },

    // Consultation details
    format: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    // Patient reason
    reason: {
      type: String,
      default: "",
    },

    // Payment
    amount: {
      type: Number,
      default: 0,
    },

    // Appointment status
    status: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

// ==================================================
// APPOINTMENT MODEL
// ==================================================

const Appointment = mongoose.model("Appointment", appointmentSchema);

// ==================================================
// TEST ROUTE
// ==================================================

app.get("/", (req, res) => {
  res.send("CarePulse backend server is running");
});

// ==================================================
// REGISTER
// ==================================================

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ----------------------------------------------
    // CHECK ALL FIELDS
    // ----------------------------------------------

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ----------------------------------------------
    // CHECK USERNAME
    // ----------------------------------------------

    const existingUsername = await User.findOne({
      username: username,
    });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username already registered",
      });
    }

    // ----------------------------------------------
    // CHECK EMAIL
    // ----------------------------------------------

    const existingEmail = await User.findOne({
      email: email,
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ----------------------------------------------
    // CREATE NEW USER
    // ----------------------------------------------

    const newUser = new User({
      username: username,
      email: email,
      password: password,
    });

    // ----------------------------------------------
    // SAVE USER TO MONGODB
    // ----------------------------------------------

    await newUser.save();

    console.log("New user registered:", username);

    // ==================================================
    // SEND WELCOME EMAIL
    // ==================================================

    const mailOptions = {
      from: `"CarePulse" <YOUR_CAREPULSE_EMAIL@gmail.com>`,

      to: email,

      subject: "Welcome to CarePulse",

      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">

          <meta name="viewport"
                content="width=device-width, initial-scale=1.0">

          <title>Welcome to CarePulse</title>
        </head>

        <body style="
          margin: 0;
          padding: 0;
          background-color: #f4f7fb;
          font-family: Arial, Helvetica, sans-serif;
        ">

          <div style="
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 18px rgba(0,0,0,0.08);
          ">

            <!-- HEADER -->

            <div style="
              background-color: #287BE8;
              padding: 28px;
              text-align: center;
            ">

              <h1 style="
                margin: 0;
                color: #ffffff;
                font-size: 28px;
              ">
                CarePulse
              </h1>

              <p style="
                margin: 8px 0 0;
                color: #eaf3ff;
                font-size: 14px;
              ">
                Care. Connect. Recover.
              </p>

            </div>

            <!-- CONTENT -->

            <div style="
              padding: 35px 30px;
              color: #333333;
            ">

              <h2 style="
                margin-top: 0;
                color: #222222;
              ">
                Welcome to CarePulse, ${username}!
              </h2>

              <p style="
                font-size: 16px;
                line-height: 1.7;
              ">
                Thank you for registering with
                <strong>CarePulse Health Network</strong>.
              </p>

              <p style="
                font-size: 16px;
                line-height: 1.7;
              ">
                Your account has been successfully created.
                You can now log in to CarePulse and access
                our healthcare appointment services.
              </p>

              <!-- ACCOUNT DETAILS -->

              <div style="
                background-color: #f4f8ff;
                border-radius: 8px;
                padding: 20px;
                margin: 25px 0;
              ">

                <h3 style="
                  margin-top: 0;
                  color: #287BE8;
                ">
                  Your Account Details
                </h3>

                <p style="
                  margin: 8px 0;
                  font-size: 15px;
                ">
                  <strong>Username:</strong>
                  ${username}
                </p>

                <p style="
                  margin: 8px 0;
                  font-size: 15px;
                ">
                  <strong>Email:</strong>
                  ${email}
                </p>

              </div>

              <p style="
                font-size: 16px;
                line-height: 1.7;
              ">
                Thank you for choosing CarePulse for your
                healthcare needs.
              </p>

              <p style="
                font-size: 16px;
                line-height: 1.7;
              ">
                We look forward to providing you with a
                smooth and convenient healthcare experience.
              </p>

              <p style="
                margin-top: 30px;
                font-size: 15px;
                line-height: 1.6;
              ">
                Regards,<br>
                <strong>CarePulse Health Network</strong>
              </p>

            </div>

            <!-- FOOTER -->

            <div style="
              background-color: #f4f7fb;
              padding: 20px;
              text-align: center;
              color: #777777;
              font-size: 12px;
            ">

              <p style="margin: 0;">
                © 2026 CarePulse Health Network
              </p>

              <p style="
                margin: 6px 0 0;
              ">
                This is an automated email.
                Please do not reply.
              </p>

            </div>

          </div>

        </body>
        </html>
      `,
    };

    // ----------------------------------------------
    // SEND EMAIL
    // ----------------------------------------------

    try {
      await transporter.sendMail(mailOptions);

      console.log("Welcome email sent successfully to:", email);
    } catch (emailError) {
      console.log("Email sending failed:", emailError.message);
    }

    // ----------------------------------------------
    // SEND RESPONSE TO FRONTEND
    // ----------------------------------------------

    res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.log("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ==================================================
// LOGIN
// ==================================================

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      username: username,
    });

    // Username not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Username is not registered",
      });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    console.log("Login successful:", username);

    // Login response
    res.status(200).json({
      success: true,

      message: "Login successful",

      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ==================================================
// CREATE APPOINTMENT
// ==================================================

app.post("/appointments", async (req, res) => {
  try {
    console.log("----------------------------------------");
    console.log("Appointment data received:");
    console.log(req.body);
    console.log("----------------------------------------");

    // Create appointment
    const appointment = new Appointment({
      reference: req.body.reference,

      username: req.body.username,

      patientName: req.body.patientName,

      age: req.body.age,

      gender: req.body.gender,

      phone: req.body.phone,

      email: req.body.email,

      doctorName: req.body.doctorName,

      speciality: req.body.speciality,

      qualification: req.body.qualification,

      rating: req.body.rating,

      doctorImage: req.body.doctorImage,

      date: req.body.date,

      time: req.body.time,

      arrivalTime: req.body.arrivalTime,

      format: req.body.format,

      location: req.body.location,

      address: req.body.address,

      reason: req.body.reason,

      amount: req.body.amount,

      status: req.body.status,
    });

    // Save appointment to MongoDB
    await appointment.save();

    console.log("Appointment saved successfully:", appointment.reference);

    // Send response to frontend
    res.status(201).json({
      success: true,

      message: "Appointment saved successfully",

      appointment: appointment,
    });
  } catch (error) {
    console.log("Appointment save error:", error);

    res.status(500).json({
      success: false,

      message: "Failed to save appointment",

      error: error.message,
    });
  }
});

// ==================================================
// GET ALL APPOINTMENTS
// ==================================================

app.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,

      count: appointments.length,

      appointments: appointments,
    });
  } catch (error) {
    console.log("Get appointments error:", error);

    res.status(500).json({
      success: false,

      message: "Failed to retrieve appointments",
    });
  }
});

// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
