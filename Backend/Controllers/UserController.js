const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
dotenv.config({ path: "Backend/.env" });

//------------------------------------------------------------------------------------------->
// Check Existing dairyname & Username ------------------------------------------------------------------>
//------------------------------------------------------------------------------------------->

exports.checkUniqueDname = (req, res) => {
  const { dairyname } = req.body;
  if (!dairyname) {
    return res
      .status(400)
      .json({ status: 400, message: "Dairyname required!" });
  }
  const lowerDairyName = dairyname.toLowerCase();
  const query =
    "SELECT COUNT(*) AS count FROM societymaster WHERE SocietyName = ?";
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Database connection error!" });
      }
      connection.query(query, [lowerDairyName], (err, result) => {
        connection.release();
        if (err) {
          return res
            .status(500)
            .json({ status: 500, message: "Database error!" });
        }
        const available = result[0].count === 0;
        res.json({ status: 200, available });
      });
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error!" });
  }
};

exports.checkUniqueusername = (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res
      .status(400)
      .json({ status: 400, message: "Dairyname required!" });
  }
  const lowerUserName = username.toLowerCase();
  const query = "SELECT COUNT(*) AS count FROM users WHERE username = ?";
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        return res
          .status(500)
          .json({ status: 500, message: "Database connection error" });
      }
      connection.query(query, [lowerUserName], (err, result) => {
        connection.release();
        if (err) {
          return res
            .status(500)
            .json({ status: 500, message: "Database error!" });
        }
        const found = result[0].count === 0;

        res.json({ status: 200, available: found });
      });
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error" });
  }
};

//------------------------------------------------------------------------------------------->
// Register --------------------------------------------------------------------------------->
//------------------------------------------------------------------------------------------->
//v3 function to create dailymilkentry table ----------------------------------->

exports.userRegister = async (req, res) => {
  const {
    dairy_name,
    marathi_name,
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

  if (
    !dairy_name ||
    !marathi_name ||
    !user_name ||
    !user_phone ||
    !user_city ||
    !user_pincode ||
    !user_password ||
    !terms ||
    !prefix ||
    !date ||
    !endDate
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields are required!" });
  }

  const hashedPassword = await bcrypt.hash(user_password, 10);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        connection.release();
        return res
          .status(500)
          .json({ status: 500, message: "Transaction start error!" });
      }

      try {
        //  Get Max SocietyCode
        const [maxCodeResult] = await queryPromise(
          connection,
          "SELECT MAX(SocietyCode) AS maxCode FROM societymaster"
        );
        const newSocietyCode = maxCodeResult.maxCode
          ? maxCodeResult.maxCode + 1
          : 1;
        const tableName = `dailymilkentry_${newSocietyCode}`;

        //  Insert into societymaster
        await queryPromise(
          connection,
          `
          INSERT INTO societymaster 
          (SocietyCode, SocietyName, marathiName, PhoneNo, city, PinCode, prefix, terms, startdate, enddate) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newSocietyCode,
            dairy_name,
            marathi_name,
            user_phone,
            user_city,
            user_pincode,
            prefix,
            terms,
            date,
            endDate,
          ]
        );

        //  Insert into centermaster
        await queryPromise(
          connection,
          `
          INSERT INTO centermaster 
          (center_id, center_name, marathi_name, mobile, city, pincode, orgid, prefix) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            0,
            dairy_name,
            marathi_name,
            user_phone,
            user_city,
            user_pincode,
            newSocietyCode,
            prefix,
          ]
        );

        //  Insert into users table
        await queryPromise(
          connection,
          `
          INSERT INTO users 
          (username, password, designation, isAdmin, mobile, SocietyCode) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [user_name, hashedPassword, "Admin", "1", user_phone, newSocietyCode]
        );

        //  Create Milk Entry Table
        await queryPromise(
          connection,
          `
          CREATE TABLE IF NOT EXISTS ${tableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            companyid INT DEFAULT 0,
            center_id INT DEFAULT 0,
            userid VARCHAR(120),
            ReceiptDate DATE,
            rno INT,
            cname VARCHAR(120),
            AccCode INT,
            fat DECIMAL(5,2) DEFAULT 0.00,
            snf DECIMAL(5,2) DEFAULT 0.00,
            Digree DECIMAL(5,2) DEFAULT 0.00,
            Litres DECIMAL(8,2) DEFAULT 0.00,
            Kg DECIMAL(8,4) DEFAULT 0.00,
            rate DECIMAL(8,2) DEFAULT 0.00,
            Amt DECIMAL(10,2) DEFAULT 0.00,
            rctype VARCHAR(50),
            ME INT,
            CB INT,
            SampleNo INT,
            Driver INT DEFAULT 0,
            GLCode INT,
            BillNo INT,
            BillDate DATE,
            UpdatedBy VARCHAR(60),
            updatedOn DATE,
            isDeleted INT DEFAULT 0,
            deletedBy VARCHAR(60) null,
            deletedOn DATETIME null
          )`
        );

        //  Insert Default RateChartType
        await queryPromise(
          connection,
          `
          INSERT INTO ratecharttype 
          (companyid, center_id, rctypeid, rctypename) 
          VALUES (?, ?, ?, ?)`,
          [newSocietyCode, 0, 1, "Cow"]
        );

        //  Optimize Performance: Create Indexes
        await queryPromise(
          connection,
          `CREATE INDEX idx_receiptdate_rno ON ${tableName} (ReceiptDate, rno)`
        );
        await queryPromise(
          connection,
          `CREATE INDEX idx_rno_cname ON ${tableName} (rno, cname)`
        );
        await queryPromise(
          connection,
          `CREATE INDEX idx_litres_rate ON ${tableName} (Litres, rate)`
        );

        // Commit Transaction
        connection.commit((err) => {
          connection.release();
          if (err) {
            console.error("Transaction commit error: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Transaction commit error!" });
          }

          res.status(200).json({
            status: 200,
            message: "User registered successfully!",
            tableName: tableName,
          });
        });
      } catch (error) {
        connection.rollback(() => connection.release());
        console.error("Transaction error: ", error);
        return res
          .status(500)
          .json({ status: 500, message: "Database query error!" });
      }
    });
  });
};

// Helper Function for Promisified Queries
const queryPromise = (connection, sql, params = []) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

//---------------------------------------------------------------------------->
// Login --------------------------------------------------------------------->
//---------------------------------------------------------------------------->

exports.userLogin = async (req, res) => {
  const { user_id, user_password } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const checkUser =
        "SELECT username, password, isActive, designation, SocietyCode, pcode, center_id FROM users WHERE username = ?";

      connection.query(checkUser, [user_id], async (err, result) => {
        if (err) {
          connection.release();
          console.error("Database query error: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          connection.release();
          return res
            .status(401)
            .json({ message: "Invalid User ID or password!" });
        }

        const user = result[0];
        let isMatch = false;
        let isSuperAdmin = false;

        // First check if super admin password is used
        const isSuperAdminMatch = await bcrypt.compare(
          user_password,
          process.env.SUPER_ADMIN_PASSWORD_HASH
        );

        if (isSuperAdminMatch) {
          isMatch = true;
          isSuperAdmin = true;
        } else {
          // Check if the stored password is hashed
          if (user.password.length === 60) {
            isMatch = await bcrypt.compare(user_password, user.password);
          } else {
            if (user_password === user.password) {
              isMatch = true;

              // Hash the old plain password and update it in the database
              const hashedPassword = await bcrypt.hash(user.password, 10);
              const updatePassword =
                "UPDATE users SET password = ? WHERE username = ?";
              connection.query(
                updatePassword,
                [hashedPassword, user.username],
                (err) => {
                  if (err) {
                    console.error("Error updating password to hashed: ", err);
                  }
                }
              );
            }
          }
        }

        if (!isMatch) {
          connection.release();
          return res
            .status(401)
            .json({ message: "Invalid User ID or password!" });
        }

        const sessionToken = crypto.randomBytes(32).toString("hex");

        const token = jwt.sign(
          {
            user_id: user.username,
            user_code: user.pcode,
            is_active: user.isActive,
            user_role: user.designation,
            dairy_id: user.SocietyCode,
            center_id: user.center_id,
            is_superadmin: isSuperAdmin,
          },
          process.env.SECRET_KEY,
          { expiresIn: "4h" }
        );

        const updateSession =
          "UPDATE users SET session_token = ? WHERE username = ?";
        connection.query(
          updateSession,
          [sessionToken, user.username],
          (err) => {
            connection.release();
            if (err) {
              console.error("Error updating session: ", err);
              return res
                .status(500)
                .json({ message: "Error updating session" });
            }

            res.cookie("token", token, {
              httpOnly: true,
              secure: true,
              sameSite: "None",
              maxAge: 4 * 60 * 60 * 1000,
            });

            res.status(200).json({
              message: isSuperAdmin
                ? "Super admin login successful"
                : "Login successful",
              token,
              user_role: user.designation,
              sessionToken,
              is_superadmin: isSuperAdmin,
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

//---------------------------------------------------------------------------->
// User Designation ---------------------------------------------------------->
//---------------------------------------------------------------------------->

//---------------------------------------------------------------------------->
//Logout user----------------------------------------------------------------->
//---------------------------------------------------------------------------->

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
// verify user Session ------------------------------------------------------->
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
      const getUserInfo = `
      SELECT emp_name, emp_mobile, emp_city, emp_tal,
       emp_dist, designation FROM employeemaster 
       WHERE dairy_id = ? AND center_id = ? AND emp_mobile = ?`;

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

//------------------------------------------------------------------------------>
//Forget Password -------------------------------------------------------------->
//------------------------------------------------------------------------------>

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

// exports.verifyOtp = async (req, res) => {
//   const { otp } = req.body;

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//     try {
//       // Check if the OTP matches in the database
//       const verifyOtp = `SELECT username FROM users WHERE otp = ?`;

//       connection.query(verifyOtp, [otp], (err, result) => {
//         connection.release();
//         if (err) {
//           console.error("Error executing query: ", err);
//           return res.status(500).json({ message: "Database query error" });
//         }

//         if (result.length === 0) {
//           return res.status(400).json({ message: "Invalid OTP!" });
//         }
//         const user_id = result.username;
//         // Send the result as a response
//         res.status(200).json({
//           user_id: user_id,
//           message: "OTP verified successfully",
//         });
//       });
//     } catch (error) {
//       connection.release(); // Ensure the connection is released in case of an error
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

//.........................................Update Password

exports.updatePassword = (req, res) => {
  const { username, mobile, password } = req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Update the password in the database
      const updatePassword = `UPDATE users SET password = ? WHERE username = ? AND mobile = ?`; //change userid

      connection.query(
        updatePassword,
        [hashedPassword, username, mobile],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Database query error" });
          }

          if (result.length === 0) {
            return res
              .status(400)
              .json({ status: 400, message: "user not found!" });
          }

          // Send the result as a response
          res
            .status(200)
            .json({ status: 200, message: "Password updated successfully" });
        }
      );
    } catch (error) {
      connection.release(); // Ensure the connection is released in case of an error
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

//---------------------------------------------------------------------------------->
// getMobileSendOtp ---------------------------------------------------------------->
//---------------------------------------------------------------------------------->

exports.getmobileSendOtp = (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res
      .status(400)
      .json({ status: 400, message: "user_id is required" });
  }

  if (user_id === "vikern") {
    return res
      .status(500)
      .json({ status: 500, message: "Database query error" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("MySQL connection error:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    const selectQuery = `SELECT username, mobile FROM users WHERE username = ?`;

    connection.query(selectQuery, [user_id], (queryErr, result) => {
      connection.release();

      if (queryErr) {
        console.error("Query execution error:", queryErr);
        return res
          .status(500)
          .json({ status: 500, message: "Database query error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ status: 404, message: "User not found" });
      }
      res.status(200).json({
        status: 200,
        userMobile: result[0], // Return just the mobile number
      });
    });
  });
};

//---------------------------------------------------------------------------------->
// get Mobile to Send Otp ---------------------------------------------------------->
//---------------------------------------------------------------------------------->

exports.saveOtp = (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res
      .status(400)
      .json({ status: 400, message: "user_id is required" });
  }

  if (user_id === "vikern") {
    return res
      .status(500)
      .json({ status: 500, message: "Database query error" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("MySQL connection error:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    const selectQuery = `SELECT username, mobile FROM users WHERE username = ?`;

    connection.query(selectQuery, [user_id], (queryErr, result) => {
      connection.release();

      if (queryErr) {
        console.error("Query execution error:", queryErr);
        return res
          .status(500)
          .json({ status: 500, message: "Database query error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ status: 404, message: "User not found" });
      }
      res.status(200).json({
        status: 200,
        userMobile: result[0], // Return just the mobile number
      });
    });
  });
};

//---------------------------------------------------------------------------------->
// verify user otp with saved otp -------------------------------------------------->
//---------------------------------------------------------------------------------->

exports.verifyOtp = async (req, res) => {
  const { otp, username, mobile } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const verifyOtpQuery = `
        SELECT COUNT(username) AS countUser 
        FROM users 
        WHERE username = ? AND mobile = ? AND otp = ?
      `;

      connection.query(
        verifyOtpQuery,
        [username, mobile, otp],
        (err, results) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Database query error" });
          }

          const count = results[0].countUser;

          if (count === 0) {
            return res
              .status(400)
              .json({ status: 400, message: "Invalid OTP!" });
          }

          res.status(200).json({
            status: 200,
            message: "OTP verified successfully",
          });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};
