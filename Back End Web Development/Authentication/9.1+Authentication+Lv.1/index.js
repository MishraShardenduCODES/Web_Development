import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const db = new pg.Client({
  user : "postgres",
  host : "localhost",
  database : "secrets",
  password : "Iamshardendumishra@2244",
  port : 5432,
});
db.connect();

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  // console.log(email);
  const pass = req.body.password;
  // console.log(pass);
  const exist = await db.query(
    "SELECT * FROM users WHERE email = $1",[email]
  );
  try{
    if(exist.rows.length > 0){
      res.send("Email already exists. Try logging in.");
    }else{
      const result = await db.query(
        "INSERT INTO users(email,password) VALUES ($1,$2);",
        [email,pass]
      );
    }
    res.render("login.ejs");
    console.log(result);
  }catch(err){
    console.log(err);
  }

});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  // console.log(email);
  const pass = req.body.password;
  // console.log(pass);

  try{
    const result = await db.query("SELECT * FROM users WHERE email = $1", 
      [email]
    );

    if(result.rows.length > 0){
      const user = result.rows[0];
      const pwd = user.password;
      if(pwd === pass){
        res.render("secrets.ejs");
      }else{
        res.send("Incorrect Password");
      }
    }else{
      res.send("User not found");
    }
  }catch(err){
    console.log(err);
  }
});