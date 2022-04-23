const express = require("express");
const connectDB = require("./config/db");
const path = require("path")
const cors = require('cors');
const app = express();


connectDB();
app.options('*', cors());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));


const users = require("./routes/user");
const auth = require("./routes/auth");
const jobs = require("./routes/job")
// app.use(express.json());
app.use(express.json({
  extended: false
}));
app.use(express.urlencoded({
  urlencoded: true
}))
const PORT = process.env.PORT || 5000;

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/job", jobs);


app.listen(PORT, () => {
  console.log("server running");
});