const router = require("express").Router();
const connection = require("../db");

// Assuming you have Sequelize set up and your Result model defined

router.post("/", async (req, res) => {
  const { user_id, score, quiz_id } = req.body;
  console.log(req.body);
  try {
    // Execute SQL query to insert data into the result table
    const result = await connection.query(
      "INSERT INTO result (user_id, score, quiz_id) VALUES (?, ?, ?)",
      [user_id, score, quiz_id]
    );

    // Check if the query executed successfully
    if (result) {
      // Return a success response
      res.status(201).json({ success: true });
    } else {
      // Handle the case where the query did not execute successfully
      console.error("Error creating result: Query execution failed");
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    // Handle errors
    console.error("Error creating result:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:quiz_id", async (req, res) => {
  const { quiz_id } = req.params;
  console.log("quiz_id : ", quiz_id);
  try {
    // Execute SQL query to retrieve results based on quiz_id
    const query = `SELECT * FROM result WHERE quiz_id = "${quiz_id}"`;
    console.log(query);
    connection.query(query, (err, result) => {
      if (err) {
        console.error("Error retrieving results:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      console.log("result : ",result);
      // Check if any results were found
      if (result.length > 0) {
        // Return the results
        res.status(200).json(result);
      } else {
        // Return a message indicating no results found
        res
          .status(404)
          .json({ message: "No results found for the provided quiz_id" });
      }
    });
  } catch (error) {
    // Handle errors
    console.error("Error retrieving results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;




