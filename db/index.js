/*
MIT License

Copyright (c) 2020 Şafak Öksüzer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
*/

const log = require("../log");
const MongoClient = require("mongodb").MongoClient;

const logger = log.newLogger("mongo");
let dbClient;
let mongoConnection;

// Use connect method to connect to the server
function connect() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      global.__MONGO_URI__ || process.env.MONGO_URI,
      function (err, client) {
        if (err) {
          logger.error("Connect", err);
          reject(err);
        }
        mongoConnection = client;
        dbClient = client.db(global.__MONGO_DB_NAME__);

        logger.info("Connected successfully to server");
        resolve(dbClient);
      }
    );
  });
}

/**
 * Get list of records
 * @param Options.startDate Started from
 * @param Options.endDate End date
 * @param Options.minCount Minimum total count
 * @param Options.maxCount Maximum total count
 *
 * @returns (Promise)
 * @returns (String) key
 * @returns (Date) createdAt
 * @returns (Integer) totalCount
 */
function getRecords({ startDate, endDate, minCount, maxCount } = {}) {
  logger.info("getRecords", startDate, endDate, minCount, maxCount);

  const createdAtFilter = {};

  if (startDate || endDate) createdAtFilter.createdAt = {};
  if (startDate) createdAtFilter.createdAt.$gte = new Date(startDate);
  if (endDate) createdAtFilter.createdAt.$lte = new Date(endDate);

  const totalCountFilter = {};

  if (minCount || maxCount) totalCountFilter.totalCount = {};
  if (minCount) totalCountFilter.totalCount.$gte = Number(minCount);
  if (maxCount) totalCountFilter.totalCount.$lte = Number(maxCount);

  return dbClient
    .collection("records")
    .aggregate([
      {
        $match: { ...createdAtFilter },
      },
      {
        $project: {
          _id: 0,
          key: 1,
          createdAt: 1,
          totalCount: { $sum: "$counts" },
        },
      },
      {
        $match: {
          ...totalCountFilter,
        },
      },
    ])
    .toArray();
}

/**
 * Get Connected MongoDB Client
 */
function getClient() {
  return dbClient;
}

/**
 * Get MongoDB Connection
 */
function getConnection() {
  return mongoConnection;
}

module.exports = { connect, getRecords, getClient, getConnection };
