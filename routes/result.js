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


module.exports = router;
