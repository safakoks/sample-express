const logger = require("../log").newLogger("record");
const db = require("../db");

async function filterRecords(req, res) {
  const { startDate, endDate, minCount, maxCount } = req.body;

  const returnData = await db
    .getRecords({ startDate, endDate, minCount, maxCount })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ code: 0, msg: "Error" });
    });

  logger.info("getRecords success");
  res.status(200).send({ code: 0, msg: "Success", records: returnData });
}

module.exports.filterRecords = filterRecords;
