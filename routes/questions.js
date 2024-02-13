const router = require("express").Router();
const connection = require("../db");

const databaseName = "QUESTIONS";

router.get("/quizId/:id", (req, res) => {
  try {
    const query =
      "SELECT * FROM " + databaseName + " WHERE quiz_id=?";
    connection.query(query, [req.params.id], (err, result) => {
      if (err) {
        res.status(400).send(err.message);
        return;
      }
      console.log(result);
      if (result) {
        const arrayToSend = [];
        for (let i = 0; i < result.length; i++) {
          arrayToSend.push({
            q_id: result[i].q_id,
            description: result[i].description,
            option1: result[i].option1,
            option2: result[i].option2,
            option3: result[i].option3,
            option4: result[i].option4,
            answer: result[i].answer,
            author: result[i].author,
            quiz_id: result[i].quiz_id,
          });
        }
        res.status(200).send(arrayToSend);
      } else {
        res.status(200).send([]);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

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
            q_id: result[i].q_id,
            description: result[i].description,
            option1: result[i].option1,
            option2: result[i].option2,
            option3: result[i].option3,
            option4: result[i].option4,
            answer: result[i].answer,
            author: result[i].author,
            quiz_id: result[i].quiz_id,
          });
        }
        res.status(200).send(arrayToSend);
      } else {
        res.status(200).send([]);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.post("/", (req, res) => {
  try {
    console.log(req.body);
    const query =
      "INSERT INTO " +
      databaseName +
      " (description ,option1 ,option2 , option3 , option4 , answer,author,quiz_id) VALUES(?,?,?,?,?,?,?,?)";
    if (
      req.body.description &&
      req.body.option1 &&
      req.body.option2 &&
      req.body.answer &&
      req.body.quiz_id
    ) {
      connection.query(
        query,
        [
          req.body.description,
          req.body.option1,
          req.body.option2,
          req.body.option3,
          req.body.option4,
          req.body.answer,
          req.body.author,
          req.body.quiz_id,
        ],
        (err, result) => {
          if (err) {
            res.status(400).send(err.message);
            return;
          }
          console.log(result);
          res
            .status(200)
            .send("Question Inserted with id " + req.body.course_id);
        }
      );
    } else {
      throw new Error("Incorrect data");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.post("/calculateAnswer", (req, res) => {
  try {
    if (req.body) {
      const query = "SELECT * FROM QUESTIONS";
      connection.query(query, (err, result) => {
        if (err) {
          res.status(400).send(err.message);
          return;
        }
        const questions = [];
        for (let i = 0; i < result.length; i++) {
          questions.push({
            q_id: result[i].q_id,
            answer: result[i].answer,
          });
        }
        questions.sort((a, b) => a.q_id - b.q_id);
        let correctAnswers = 0;
        const receivedQuestion = req.body.question;
        receivedQuestion.forEach((que) => {
          const index = binarySearch(questions, que.q_id)
          if (index != -1) {
            if (questions[index].answer == que.answer)
              correctAnswers++;
          }
        });
        res.status(200).send({ correct: correctAnswers });
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.patch("/:id", (req, res) => {
  try {
    const query =
      "UPDATE " +
      databaseName +
      " SET description= ?, option1= ?, option2=?, option3=?, option4=?,answer=?,author=?,quiz_id=? where q_id=?";
    connection.query(
      query,
      [
        req.body.description,
        req.body.option1,
        req.body.option2,
        req.body.option3,
        req.body.option4,
        req.body.answer,
        req.body.author,
        req.body.quiz_id,
        req.params.id,
      ],
      (err, result) => {
        if (err) {
          res.status(400).send(err.message);
          return;
        }
        console.log(result);
        res.status(200).send("Question Updated with id " + req.params.id);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

router.delete("/:questionId", (req, res) => {
  try {
    connection.query(
      "DELETE FROM " + databaseName + " WHERE q_id= ?",
      [req.params.questionId],
      (err, result) => {
        if (err) {
          res.status(400).send(err.message);
          return;
        }
        console.log(result);
        res
          .status(200)
          .send("Question deleted with id " + req.params.questionId);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

function binarySearch(arr, key) {
  let low = 0,
    high = arr.length - 1;
  while (low <= high) {
    const mid = (low + high) / 2;
    if (arr[mid].q_id == key) return mid;
    else if (arr[mid].q_id > key) high = mid - 1;
    else low = mid + 1;
  }
  return -1;
}

module.exports = router;
