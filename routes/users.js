const router = require("express").Router();
const connection = require("../db");

const databaseName = "USERS";

// router.get("/", (req, res) => {
//     try {
//         const query = "SELECT * FROM " + databaseName;
//         connection.query(query, (err, result) => {
//             if (err) {
//                 res.status(400).send(err.message);
//                 return;
//             }
//             console.log(result);
//             if (result) {
//                 const arrayToSend = [];
//                 for (let i = 0; i < result.length; i++) {
//                     arrayToSend.push({
//                         quiz_id: result[i].quiz_description,
//                         quiz_description: result[i].quiz_description,
//                         user_id: result[i].user_id
//                     });
//                 }
//                 res.status(200).send(arrayToSend);
//             } else {
//                 res.status(200).send([]);
//             }
//         });
//     } catch (err) {
//         res.status(400).send(err.message);
//     }
// });

router.post("/", (req, res) => {
  try {
    const query =
      "INSERT INTO " +
      databaseName +
      "(user_id ,password ,type ) VALUES(?,?,?)";
    if (req.body.user_id && req.body.password && req.body.type) {
      connection.query(
        query,
        [req.body.user_id, req.body.password, req.body.type],
        (err, result) => {
          if (err) {
            res.status(400).send(err.message);
            return;
          }
          console.log(result);
          res.status(200).send("User added with id " + req.body.user_id);
        }
      );
    } else {
      throw new Error("Incorrect data");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//to update password only.
router.patch("/:id", (req, res) => {
  try {
    const query = "UPDATE " + databaseName + " SET password=? where quiz_id=?";
    connection.query(
      query,
      [req.body.password, req.params.id],
      (err, result) => {
        if (err) {
          res.status(400).send(err.message);
          return;
        }
        console.log(result);
        res.status(200).send("User Updated with id " + req.params.id);
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
      "SELECT * FROM quiz where user_id=?",
      [req.params.id],
      (err, result) => {
        if (err) {
          res.status(400).send(err.message);
          return;
        }
        for (let i = 0; i < result.length; i++) {
          const quiz_id = result[i].quiz_id;
          connection.query(
            "DELETE FROM quiz WHERE quiz_id= ?",
            [quiz_id],
            (err, result1) => {
              if (err) {
                res.status(400).send(err.message);
                return;
              }
              console.log(result1);
              connection.query(
                "DELETE FROM QUESTIONS WHERE quiz_id=?",
                [[quiz_id]],
                (err, result2) => {
                  if (err) {
                    res.status(400).send(err.message);
                    return;
                  }
                  console.log(result2);
                  connection.query(
                    "DELETE FROM " + databaseName + " WHERE user_id=?",
                    [req.params.id],
                    (err, result3) => {
                      if (err) {
                        res.status(400).send(err.message);
                        return;
                      }
                      res.status(200).send("User deleted successfully");
                    }
                  );
                }
              );
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

module.exports = router;
