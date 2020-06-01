const express = require("express");
const cors = require("cors");
const axios = require("axios");
const exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
const fs = require("fs");
var FormData = require("form-data");
var request = require("request");
const { Readable } = require("stream");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
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

app.post("/speech-to-text", async (req, res) => {
  const { buffer } = req.body;
  const _buffer = Buffer.from(new Uint8Array(JSON.parse(buffer)).buffer);

  console.log(typeof _buffer);

  fs.writeFile("public/output", _buffer, "utf-8", () =>
    console.log("File created!")
  );
  const data = fs.createReadStream("public/output");
  console.log(`data ${data}`);
  if (data) {
    var options = {
      method: "POST",
      url: "https://api.fpt.ai/hmi/asr/general",
      headers: {
        api_key: "D1RO9qGql9wiOObgj7r39FqKfP1RP43e",
        "Content-Type": "application/octet-stream",
      },
      body: data,
    };

    request(options, function (error, response) {
      if (error) {
        res.status(400).send(error);
        throw new error;
      }

      console.log(response.body);
      res.status(200).send(response.body);
    });
  }
});

app.use((req, res, next) => {
  res.status(404).send("NOT FOUND");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (_) => {
  console.log(`API is running at http://localhost:${PORT}`);
});
