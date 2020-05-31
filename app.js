const express = require("express");
const cors = require("cors");
const axios = require("axios");
const exphbs = require("express-handlebars");
var bodyParser = require('body-parser')

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("app", { layout: false });
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

app.use((req, res, next) => {
  res.status(404).send("NOT FOUND");
});

const PORT = 3000;
app.listen(PORT, (_) => {
  console.log(`API is running at http://localhost:${PORT}`);
});
