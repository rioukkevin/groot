var express = require("express");
var fs = require("fs");
// var https = require("https");
var bodyParser = require("body-parser");
var redirectToHTTPS = require("express-http-to-https").redirectToHTTPS;

// var options = {
//   key: fs.readFileSync("/etc/letsencrypt/live/kevin.riou.pro/privkey.pem"),
//   cert: fs.readFileSync("/etc/letsencrypt/live/kevin.riou.pro/fullchain.pem"),
// };

var app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/public");
let rootPath = {
  root: __dirname + "/public",
};

app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

app
  .use(
    bodyParser.urlencoded({
      extended: false,
    })
  )
  .get("/", function (req, res) {
    res.render("index.ejs");
  })
  .get("/talk", function (req, res) {
    res.render("letstalk.ejs");
  })
  .get("/project", function (req, res) {
    res.render("project.ejs");
  })
  .get("/skills", function (req, res) {
    res.render("skills.ejs");
  })
  .get("/who", function (req, res) {
    res.render("who.ejs");
  })
  .get("/xp", function (req, res) {
    res.render("xp.ejs");
  })
  .get("/cvb", function (req, res) {
    res.render("cvback.ejs");
  })
  .get("/cvf", function (req, res) {
    res.render("cvfront.ejs");
  })
  .get("/sw.js", function (req, res) {
    res.sendFile("sw.js", rootPath);
  })
  .get("/mirror", function (req, res) {
    res.sendFile("mir", rootPath);
  })
  .get("/project/:id", function (req, res) {
    res.statusCode = 200;
    let id = req.params.id;
    let content = JSON.parse(fs.readFileSync("./public/project.json"));
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(content[id]));
  })
  .get("/robots.txt", function (req, res) {
    res.sendFile("robots.txt", rootPath);
  })
  .get("/sitemap", function (req, res) {
    res.sendFile("sitemap.txt", rootPath);
  })
  .post("/sendmail", function (req, res) {
    console.log(req.body);
    var send = require("gmail-send")({
      user: "riou.kkevin@gmail.com",
      pass: "rcockhrqspsooslu",
      to: "riou.kkevin@gmail.com",
      replyTo: req.body.mail,
      subject: req.body.subject,
      text: "name: " + req.body.name + " \n\n" + req.body.data,
    });
    send();
    res.send("y");
  })
  .use("/css", express.static("public/css"))
  .use("/js", express.static("public/js"))
  .use("/font", express.static("public/font"))
  .use("/images", express.static("public/images"))
  .use("/favicon", express.static("public/favicon"))
  .use(function (req, res, next) {
    res.render("error404.ejs");
  });

// app.listen(80);
app.listen(7999);

// https.createServer(options, app).listen(443);
