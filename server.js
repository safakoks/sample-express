const config = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const logger = require("./log").newLogger("server");
const db = require("./db");

// Services
const record_sr = require("./service/record_service");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.route("/ping").get((req, res) => {
  res.status(200).json({
    msg: "pong",
  });
});

app.route("/record").post(record_sr.filterRecords);

app.use((req, res) => {
  res.status(404).json({
    msg: "URL not found",
  });
});

db.connect()
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      const port = process.env.PORT || config.PORT;
      app.listen(port, () => {
        logger.info("Server is listening on ", port);
      });
    }
  })
  .catch(logger.error);

module.exports = app;
