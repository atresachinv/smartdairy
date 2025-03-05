const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });
const NodeCache = require("node-cache");
const cache = new NodeCache({});

//.................................................
//find rate chart of perticular dairy / center  ...
//.................................................

exports.maxRateChartNo = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const maxRateChartNoQuery = `SELECT MAX(rccode) as maxRcCode FROM ratemaster WHERE companyid = ? AND center_id = ?`;

      connection.query(
        maxRateChartNoQuery,
        [dairy_id, center_id],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          const maxRcCode = result[0]?.maxRcCode
            ? Math.max(result[0].maxRcCode + 1, 1)
            : 1;

          res.status(200).json({
            maxRcCode: maxRcCode,
          });
        }
      );
    } catch (error) {
      connection.release();
      return res.status(400).json({ message: error.message });
    }
  });
};

//.................................................
//find rate chart of perticular dairy / center  ...
//.................................................

exports.maxRCTypeNo = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(400).json({ message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const maxRateChartNoQuery = `
        SELECT MAX(rctypeid) AS maxRctype FROM ratecharttype 
        WHERE companyid = ? AND center_id = ?
      `;

      connection.query(
        maxRateChartNoQuery,
        [dairy_id, center_id],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          const maxRcType =
            result[0]?.maxRctype !== null ? (result[0]?.maxRctype || 0) + 1 : 1;

          return res.status(200).json({
            maxRcType: maxRcType,
            message: "Max ratechart type number",
          });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error in try block:", error);
      return res.status(500).json({ message: error.message });
    }
  });
};

//--------------------------------------------------------------------------------->
// Save Rate Chart Type ----------------------------------------------------------->
//--------------------------------------------------------------------------------->

exports.saveRateChartType = async (req, res) => {
  const { rccode, rctype } = req.body;
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    console.log("Unauthorized User!");
    return res.status(400).json({ message: "Dairy ID not found!" });
  }

  // Acquire a connection from the pool
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const saveRatesQuery = `
        INSERT INTO ratecharttype (companyid, center_id, rctypeid, rctypename)
        VALUES( ?, ?, ?, ?)
      `;
      connection.query(
        saveRatesQuery,
        [dairy_id, center_id, rccode, rctype],
        (err, result) => {
          if (err) {
            connection.release();
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error" });
          }
          // Clear the cache for rate charts of this dairy_id and center_id
          const cacheKey = `ratecharts_${dairy_id}_${center_id}`;
          cache.del(cacheKey);

          connection.release();
          res.status(200).json({
            status: 200,
            message: "Ratechart type saved successfully!",
          });
        }
      );
    } catch (error) {
      connection.release();
      return res.status(400).json({ message: error.message });
    }
  });
};

// ....................................................
// To Show List Of Ratechart used by dairy ............
// ....................................................

//v2 function
exports.listAllRCTypes = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(400).json({ message: "Unauthorized User!" });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const rateChartListQuery = `
        SELECT id ,rctypename FROM ratecharttype
        WHERE companyid = ? AND center_id = ?
      `;

      connection.query(
        rateChartListQuery,
        [dairy_id, center_id],
        (err, result) => {
          connection.release(); // Ensure connection is released
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          if (result.affectedRows === 0) {
            res.status(200).json({
              ratechartTypes: [],
              message: "Ratechart types not found!",
            });
          }
          res.status(200).json({
            ratechartTypes: result,
            message: "Ratechart types found!",
          });
        }
      );
    } catch (error) {
      connection.release(); // Ensure the connection is released on error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.........................................................
// Save Rate Chart ........................................
//.........................................................

//v2 function
exports.saveRateChart = async (req, res) => {
  const { rccode, rctype, rcdate, ratechart } = req.body;

  // Acquire a connection from the pool
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // Start transaction
      connection.beginTransaction();

      const rctypecode = 0;
      const saveRatesQuery = `
        INSERT INTO ratemaster (companyid, rccode, rcdate, rctypecode, rctypename, fat, snf, rate, center_id)
        VALUES ?
      `;

      const values = ratechart.map((record, index) => {
        let { fat, snf, rate } = record;

        if (
          typeof fat !== "number" ||
          typeof snf !== "number" ||
          typeof rate !== "number"
        ) {
          throw new Error(
            `Invalid record format at index ${index}. Each rate record must have numeric FAT, SNF, and Rate.`
          );
        }

        fat = parseFloat(fat.toFixed(1));
        snf = parseFloat(snf.toFixed(1));
        rate = parseFloat(rate.toFixed(2));

        return [
          dairy_id,
          rccode,
          rcdate,
          rctypecode,
          rctype,
          fat,
          snf,
          rate,
          center_id,
        ];
      });

      connection.query(saveRatesQuery, [values], async (err, results) => {
        if (err) {
          connection.rollback();
          connection.release();
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Query execution error" });
        }

        // Commit the transaction
        await connection.commit();
        connection.release();

        // // Clear the cache for rate charts of this dairy_id and center_id
        // const cacheKey = `ratecharts_${dairy_id}_${center_id}`;
        // cache.del(cacheKey);

        res.status(200).json({
          status: 200,
          message: "Ratechart saved successfully!",
        });
      });
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error("Error rolling back transaction:", rollbackError);
        }
        connection.release();
      }
      return res.status(400).json({ message: error.message });
    }
  });
};

//.................................................
//Apply rate chart ................................
//.................................................

//v2 function
exports.applyRateChart = async (req, res) => {
  const { applydate, custFrom, custTo, ratechart } = req.body;
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id || !center_id) {
        connection.release();
        return res
          .status(400)
          .json({ message: "Dairy ID or Center ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Start transaction
      connection.beginTransaction(async (err) => {
        if (err) {
          connection.release();
          console.error("Error starting transaction: ", err);
          return res.status(500).json({ message: "Transaction error" });
        }

        try {
          // Fetch milk collection data
          const fetchCollectionQuery = `
            SELECT id, litres, fat, snf
            FROM ${dairy_table}
            WHERE center_id = ? AND ReceiptDate >= ?
          `;

          const milkEntries = await new Promise((resolve, reject) => {
            connection.query(
              fetchCollectionQuery,
              [center_id, applydate],
              (err, results) => {
                if (err) return reject(err);
                resolve(results);
              }
            );
          });

          if (milkEntries.length === 0) {
            throw new Error("No milk entries found!");
          }

          // Prepare updates based on ratechart
          const updates = milkEntries.map((entry) => {
            const { id, litres, fat, snf } = entry;

            // Find matching rate from the ratechart
            const rateRecord = ratechart.find(
              (record) =>
                parseFloat(record.fat.toFixed(1)) ===
                  parseFloat(fat.toFixed(1)) &&
                parseFloat(record.snf.toFixed(1)) === parseFloat(snf.toFixed(1))
            );

            if (!rateRecord) {
              throw new Error(
                `No matching rate found for FAT: ${fat}, SNF: ${snf}`
              );
            }

            const rate = parseFloat(rateRecord.rate.toFixed(2));
            const amt = parseFloat((litres * rate).toFixed(2));

            return { id, rate, amt };
          });

          // Update the records in the database
          for (const update of updates) {
            await new Promise((resolve, reject) => {
              const updateQuery = `
                UPDATE ${dairy_table}
                SET rate = ?, Amt = ?
                WHERE id = ?
              `;

              connection.query(
                updateQuery,
                [update.rate, update.amt, update.id],
                (err, result) => {
                  if (err) return reject(err);
                  resolve(result);
                }
              );
            });
          }

          // Commit transaction
          connection.commit((err) => {
            if (err) {
              connection.rollback(() => connection.release());
              console.error("Error committing transaction: ", err);
              return res
                .status(500)
                .json({ message: "Transaction commit error" });
            }

            connection.release();
            res.status(200).json({
              message:
                "Ratechart applied and dairy milk data updated successfully!",
              updatedRows: updates.length,
            });
          });
        } catch (error) {
          connection.rollback(() => connection.release());
          console.error("Transaction rolled back due to error: ", error);
          res
            .status(500)
            .json({ message: "Transaction failed", error: error.message });
        }
      });
    } catch (error) {
      connection.release();
      console.error("Error: ", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  });
};

// .............................................................................
// Updating selected Ratechart .................................................
// .............................................................................

//v2 function
exports.updateSelectedRateChart = async (req, res) => {
  const { amt, rccode, rcdate, rctype, rate } = req.body;

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // Parse amt
      const parsedAmt = parseFloat(amt);
      if (isNaN(parsedAmt)) {
        connection.release();
        return res.status(400).json({ message: "Invalid amount value!" });
      }

      const updateAmount = parsedAmt; // Use parsedAmt directly

      // Adjust rates dynamically based on amt
      const updatedRates = rate.map((record) => ({
        ...record,
        rate: parseFloat((record.rate + updateAmount).toFixed(2)), // Add or subtract amt
      }));

      // Start a transaction
      await connection.beginTransaction();

      const updateRateQuery = `
        UPDATE ratemaster
        SET rate = ?
        WHERE companyid = ? AND center_id = ? AND rcdate = ? AND rccode = ? AND rctypename = ? AND fat = ? AND snf = ?
      `;

      for (const record of updatedRates) {
        await new Promise((resolve, reject) => {
          connection.query(
            updateRateQuery,
            [
              record.rate, // Updated rate
              dairy_id,
              center_id,
              rcdate,
              rccode,
              rctype,
              record.fat,
              record.snf,
            ],
            (err, result) => {
              if (err) {
                // If any error occurs, rollback the transaction and reject
                console.error("Error updating rate: ", err);
                return connection.rollback(() => {
                  reject(err);
                });
              }
              resolve();
            }
          );
        });
      }

      // If all updates are successful, commit the transaction
      await new Promise((resolve, reject) => {
        connection.commit((err) => {
          if (err) {
            // If commit fails, rollback the transaction and reject
            console.error("Error committing transaction: ", err);
            return connection.rollback(() => {
              reject(err);
            });
          }
          resolve();
        });
      });

      connection.release(); // Release connection after transaction

      res.status(200).json({
        message: "Ratechart updated successfully!",
        affectedRowsCount,
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// .............................................................................
// Save Updated Ratechart ......................................................
// .............................................................................

exports.saveUpdatedRC = async (req, res) => {
  const { ratechart, rccode, rctype, animal, time } = req.body;

  // Acquire a connection from the pool
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // Start transaction
      await connection.beginTransaction();

      const saveRatesQuery = `
        INSERT INTO ratemaster (companyid, rccode, rcdate, rctypecode, rctypename, cb, fat, snf, rate, time, center_id)
        VALUES ?
      `;

      const values = ratechart.map((record, index) => {
        let { fat, snf, rcdate, rate } = record;

        if (
          typeof fat !== "number" ||
          typeof snf !== "number" ||
          typeof rate !== "number"
        ) {
          throw new Error(
            `Invalid record format at index ${index}. Each rate record must have numeric FAT, SNF, and Rate.`
          );
        }

        fat = parseFloat(fat.toFixed(1));
        snf = parseFloat(snf.toFixed(1));
        rate = parseFloat(rate.toFixed(2));

        return [
          dairy_id,
          rccode,
          rcdate,
          0,
          rctype,
          animal,
          fat,
          snf,
          rate,
          time,
          center_id,
        ];
      });

      connection.query(saveRatesQuery, [values], async (err, results) => {
        if (err) {
          await connection.rollback();
          connection.release();
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        // Commit the transaction
        await connection.commit();
        connection.release();

        res.status(200).json({
          message: "Ratechart saved successfully!",
          insertedRecords: results.affectedRows,
        });
      });
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error("Error rolling back transaction:", rollbackError);
        }
        connection.release();
      }
      return res.status(400).json({ message: error.message });
    }
  });
};

//--------------------------------------------------------------------------------->
// Ratechart list  ---------------------------------------------------------------->
//--------------------------------------------------------------------------------->

//v2 function
exports.listRatecharts = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(401).json({ message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const rateChartListQuery = `
        SELECT DISTINCT rccode, rcdate, rctypename, cb, time
        FROM ratemaster
        WHERE companyid = ? AND center_id = ?
      `;

      connection.query(
        rateChartListQuery,
        [dairy_id, center_id],
        (err, result) => {
          connection.release(); // Ensure connection is released
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          if (result.affectedRows === 0) {
            res
              .status(204)
              .json({ ratecharts: [], message: "Ratechart's Not Found!" });
          }

          // Send the distinct rate chart details in the response
          res
            .status(200)
            .json({ ratecharts: result, message: "Ratechart list found!" });
        }
      );
    } catch (error) {
      connection.release(); // Ensure the connection is released on error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// .............................................................................
// Finding Distinct Ratechart used by dairy ....................................
// .............................................................................

exports.findUsedRc = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // Query to get distinct ratecharttype values
      const distinctRateChartsQuery = `SELECT DISTINCT ratecharttype FROM customer WHERE orgid = ? AND centerid = ?`;

      connection.query(
        distinctRateChartsQuery,
        [dairy_id, center_id],
        (err, results) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          // Map the results to an array of ratecharttype values
          const distinctRateCharts = results.map((row) => row.ratecharttype);

          res.status(200).json({
            distinctRateCharts, // Return the array of distinct ratecharttype values
          });
        }
      );
    } catch (error) {
      connection.release();
      return res.status(400).json({ message: error.message });
    }
  });
};

// .................................................................
// Retriving perticular Ratechart to perform operations ............
// (Download , Apply , Update , Delete )............................
// .................................................................

//v2 function
exports.getSelectedRateChart = async (req, res) => {
  const { cb, rccode, rcdate, time } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const getRatechartQuery = `SELECT fat, snf, rate FROM ratemaster WHERE companyid = ? AND center_id = ? AND rccode = ? AND time = ? AND rcdate = ? AND cb = ? ORDER BY fat ASC, snf ASC`;

      connection.query(
        getRatechartQuery,
        [dairy_id, center_id, rccode, time, rcdate, cb],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          res.status(200).json({
            selectedRChart: result,
            message: result.length ? "Ratechart Found!" : "No ratechart found!",
          });
        }
      );
    } catch (error) {
      connection.release();
      return res.status(400).json({ message: error.message });
    }
  });
};

// .................................................................
// Milk Collection Ratecharts ......................................
// .................................................................

//v3
exports.rateChartMilkColl = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res
          .status(400)
          .json({ message: "Unauthorized or missing user information!" });
      }

      const findRatecharts = `
        SELECT rm.fat, rm.snf, rm.rate, rm.rctypename, rm.rcdate
        FROM ratemaster AS rm
        INNER JOIN (
          SELECT
            rctypename,
            MAX(rcdate) AS max_rcdate
          FROM
            ratemaster
          WHERE
            companyid = ?
            AND center_id = ?
            AND rctypename IN (
              SELECT DISTINCT rcName
              FROM customer
              WHERE orgid = ? AND centerid = ?
            )
          GROUP BY
            rctypename
        ) AS latest_rates ON rm.rctypename = latest_rates.rctypename
          AND rm.rcdate = latest_rates.max_rcdate
        WHERE
          rm.companyid = ? AND rm.center_id = ?
      `;

      connection.query(
        findRatecharts,
        [dairy_id, center_id, dairy_id, center_id, dairy_id, center_id],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          if (result.length === 0) {
            return res.status(404).json({
              message: "No rate chart data found for the specified criteria.",
            });
          }

          res.status(200).json({
            usedRateChart: result,
            message: "Rate chart data retrieved successfully",
          });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// .................................................................
// Retriving perfect Ratechart for milk Collection .................
// .................................................................

exports.collectionRatecharts = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Unauthorized User!" });
      }

      const findRatechart = `
      SELECT fat, snf, rate, rccode FROM ratemaster 
            WHERE orgid = ? AND center_id = ?
      `;

      connection.query(
        findRatechart,
        [dairy_id, center_id, dairy_id, center_id],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          res.status(200).json({
            usedRateChart: result,
            message: "Rate chart data retrieved successfully",
          });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// .................................................................
// Delete Selected Ratechart .......................................
// .................................................................

exports.deleteSelectedRatechart = async (req, res) => {
  const { rccode, rcdate } = req.body;

  if (!rccode || !rcdate) {
    return res
      .status(400)
      .json({ message: "Ratechart data required to delete!" });
  }

  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(400).json({ status: 400, message: "Unauthorized User!" });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const deleteQuery = `DELETE FROM ratemaster WHERE companyid = ? AND center_id = ? AND rcdate = ? AND rccode = ?`;

      connection.query(
        deleteQuery,
        [dairy_id, center_id, rcdate, rccode],
        (err, result) => {
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error" });
          }

          if (result.affectedRows === 0) {
            return res
              .status(204)
              .json({ status: 204, message: "No matching ratechart found!" });
          }

          return res
            .status(200)
            .json({ status: 200, message: "Ratechart deleted successfully!" });
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    } finally {
      if (connection) connection.release();
    }
  });
};
