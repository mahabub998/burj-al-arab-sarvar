const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-swu9d.mongodb.net/burjAlArab?retryWrites=true&w=majority`;

var admin = require("firebase-admin");

var serviceAccount = require("./burj-al-arab-b935c-firebase-adminsdk-zu20n-b2a46eab00.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// const admin = require("firebase-admin");
const port = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const bookings = client.db("burjAlArab").collection("bookings");
  // clint site theke  data servare data read jonno post use korte hoy

  app.post("/addBooking", (req, res) => {
    const newBooking = req.body;
    bookings.insertOne(newBooking).then((result) => {
      res.send(result.insertedCount > 0);
    });
    console.log(newBooking);
  });

  //get ar maddome data show     kore .    ai ta show koranor joono clint site  bookings component a  kaj kora hoye ce

  app.get("/booking", (req, res) => {
    //   console.log(req.query.email)
    const bearer = req.headers.authorization;
    if (bearer && bearer.startsWith("bearer")) {
      const idToken = bearer.split(" ")[1];
      console.log({ idToken });
      admin
        .auth()
        .verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          console.log(tokenEmail,queryEmail);
          if(tokenEmail == req.query.email){
            bookings.find({email: queryEmail})
    .toArray((err,documents)=>{
        res.status(200).send(documents)
    })
          }
          else{
            res.status(401).send('un authorized access')
          }
        })
        .catch((error) => {
          res.status(401).send('un authorized access')
        });
    }
    else{
      res.status(401).send('un authorized access')
    }

    // find modde qurey use kora hoyce je user logg in korbe tar jonno..ar clint site api modde email diy kaj kora hoyece
    
  });
});

// server re dekhanor  jonno ai get use korte hoy

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);



