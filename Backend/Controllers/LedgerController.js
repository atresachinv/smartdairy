const pool = require("../Configs/Database");

// ----------------------------------------------------------------------------->
// get max main ledger code
// ----------------------------------------------------------------------------->
exports.maxMainLCode = async (req, res) => {
  const { dairy_id, center_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const query =
        "SELECT MAX(code) AS maxMainGL FROM mainglmaster WHERE dairy_id = ? AND center_id = ?";

      connection.query(query, [dairy_id, center_id], (error, results) => {
        // Release connection after query execution
        connection.release();

        if (error) {
          console.error("Error executing query: ", error);
          return res
            .status(500)
            .json({ status: 500, message: "Error executing query" });
        }

        // Fetching maxCustNo from results
        const maxMainGL = results[0]?.maxMainGL || 0; // Use maxCustNo instead of maxCid
        const maxMainGLCode = maxMainGL + 1;

        // Return the new customer number
        return res.status(200).json({ status: 200, maxMainGLCode });
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

// ----------------------------------------------------------------------------->
// get max sub ledger code
// ----------------------------------------------------------------------------->
exports.maxSubLCode = async (req, res) => {
  const { dairy_id, center_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const query =
        "SELECT MAX(lno) AS maxSubGL FROM subledgermaster WHERE dairy_id = ? AND center_id = ?";

      connection.query(query, [dairy_id, center_id], (error, results) => {
        // Release connection after query execution
        connection.release();

        if (error) {
          console.error("Error executing query: ", error);
          return res
            .status(500)
            .json({ status: 500, message: "Error executing query" });
        }

        // Fetching maxCustNo from results
        const maxSubGL = results[0]?.maxSubGL || 0; // Use maxCustNo instead of maxCid
        const maxSubGLCode = maxSubGL + 1;

        // Return the new customer number
        return res.status(200).json({ status: 200, maxSubGLCode });
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

// ----------------------------------------------------------------------------->
// Create New Ledger
// ----------------------------------------------------------------------------->
exports.createMainLedger = async (req, res) => {
  const { date, code, eng_name, marathi_name, category } = req.body;
  const { user_id } = req.user;
  if (!date || !code || !eng_name || !marathi_name || !category) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields data required!" });
  }

  if (!user_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const insertQuery = `
        INSERT INTO mainglmaster (code, gl_name, gl_marathi_name, gl_category, createdon, createdby) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      connection.query(
        insertQuery,
        [code, eng_name, marathi_name, category, date, user_id],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Database query error!" });
          }

          res.status(200).json({
            status: 200,
            message: "Main Ledger created successfully!",
          });
        }
      );
    } catch (error) {
      console.error("Error while fetching items: ", error);
      return res.status(500).json({
        status: 500,
        message: "Error while creating new main ledger!",
        error: error.message,
      });
    }
  });
};

// ----------------------------------------------------------------------------->
// Create New Ledger
// ----------------------------------------------------------------------------->

exports.fetchAllMainLedger = async (req, res) => {
  const { dairy_id, center_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const fetchQuery = `
        SELECT code, gl_name, gl_marathi_name, gl_category FROM mainglmaster WHERE dairy_id = ? AND center_id = ?
      `;

      connection.query(fetchQuery, [dairy_id, center_id], (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Database query error!" });
        }

        if (result.length === 0) {
          return res.status(201).json({
            status: 201,
            message: "No main ledgers found!",
            mainGLedger: [],
          });
        }

        res.status(200).json({
          status: 200,
          mainGLedger: result,
        });
      });
    } catch (error) {
      console.error("Error while fetching items: ", error);
      return res.status(500).json({
        status: 500,
        message: "Error while fetching items",
        error: error.message,
      });
    }
  });
};
// ----------------------------------------------------------------------------->
// Create New  Sub Ledger
// ----------------------------------------------------------------------------->

exports.createSubLedger = async (req, res) => {
  const formData = req.body;
  const { dairy_id, center_id, user_id } = req.user;
  if (!dairy_id || !user_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  if (!formData) {
    return res
      .status(400)
      .json({ status: 400, message: "All field data required!" });
  }

  const {
    date,
    code,
    groupcode,
    groupname,
    eng_name,
    marathi_name,
    sanghahead,
    perltramt,
    subAcc,
    vcsms,
  } = formData;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const insertquery = `
      INSERT INTO subledgermaster 
      (lno, dairy_id, center_id, group_code, group_name, ledger_name, marathi_name, subacc, sangha_head, per_ltr_amt, vcsms, createdon, createdby)
      VALUES (?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      connection.query(
        insertquery,
        [
          code,
          dairy_id,
          center_id,
          groupcode,
          groupname,
          eng_name,
          marathi_name,
          subAcc,
          sanghahead,
          perltramt,
          vcsms,
          date,
          user_id,
        ],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Database query error!" });
          }

          res.status(200).json({
            status: 200,
            message: "Sub ledger created successfully!",
          });
        }
      );
    } catch (error) {
      console.error("Error while fetching items: ", error);
      return res.status(500).json({
        status: 500,
        message: "Error while fetching items",
        error: error.message,
      });
    }
  });
};

// ----------------------------------------------------------------------------->
// Update sub Ledger
// ----------------------------------------------------------------------------->
exports.updateSubLedger = async (req, res) => {
  const formData = req.query;
  const { dairy_id, user_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  if (!formData) {
    return res
      .status(400)
      .json({ status: 400, message: "All field data required!" });
  }

  const {
    date,
    id,
    groupcode,
    groupname,
    eng_name,
    marathi_name,
    sanghahead,
    perltramt,
    subAcc,
    vcsms,
  } = formData;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      let updatequery = `UPDATE subledgermaster 
      SET group_code = ?, group_name = ?, ledger_name = ?, marathi_name = ?, subacc = ?, sangha_head = ?, per_ltr_amt = ?, vcsms = ?, updatedon = ?, updatedby = ?
      WHERE id=?`;

      connection.query(
        updatequery,
        [
          groupcode,
          groupname,
          eng_name,
          marathi_name,
          subAcc,
          sanghahead,
          perltramt,
          vcsms,
          date,
          user_id,
          id,
        ],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Database query error" });
          }

          res.status(200).json({
            status: 200,
            message: "Sub Ledger information updated successfully!",
          });
        }
      );
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Error while fetching items",
        error: error.message,
      });
    }
  });
};

// ----------------------------------------------------------------------------->
// Delete sub Ledger
// ----------------------------------------------------------------------------->

exports.deleteSubLedger = async (req, res) => {
  const {} = req.query;
  const { dairy_id, center_id } = req.user;
  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      let query = `DELETE FROM subledgermaster WHERE id=?`;
      const queryParams = [companyid, center_id];

      connection.query(query, queryParams, (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error!" });
        }

        res.status(200).json({
          status: 200,
          message: "Sub ledger deleted successfully!",
        });
      });
    } catch (error) {
      console.error("Error while fetching items: ", error);
      return res.status(500).json({
        success: false,
        message: "Error while fetching items",
        error: error.message,
      });
    }
  });
};

// ----------------------------------------------------------------------------->
// List all sub Ledger
// ----------------------------------------------------------------------------->
exports.fetchAllSubLedger = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      let fetchquery = `
      SELECT id, lno, group_code, group_name, ledger_name, marathi_name, subacc, sangha_head, per_ltr_amt, vcsms
      FROM subledgermaster
      WHERE dairy_id = ? AND center_id = ?
      `;

      connection.query(fetchquery, [dairy_id, center_id], (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Database query error!" });
        }

        if (result.length === 0) {
          return res.status(201).json({
            status: 201,
            message: "No sub ledgers found!",
            subLedgerList: [],
          });
        }

        res.status(200).json({ status: 200, subLedgerList: result });
      });
    } catch (error) {
      console.error("Error while fetching items: ", error);
      return res.status(500).json({
        status: 500,
        message: "Error while fetching sub ledger list!",
        error: error.message,
      });
    }
  });
};
