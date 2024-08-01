const jwt = require("jsonwebtoken");
const connectDB = require("../Configs/Database");
const dotenv = require("dotenv");
dotenv.config({ path: "Backend/.env" });

// Login ******************************
exports.userLogin = async (req, res) => {
  const { user_id, user_password } = req.body;

  const checkUser =
    "SELECT username, password, isActive, designation FROM users WHERE username = ?";
  connectDB.query(checkUser, [user_id], (err, result) => {
    if (err) {
      console.log("Database error", err);
      return res.status(500).json({ message: "Database error!" });
    }

    if (result.length === 0) {
      return res
        .status(401)
        .json({ message: "Invalid User ID and password, try again!" });
    }

    const user = result[0];

    // checking user password with saved password
    if (user_password !== user.password) {
      return res
        .status(401)
        .json({ message: "Invalid User ID and password, try again!" });
    }

    // Generating JWT token for authentication
    const token = jwt.sign(
      {
        user_id: user.username,
        is_active: user.isActive,
        user_role: user.designation,
      },
      process.env.SECRET_KEY,
      { expiresIn: "4hr" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 4 * 60 * 60 * 1000, // 4 hours
    });

    res.status(200).json({ message: "Login successful", token });
  });
};
