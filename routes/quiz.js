const router = require("express").Router();
const connection = require("../db");

const databaseName = "QUIZ";

router.get("/", (req, res) => {
  try {
    const query = "SELECT * FROM " + databaseName;
    connection.query(query, (err, result) => {
      if (err) {
        res.status(400).send(err.message);
        return;
      }
      console.log(result);
      if (result) {
        const arrayToSend = [];
        for (let i = 0; i < result.length; i++) {
          arrayToSend.push({
            quiz_id: result[i].quiz_description,
            quiz_description: result[i].quiz_description,
            user_id: result[i].user_id,
          });
        }
        res.status(200).send(arrayToSend);
      } else {
        res.status(200).send([]);
      }
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/", (req, res) => {
  try {
    const query =
      "INSERT INTO " +
      databaseName +
      "(quiz_id ,quiz_description ,quiz_password ,user_id) VALUES(?,?,?,?)";
    if (req.body.quiz_id && req.body.quiz_description && req.body.user_id) {
      connection.query(
        query,
        [
          req.body.quiz_id,
          req.body.quiz_description,
          req.body.quiz_password,
          req.body.user_id,
        ],
        (err, result) => {
          if (err) {
            res.status(400).send(err.message);
            return;
          }
          console.log(result);
          res.status(200).send("Quiz Inserted with id " + req.body.quiz_id);
        }
      );
    } else {
      throw new Error("Incorrect data");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.patch("/:id", (req, res) => {
  try {
    const query =
      "UPDATE " +
      databaseName +
      " SET quiz_description =?,quiz_password =? ,user_id=? where quiz_id=?";
    connection.query(
      query,
      [
        req.body.quiz_description,
        req.body.quiz_password,
        req.body.user_id,
        req.params.id,
      ],
      (err, result) => {
        if (err) {
          res.status(400).send(err.message);
          return;
        }
        console.log(result);
        res.status(200).send("Quiz Updated with id " + req.params.id);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.delete("/:id", (req, res) => {
  try {
    connection.query(
      "DELETE FROM " + databaseName + " WHERE quiz_id= ?",
      [req.params.id],
      (err, result) => {
        if (err) {
          res.status(400).send(err.message);
          return;
        }
        console.log(result);
        connection.query(
          "DELETE FROM QUESTIONS WHERE quiz_id=?",
          [[req.params.id]],
          (err, result) => {
            if (err) {
              res.status(400).send(err.message);
              return;
            }
            console.log(result);
            res
              .status(200)
              .send("Quiz deleted with id " + req.params.questionId);
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

module.exports = router;
