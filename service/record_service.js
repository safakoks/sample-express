const logger = require("../log").newLogger("record");
const db = require("../db");
const moment = require("moment");

function validateFilterRecords(req, res, next) {
  const { startDate, endDate, minCount, maxCount } = req.body;

  if (startDate && !moment(startDate, "YYYY-MM-DD", true).isValid()) {
    res.status(400).send({
      code: 1,
      msg: "Wrong date format for startDate",
    });
    return;
  }

  if (endDate && !moment(endDate, "YYYY-MM-DD", true).isValid()) {
    res.status(400).send({
      code: 1,
      msg: "Wrong date format for endDate",
    });
    return;
  }

  if (endDate && startDate && new Date(startDate) > new Date(endDate)) {
    res.status(400).send({
      code: 1,
      msg: "startDate can not be greater than endDate",
    });
    return;
  }

  if (minCount && !Number.isInteger(minCount)) {
    res.status(400).send({
      code: 1,
      msg: "Wrong type for minCount",
    });
    return;
  }

  if (maxCount && !Number.isInteger(maxCount)) {
    res.status(400).send({
      code: 1,
      msg: "Wrong type for maxCount",
    });
    return;
  }

  if (minCount && maxCount && Number(minCount) > Number(maxCount)) {
    res.status(400).send({
      code: 1,
      msg: "minCount can not be greater than maxCount",
    });
    return;
  }

  next();
}

/**
 * Endpoint Method to filter records by using body parameters (startDate, endDate, minCount, maxCount)
 * All parameters are optional
 */
async function filterRecords(req, res) {
  const { startDate, endDate, minCount, maxCount } = req.body;

  const returnData = await db
    .getRecords({ startDate, endDate, minCount, maxCount })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ code: 2, msg: "Error" });
    });

  logger.info("getRecords success");
  res.status(200).send({ code: 0, msg: "Success", records: returnData });
}

module.exports.filterRecords = [validateFilterRecords, filterRecords];
