const express = require("express");
const connection = require("./db");
const app = express();
const cors = require("cors");


const login = require("./routes/login");
const questions = require("./routes/questions");
const quiz = require("./routes/quiz");
const users = require("./routes/users");
const result = require("./routes/result");

app.use(express.json());

const corsOptions = {
	"Access-Control-Allow-Origin": "*",
	origin: ["https://quizzfy.vercel.app/"],
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/login", login);
app.use("/questions", questions);
app.use("/quiz", quiz);
app.use("/users", users)
app.use("/result",result);


if (!connection) 
{
	var myQuery = "";

	// Creating new department table if doesn't exist
	myQuery =
		"CREATE TABLE IF NOT EXISTS QUESTIONS(q_id INTEGER PRIMARY KEY AUTO_INCREMENT,description varchar(500),option1 varchar(200),option2 varchar(200), option3 varchar(200), option4 varchar(200), answer varchar(20), author varchar(50), quiz_id varchar(30))";
	connection.query(myQuery, function (err, result) {
		if (err) {
			console.log("Error", err);
			return;
		} else console.log("Questions table created successfully!");
	});

	myQuery = "CREATE TABLE IF NOT EXISTS QUIZ(quiz_id varchar(30) PRIMARY KEY,quiz_description varchar(300),quiz_password varchar(20),user_id varchar(50))";
	connection.query(myQuery, function (err, result) {
		if (err) {
			console.log("Error", err);
			return;
		} else console.log("Quiz table created successfully!");
	});

	// Creating new Course table if doesn't exist
	myQuery =
		"CREATE TABLE IF NOT EXISTS USERS(user_id varchar(50) PRIMARY KEY,password varchar(20),type varchar(20))";
	connection.query(myQuery, function (err, result) {
		if (err) {
			console.log("Error", err);
			return;
		} else console.log("Users table created successfully!");
	});

}

app.get("/", (req, res) => {
	res.send("ADSL");
});

app.listen(5000, () => {
	console.log("Started at port no 5000");
});


//postman...

// {
//     "s_id":"12",
//     "password":"pass",
//     "name":"ABC",
//     "course_id":"12",
//     "dept_name":"CSE",
//     "totCred":10
// }

// {
//     "course_id":"CS12",
//     "title":"ADSL",
//     "credits":10,
//     "dept_name":"CSE"
// }

// {
//     "dept_name":"CSE",
//     "budget":2022,
//     "YOE":1995
// }
