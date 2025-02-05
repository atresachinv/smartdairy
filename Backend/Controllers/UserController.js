const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

dotenv.config({ path: "Backend/.env" });

// .........................................
// Register.................................
// .........................................
// don't delete working function
// exports.userRegister = async (req, res) => {
//   const {
//     dairy_name,
//     user_name,
//     user_phone,
//     user_city,
//     user_pincode,
//     user_password,
//     terms,
//     prefix,
//     date,
//     endDate,
//   } = req.body;
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     // Query to get the maximum SocietCode
//     const getMaxSocietCode = `SELECT MAX(SocietyCode) AS maxCode FROM societymaster`;
//
//     connection.query(getMaxSocietCode, (err, result) => {
//       if (err) {
//         connection.release();
//         console.error("Error fetching max SocietyCode: ", err);
//         return res.status(500).json({ message: "Database query error" });
//       }
//
//       // Increment SocietCode by 1
//       const newSocietCode = result[0].maxCode ? result[0].maxCode + 1 : 1;
//
//       // Query to insert into societymaster
//       const createdairy = `INSERT INTO societymaster (SocietyCode, SocietyName, PhoneNo, city, PinCode, prefix, terms, startdate, enddate) VALUES (?,?,?,?,?,?,?,?,?)`;
//
//       connection.query(
//         createdairy,
//         [
//           newSocietCode,
//           dairy_name,
//           user_phone,
//           user_city,
//           user_pincode,
//           prefix,
//           terms,
//           date,
//           endDate,
//         ],
//         (err, result) => {
//           if (err) {
//             connection.release();
//             console.error("Error inserting into societymaster: ", err);
//             return res.status(500).json({ message: "Database query error" });
//           }
//           const designation = "Admin";
//           const isAdmin = "1";
//           // Query to insert into users
//           const createuser = `INSERT INTO users (username, password, designation, isAdmin, SocietyCode ) VALUES (?,?,?,?,?)`;
//
//           connection.query(
//             createuser,
//             [user_name, user_password, designation, isAdmin, newSocietCode],
//             (err, result) => {
//               connection.release();
//               if (err) {
//                 console.error("Error inserting into users: ", err);
//                 return res
//                   .status(500)
//                   .json({ message: "Database query error" });
//               }
//
//               // Success response
//               res
//                 .status(200)
//                 .json({ message: "User registered successfully!" });
//             }
//           );
//         }
//       );
//     });
//   });
// };

//v2 function
exports.userRegister = async (req, res) => {
  const {
    dairy_name,
    user_name,
    user_phone,
    user_city,
    user_pincode,
    user_password,
    terms,
    prefix,
    date,
    endDate,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    // Query to get the maximum SocietCode
    const getMaxSocietCode = `SELECT MAX(SocietyCode) AS maxCode FROM societymaster`;

    connection.query(getMaxSocietCode, (err, result) => {
      if (err) {
        connection.release();
        console.error("Error fetching max SocietyCode: ", err);
        return res.status(500).json({ message: "Database query error" });
      }

      // Increment SocietCode by 1
      const newSocietCode = result[0].maxCode ? result[0].maxCode + 1 : 1;

      // Query to insert into societymaster
      const createdairy = `INSERT INTO societymaster (SocietyCode, SocietyName, PhoneNo, city, PinCode, prefix, terms, startdate, enddate) VALUES (?,?,?,?,?,?,?,?,?)`;

      connection.query(
        createdairy,
        [
          newSocietCode,
          dairy_name,
          user_phone,
          user_city,
          user_pincode,
          prefix,
          terms,
          date,
          endDate,
        ],
        (err, result) => {
          if (err) {
            connection.release();
            console.error("Error inserting into societymaster: ", err);
            return res.status(500).json({ message: "Database query error" });
          }

          // Query to insert into centermaster
          const createcenter = `INSERT INTO centermaster (center_id, center_name, marathi_name, mobile, city, pincode, orgid, prefix) VALUES (?,?,?,?,?,?,?)`;

          connection.query(
            createcenter,
            [
              0,
              dairy_name,
              dairy_name,
              user_phone,
              user_city,
              user_pincode,
              newSocietCode,
              prefix,
            ],
            (err, result) => {
              if (err) {
                connection.release();
                console.error("Error inserting into centermaster: ", err);
                return res
                  .status(500)
                  .json({ message: "Database query error" });
              }

              const designation = "Admin";
              const isAdmin = "1";
              // Query to insert into users
              const createuser = `INSERT INTO users (username, password, designation, isAdmin, SocietyCode) VALUES (?,?,?,?,?)`;

              connection.query(
                createuser,
                [user_name, user_password, designation, isAdmin, newSocietCode],
                (err, result) => {
                  connection.release();
                  if (err) {
                    console.error("Error inserting into users: ", err);
                    return res
                      .status(500)
                      .json({ message: "Database query error" });
                  }

                  // Success response
                  res
                    .status(200)
                    .json({ message: "User registered successfully!" });
                }
              );
            }
          );
        }
      );
    });
  });
};

//---------------------------------------------------------------------------->
// Login --------------------------------------------------------------------->
//---------------------------------------------------------------------------->

// updated function with session token ------------------------>
// exports.userLogin = async (req, res) => {
//   const { user_id, user_password } = req.body;
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     try {
//       const checkUser =
//         "SELECT username, isActive, designation, SocietyCode, pcode, center_id, session_token FROM users WHERE username = ? AND password = ?";
//
//       connection.query(checkUser, [user_id, user_password], (err, result) => {
//         if (err) {
//           connection.release();
//           return res.status(500).json({ message: "Database query error" });
//         }
//
//         if (result.length === 0) {
//           connection.release();
//           return res
//             .status(401)
//             .json({ message: "Invalid User ID or password, try again!" });
//         }
//
//         const user = result[0];
//
//         // Check if user is already logged in
//         if (user.session_token) {
//           connection.release();
//           return res.status(403).json({
//             message:
//               "You are already logged in from another device. Please logout first.",
//           });
//         }
//
//         // Generate a new session token
//         const sessionToken = crypto.randomBytes(32).toString("hex");
//
//         // Generate JWT token for authentication
//         const token = jwt.sign(
//           {
//             user_id: user.username,
//             user_code: user.pcode,
//             is_active: user.isActive,
//             user_role: user.designation,
//             dairy_id: user.SocietyCode,
//             center_id: user.center_id,
//           },
//           process.env.SECRET_KEY,
//           { expiresIn: "4hr" }
//         );
//
//         // Update the user's session_token in the database
//         const updateSession =
//           "UPDATE users SET session_token = ? WHERE username = ?";
//         connection.query(
//           updateSession,
//           [sessionToken, user.username],
//           (err) => {
//             connection.release();
//             if (err) {
//               return res
//                 .status(500)
//                 .json({ message: "Error updating session" });
//             }
//
//             // Set token in cookie
//             res.cookie("token", token, {
//               httpOnly: true,
//               sameSite: "strict",
//               // secure: true,
//               maxAge: 4 * 60 * 60 * 1000, // 4hr
//             });
//
//             res.status(200).json({
//               message: "Login successful",
//               token,
//               user_role: user.designation,
//               sessionToken,
//             });
//           }
//         );
//       });
//     } catch (error) {
//       connection.release();
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };
// updated function with session token ------------------------>
exports.userLogin = async (req, res) => {
  const { user_id, user_password } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const checkUser =
        "SELECT username, isActive, designation, SocietyCode, pcode, center_id FROM users WHERE username = ? AND password = ?";

      connection.query(checkUser, [user_id, user_password], (err, result) => {
        if (err) {
          connection.release();
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          connection.release();
          return res
            .status(401)
            .json({ message: "Invalid User ID or password!" });
        }

        const user = result[0];

        // Generate a new session token
        const sessionToken = crypto.randomBytes(32).toString("hex");

        // Generate JWT token
        const token = jwt.sign(
          {
            user_id: user.username,
            user_code: user.pcode,
            is_active: user.isActive,
            user_role: user.designation,
            dairy_id: user.SocietyCode,
            center_id: user.center_id,
          },
          process.env.SECRET_KEY,
          { expiresIn: "4h" }
        );

        // Invalidate any existing session before setting a new one
        const updateSession =
          "UPDATE users SET session_token = ? WHERE username = ?";
        connection.query(
          updateSession,
          [sessionToken, user.username],
          (err) => {
            connection.release();
            if (err) {
              return res
                .status(500)
                .json({ message: "Error updating session" });
            }

            // Set token in cookie
            res.cookie("token", token, {
              httpOnly: true,
              sameSite: "strict",
              maxAge: 4 * 60 * 60 * 1000, // 4 hours
            });

            res.status(200).json({
              message: "Login successful",
              token,
              user_role: user.designation,
              sessionToken,
            });
          }
        );
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// .....................................................
// User Designation ....................................
// .....................................................

//.................................................
//Logout user......................................
//.................................................

exports.userLogout = (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "User not found or not logged in" });
  }

  const user_id = req.user.user_id;
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ message: "Database connection error" });
    }
    const logoutQuery =
      "UPDATE users SET session_token = NULL WHERE username = ?";
    connection.query(logoutQuery, [user_id], (err) => {
      connection.release();
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      // Clear JWT token in cookies
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.status(200).json({ message: "Logout successful" });
    });
  });
};

//---------------------------------------------------------------------------->
//Logout user------------------------------------------------------------------>
//---------------------------------------------------------------------------->

exports.verifySession = (req, res) => {
  const { sessionToken } = req.body;

  if (!sessionToken) {
    return res.status(401).json({ message: "Session token required!" });
  }

  if (!req.user || !req.user.user_id) {
    return res.status(400).json({ message: "User ID is required!" });
  }

  const user_id = req.user.user_id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const query = "SELECT session_token FROM users WHERE username = ?";

    connection.query(query, [user_id], (err, result) => {
      connection.release();

      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Database query error" });
      }

      if (result.length === 0) {
        return res.status(401).json({
          message: "User not found. Please log in again.",
          valid: false,
        });
      }

      if (result[0].session_token !== sessionToken) {
        return res.status(401).json({
          message: "Session expired. Please log in again.",
          valid: false,
        });
      }

      res.status(200).json({ valid: true });
    });
  });
};

//------------------------------------------------------------------------------>
//User Information ------------------------------------------------------------->
//------------------------------------------------------------------------------>

exports.getUserProfile = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    const dairy_id = req.user.dairy_id;
    const center_id = req.user.center_id;
    const user_id = req.user.user_id;

    try {
      const getUserInfo = `SELECT emp_name, emp_mobile, emp_city, emp_tal, emp_dist, designation FROM employeemaster WHERE dairy_id = ? AND center_id = ? AND emp_mobile = ?`;

      connection.query(
        getUserInfo,
        [dairy_id, center_id, user_id],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Database query error" });
          }

          if (result.length === 0) {
            return res.status(404).json({ message: "User not found!" });
          }

          const userData = result[0];
          res.status(200).json({
            userData: userData,
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
