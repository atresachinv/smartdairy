const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

// Register ***********************************
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

// Login ******************************
// exports.userLogin = async (req, res) => {
//   const { user_id, user_password } = req.body;
//
//   const checkUser =
//     "SELECT username, password, isActive, designation FROM users WHERE username = ?";
//   connectDB.query(checkUser, [user_id], (err, result) => {
//     if (err) {
//       console.log("Database error", err);
//       return res.status(500).json({ message: "Database error!" });
//     }
//
//     if (result.length === 0) {
//       return res
//         .status(401)
//         .json({ message: "Invalid User ID and password, try again!" });
//     }
//
//     const user = result[0];
//
//     // checking user password with saved password
//     if (user_password !== user.password) {
//       return res
//         .status(401)
//         .json({ message: "Invalid User ID and password, try again!" });
//     }
//
//     // Generating JWT token for authentication
//     const token = jwt.sign(
//       {
//         user_id: user.username,
//         is_active: user.isActive,
//         user_role: user.designation,
//       },
//       process.env.SECRET_KEY,
//       { expiresIn: "4hr" }
//     );
//
//     res.cookie("token", token, {
//       httpOnly: true,
//       maxAge: 4 * 60 * 60 * 1000, // 4 hours
//     });
//
//     res.status(200).json({ message: "Login successful", token });
//   });
// };

//working login
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
          .json({ message: "Invalid User ID and password, try again!" });
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
      res
        .status(200)
        .json({
          message: "Login successful",
          token,
          user_role: user.designation,
        });
    });
  });
};

// exports.userLogin = async (req, res) => {
//   const { user_id, user_password } = req.body;
//
//   // Get a connection from the pool
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     // Step 1: Validate user credentials from the users table
//     const checkUser =
//       "SELECT username, password, isActive, designation, SocietyCode FROM users WHERE username = ?";
//
//     connection.query(checkUser, [user_id], (err, result) => {
//       if (err) {
//         console.error("Error in database query: ", err);
//         connection.release();
//         return res.status(500).json({ message: "Database query error" });
//       }
//
//       if (result.length === 0) {
//         connection.release();
//         return res
//           .status(401)
//           .json({ message: "Invalid User ID and password, try again!" });
//       }
//
//       const user = result[0];
//       const societycode = user.SocietyCode;
//
//       // Verify user password
//       if (user_password !== user.password) {
//         connection.release();
//         return res
//           .status(401)
//           .json({ message: "Invalid User ID or password, try again!" });
//       }
//
//       // Step 2: Fetch company details using the companycode
//       const fetchDetails =
//         "SELECT SocietyCode, city FROM Societymaster WHERE SocietyCode = ?";
//
//       connection.query(fetchDetails, [societycode], (err, qResult) => {
//         if (err) {
//           console.error("Error fetching company details: ", err);
//           connection.release();
//           return res
//             .status(500)
//             .json({ message: "Error fetching company details" });
//         }
//
//         if (qResult.length === 0) {
//           connection.release();
//           return res.status(404).json({ message: "Company not found" });
//         }
//
//         const SocietyInfo = qResult[0];
//
//         // Step 3: Fetch other necessary data from different tables if needed
//
// //         // Example: Fetch additional data (e.g., product data) related to the company
// //         const DashboardInfo = "SELECT * FROM products WHERE companycode = ?";
// //
// //         connection.query(
// //           fetchAdditionalData,
// //           [societycode],
// //           (err, additionalDataResult) => {
// //             connection.release();
// //
// //             if (err) {
// //               console.error("Error fetching additional data: ", err);
// //               return res
// //                 .status(500)
// //                 .json({ message: "Error fetching additional data" });
// //             }
// //
//             // Generate JWT token for authentication
//             const token = jwt.sign(
//               {
//                 user_id: user.username,
//                 is_active: user.isActive,
//                 user_role: user.designation,
//               },
//               process.env.SECRET_KEY,
//               { expiresIn: "4hr" }
//             );
//
//             // Set token in cookie
//             res.cookie("token", token, {
//               httpOnly: true,
//               sameSite: "strict",
//               maxAge: 4 * 60 * 60 * 1000, // 4 hours
//             });
//
//             // Send success response with all relevant information
//             res.status(200).json({
//               message: "Login successful",
//               token,
//               company_name: companyInfo.company_name,
//               city: companyInfo.city,
//               dashboard_info: companyInfo.dashboard_info,
//              // DashboardInfo: additionalDataResult,
//             });
//           }
//         );
//       });
//     });
//   // });
// };

// Logout ******************************************** */

exports.userLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, // Ensure this matches your setup (use only if you're using HTTPS)
    sameSite: "strict", // Adjust this setting based on your requirements
  });

  // Send a response indicating successful logout
  res.status(200).json({ message: "Logout successful" });
};
