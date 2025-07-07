const dotenv = require("dotenv");
dotenv.config({ path: "Backend/.env" });
const pool = require("../Configs/Database");

// ------------------------------------------------------------------------------------>
// Create New Feature Access ---------------------------------------------------------->
// ------------------------------------------------------------------------------------>

exports.getAllDairy = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const getDairydata = `
      SELECT SocietyCode, SocietyName FROM societymaster;
      `;

      // Execute the query
      connection.query(getDairydata, [], (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }
        res
          .status(200)
          .json({ message: "All dairy data!", alldairyInfo: result });
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ------------------------------------------------------------------------------------>
// Create New Feature Access ---------------------------------------------------------->
// ------------------------------------------------------------------------------------>

exports.createNewAccess = async (req, res) => {
  const { access_name, access_desc } = req.body;
  if (!access_name) {
    console.log("access_name not recived!");
    return;
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const cereate_access = `
      INSERT INTO app_features 
      (name , description)
        VALUES ( ?, ?)
      `;

      // Execute the query
      connection.query(
        cereate_access,
        [access_name, access_desc],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ message: "New access created successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ------------------------------------------------------------------------------------>
// Add Feature Access to Dairy -------------------------------------------------------->
// ------------------------------------------------------------------------------------>

exports.addNewAccess = async (req, res) => {
  const { access_name, access_desc } = req.body;
  if (!access_name) {
    console.log("access_name not recived!");
    return;
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const cereate_access = `
      INSERT INTO app_features 
      (name , description)
        VALUES ( ?, ?)
      `;

      // Execute the query
      connection.query(
        cereate_access,
        [access_name, access_desc],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ message: "New access created successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ------------------------------------------------------------------------------------>
// Update amc for one dairy ----------------------------------------------------------->
// ------------------------------------------------------------------------------------>

exports.updateOneDAmc = async (req, res) => {
  const { access_name, access_desc } = req.body;
  if (!access_name) {
    console.log("access_name not recived!");
    return;
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const cereate_access = `
      INSERT INTO app_features 
      (name , description)
        VALUES ( ?, ?)
      `;

      // Execute the query
      connection.query(
        cereate_access,
        [access_name, access_desc],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ message: "New access created successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
// ------------------------------------------------------------------------------------>
// Update amc for all dairy ----------------------------------------------------------->
// ------------------------------------------------------------------------------------>

exports.updateAllDAmc = async (req, res) => {
  const { type, amount } = req.body;

  if (!type || !amount) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing type or amount in request body" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      let updateQuery = "";

      if (type === "rs") {
        // Add fixed rupees to all AMC
        updateQuery = `UPDATE societymaster SET amc = amc + ?`;
      } else if (type === "%") {
        // Add percentage to AMC
        updateQuery = `UPDATE societymaster SET amc = amc + (amc * ? / 100)`;
      } else {
        connection.release();
        return res
          .status(400)
          .json({ message: "Invalid type. Must be 'rs' or '%'." });
      }

      connection.query(updateQuery, [amount], (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        return res.status(200).json({
          message: "AMC amounts updated successfully",
          affectedRows: result.affectedRows,
        });
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
