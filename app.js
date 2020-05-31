const express = require("express");
const cors = require("cors");
const axios = require("axios");
const exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");

app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/text-to-speech");
});

app.get("/text-to-speech", (req, res) => {
  res.render("text-speech", { layout: "main", text: true });
});

app.get("/speech-to-text", (req, res) => {
  res.render("speech-text", { layout: "main", speech: true });
});

app.post("/", (req, res) => {
  const { text } = req.body;
  const { voice, api_key } = req.headers;

  axios({
    method: "POST",
    url: "https://api.fpt.ai/hmi/tts/v5",
    data: text,
    headers: { api_key, voice },
  })
    .then((response) => {
      res.status(response.status).send(response.data);
      //   console.log(`server ${JSON.stringify(response.data, null,4)}`);
    })
    .catch((err) => {
      console.log(err.response);
    });
});

app.post("/speech-to-text", (req, res) => {
  const { url } = req.body;
  console.log(url);

  fs.readFile(url, (err, data) => {
    if (err) throw err;
    fs.writeFile("public/output", data, "utf8", (req, res) => {
      if (err) throw err;
      console.log("Done");
    });
  });  
});
app.use((req, res, next) => {
  res.status(404).send("NOT FOUND");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (_) => {
  console.log(`API is running at http://localhost:${PORT}`);
});
