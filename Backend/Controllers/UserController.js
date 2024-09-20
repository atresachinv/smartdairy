const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
const nodemailer = require("nodemailer");
dotenv.config({ path: "Backend/.env" });

// .........................................
// Register.................................
// .........................................
exports.userRegister = async (req, res) => {
  const {
    dairy_name,
    user_name,
    user_phone,
    user_city,
    user_pincode,
    user_password,
    terms,
    date,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const createuser = `INSERT INTO users (dairy_name, user_name, user_phone, user_city, user_pincode, user_password, terms) VALUES (?,?,?,?,?,?,?)`;

    connection.query(
      createuser,
      [
        dairy_name,
        user_name,
        user_phone,
        user_city,
        user_pincode,
        user_password,
        terms,
        date,
      ],
      (err, result) => {
        connection.release();
        if (err) {
          console.error("Error in database query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }
        result.status(200).json({ message: "User register successfully!" });
      }
    );
  });
};

// .........................................
// Login....................................
// .........................................

exports.userLogin = async (req, res) => {
  const { user_id, user_password } = req.body;

  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const checkUser =
      "SELECT username, password, isActive, designation, SocietyCode, pcode FROM users WHERE username = ?";

    connection.query(checkUser, [user_id], (err, result) => {
      // Release the connection back to the pool
      connection.release();

      if (err) {
        console.error("Error in database query: ", err);
        return res.status(500).json({ message: "Database query error" });
      }

      if (result.length === 0) {
        return res
          .status(401)
          .json({ message: "Invalid User ID or password, try again!" });
      }

      const user = result[0];
      // Verify user password
      if (user_password !== user.password) {
        return res
          .status(401)
          .json({ message: "Invalid User ID and password, try again!" });
      }

      // Generate JWT token for authentication
      const token = jwt.sign(
        {
          user_id: user.username,
          user_code: user.pcode,
          is_active: user.isActive,
          user_role: user.designation,
          dairy_id: user.SocietyCode,
        },
        process.env.SECRET_KEY,
        { expiresIn: "4hr" }
      );

      // Set token in cookie
      res.cookie("token", token, {
        httpOnly: true,
        // secure: true,
        sameSite: "strict",
        maxAge: 4 * 60 * 60 * 1000, // 4 hours
      });

      // Send success response
      res.status(200).json({
        message: "Login successful",
        token,
        user_role: user.designation,
      });
    });
  });
};

//.................................................
//Logout user......................................
//.................................................

exports.userLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // Ensure this matches your setup (use only if you're using HTTPS)
    sameSite: "strict", // Adjust this setting based on your requirements
  });

  // Send a response indicating successful logout
  res.status(200).json({ message: "Logout successful" });
};

//.................................................
//Forget Password .................................
//.................................................

exports.getEmail = async (req, res) => {
  const { user_id } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      // Fetch the phone number from the database based on the user ID
      const getmobile = `SELECT email FROM customer WHERE fax = ?`;

      connection.query(getmobile, [user_id], (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          return res.status(404).json({ message: "email not found!" });
        }

        const email = result.email;
        // Send the result as a response
        res.status(200).json({
          email: email, //email
        });
      });
    } catch (error) {
      connection.release(); // Ensure the connection is released in case of an error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// .....................................SEND OTP


//..........................email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL, // Your email address
    pass: process.env.GPASS, // Your email password or app-specific password (for Gmail)
  },
});


// .....................................SEND OTP

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      // Generate a random 6-digit OTP
      const otp = Math.floor(1000 + Math.random() * 9990);

      // Update the OTP in the database
      const setOtp = `UPDATE users SET otp = ? WHERE email = ?`;

      connection.query(setOtp, [otp, email], (err, result) => {
        connection.release(); // Release the connection after the query
        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        // Send the OTP via email using Nodemailer
        const mailOptions = {
          from: process.env.GMAIL, // Sender address
          to: email, // Receiver's email address
          subject: "Your Password Reset OTP Code", // Subject of the email
          text: `Your Password Reset OTP code is: ${otp}`, // Plain text body
          html: `<p>Your OTP code is: <b>${otp}</b></p>`, // HTML body
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email: ", error);
            return res
              .status(500)
              .json({ message: "Failed to send OTP email" });
          }

          // OTP email sent successfully
          return res
            .status(200)
            .json({ message: "OTP sent successfully to your email!" });
        });
      });
    } catch (error) {
      connection.release(); // Ensure the connection is released in case of an error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//........................................Verify OTP

exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      // Check if the OTP matches in the database
      const verifyOtp = `SELECT username FROM users WHERE otp = ?`;

      connection.query(verifyOtp, [otp], (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          return res.status(400).json({ message: "Invalid OTP!" });
        }
        const user_id = result.username;
        // Send the result as a response
        res.status(200).json({
          user_id: user_id,
          message: "OTP verified successfully",
        });
      });
    } catch (error) {
      connection.release(); // Ensure the connection is released in case of an error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.........................................Update Password

exports.updatePassword = (req, res) => {
  const { password, user_id } = req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Update the password in the database
      const updatePassword = `UPDATE users SET password = ? WHERE userId = ?`; //change userid

      connection.query(
        updatePassword,
        [hashedPassword, user_id],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Database query error" });
          }

          if (result.length === 0) {
            return res.status(400).json({ message: "user not found!" });
          }

          // Send the result as a response
          res.status(200).json({
            message: "Password updated successfully",
          });
        }
      );
    } catch (error) {
      connection.release(); // Ensure the connection is released in case of an error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.................................................
//Dairy info ......................................
//.................................................

exports.dairyInfo = async (req, res) => {
  // Get a connection from the pool
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      // Get dairy_id from the verified token (already decoded in middleware)
      const dairy_id = req.user.dairy_id;

      if (!dairy_id) {
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // SQL query to get the dairy information
      const getDairyInfo = `
        SELECT SocietyName, Address, PhoneNo, city, PinCode 
        FROM societymaster 
        WHERE SocietyCode = ?
      `;

      // Execute the query
      connection.query(getDairyInfo, [dairy_id], (err, result) => {
        connection.release(); // Release the connection back to the pool

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          return res.status(404).json({ message: "Dairy not found!" });
        }

        // Send the result as a response
        res.status(200).json({
          dairyInfo: result[0],
        });
      });
    } catch (error) {
      connection.release(); // Ensure the connection is released in case of an error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
