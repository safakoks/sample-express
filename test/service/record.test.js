const { expect } = require("@jest/globals");

const request = require("supertest");
const server = require("../../server");
const mongoDB = require("../../db");

describe("Record Service", () => {
  test("route should be exists", (done) => {
    request(server)
      .post("/record")
      .expect("Content-Type", /json/)
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.statusCode).not.toBe(404);
        expect(res.statusCode).not.toBe(500);
        done();
      });
  });
  describe("Listing Records", () => {
    let records;
    beforeAll(async (done) => {
      const db = await mongoDB.connect();
      records = db.collection("records");
      const mockRecords = [
        {
          key: "key1",
          value: "value1",
          createdAt: new Date("2016-06-12"),
          counts: [30, 40, 50],
        },
        {
          key: "key2",
          value: "value2",
          createdAt: new Date("2016-07-8"),
          counts: [100, 200, 300],
        },
        {
          key: "key3",
          value: "value3",
          createdAt: new Date("2016-07-8"),
          counts: [500, 830, 770],
        },
        {
          key: "key4",
          value: "value4",
          createdAt: new Date("2017-08-18"),
          counts: [5, 6, 14],
        },
        {
          key: "key5",
          value: "value5",
          createdAt: new Date("2019-11-29"),
          counts: [8, 102, 90],
        },
      ];
      await records.insert(mockRecords);
      done();
    });

    test("should return all records with right schema", async (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.code).toBe(0);
          expect(res.body.msg).toBe("Success");
          expect(res.body.records).toHaveLength(5);
          expect(res.body.records[0]).toContainAllKeys([
            "key",
            "createdAt",
            "totalCount",
          ]);
          done();
        });
    });

    test("should return all records with right total of counts", async (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.code).toBe(0);
          expect(res.body.msg).toBe("Success");
          expect(res.body.records).toHaveLength(5);
          expect(
            res.body.records.map((r) => r.totalCount)
          ).toIncludeAllMembers([120, 600, 2100, 25, 200]);
          done();
        });
    });

    test("should return records which created after 2016-06-15", async (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(200)
        .send({
          startDate: "2016-06-15",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.code).toBe(0);
          expect(res.body.msg).toBe("Success");
          expect(res.body.records).toHaveLength(4);
          expect(res.body.records.map((r) => r.key)).toIncludeAllMembers([
            "key2",
            "key3",
            "key4",
            "key5",
          ]);
          done();
        });
    });

    test("should return records which created before 2017-08-04", async (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(200)
        .send({
          endDate: "2017-08-04",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.code).toBe(0);
          expect(res.body.msg).toBe("Success");
          expect(res.body.records).toHaveLength(3);
          expect(res.body.records.map((r) => r.key)).toIncludeAllMembers([
            "key1",
            "key2",
            "key3",
          ]);
          done();
        });
    });

    test("should return records which created between 2016-08-15 / 2020-08-18", async (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(200)
        .send({
          startDate: "2016-08-15",
          endDate: "2020-08-18",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.code).toBe(0);
          expect(res.body.msg).toBe("Success");
          expect(res.body.records).toHaveLength(2);
          expect(res.body.records.map((r) => r.key)).toIncludeAllMembers([
            "key4",
            "key5",
          ]);
          done();
        });
    });

    test("should return records which have min count total 1000", async (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(200)
        .send({
          minCount: 1000,
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.code).toBe(0);
          expect(res.body.msg).toBe("Success");
          expect(res.body.records).toHaveLength(1);
          expect(res.body.records.map((r) => r.key)).toIncludeAllMembers([
            "key3",
          ]);
          done();
        });
    });

    test("should return records which have max count total 600", async (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(200)
        .send({
          maxCount: 200,
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.code).toBe(0);
          expect(res.body.msg).toBe("Success");
          expect(res.body.records).toHaveLength(3);
          expect(res.body.records.map((r) => r.key)).toIncludeAllMembers([
            "key1",
            "key4",
            "key5",
          ]);
          done();
        });
    });

    test("should return records which have total count between 20 and 190", async (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(200)
        .send({
          minCount: 20,
          maxCount: 190,
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.code).toBe(0);
          expect(res.body.msg).toBe("Success");
          expect(res.body.records).toHaveLength(2);
          expect(res.body.records.map((r) => r.key)).toIncludeAllMembers([
            "key1",
            "key4",
          ]);
          done();
        });
    });

    test("should return records which have total count lower than 30 and created at between 2016-07-07/2020-04-09", async (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(200)
        .send({
          maxCount: 30,
          startDate: "2016-07-07",
          endDate: "2020-04-09",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.code).toBe(0);
          expect(res.body.msg).toBe("Success");
          expect(res.body.records).toHaveLength(1);
          expect(res.body.records.map((r) => r.key)).toIncludeAllMembers([
            "key4",
          ]);
          done();
        });
    });

    test("should return records which have total count greater than 500 and created at between 2016-06-01/2017-09-22", async (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(200)
        .send({
          minCount: 500,
          startDate: "2016-06-01",
          endDate: "2017-09-22",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.code).toBe(0);
          expect(res.body.msg).toBe("Success");
          expect(res.body.records).toHaveLength(2);
          expect(res.body.records.map((r) => r.key)).toIncludeAllMembers([
            "key2",
            "key3",
          ]);
          done();
        });
    });

    test("should return records which have total count between 199 and 3000 and created at between 2016-06-16/2019-12-30", async (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(200)
        .send({
          minCount: 199,
          maxCount: 3000,
          startDate: "2016-06-16",
          endDate: "2019-12-30",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.code).toBe(0);
          expect(res.body.msg).toBe("Success");
          expect(res.body.records).toHaveLength(3);
          expect(res.body.records.map((r) => r.key)).toIncludeAllMembers([
            "key2",
            "key3",
            "key5",
          ]);
          done();
        });
    });
  });

  describe("Error Handling", () => {
    test("Wrong StartDate Date Type", (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(400)
        .send({
          startDate: "2016-12",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.msg).toBe("Wrong date format for startDate");
          done();
        });
    });
    test("Wrong StartDate Type", (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(400)
        .send({
          startDate: "safdasdf",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.msg).toBe("Wrong date format for startDate");
          done();
        });
    });
    test("Wrong endDate Type", (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(400)
        .send({
          endDate: "safdasdf",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.msg).toBe("Wrong date format for endDate");
          done();
        });
    });

    test("startDate should not be greater than endDate", (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(400)
        .send({
          startDate: "2016-05-05",
          endDate: "2016-04-05",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.msg).toBe(
            "startDate can not be greater than endDate"
          );
          done();
        });
    });
    test("Wrong StartDate Format YYYY-DD-MM", (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(400)
        .send({
          startDate: "2016-30-12",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.msg).toBe("Wrong date format for startDate");
          done();
        });
    });
    test("Wrong endDate Format YYYY-DD-MM", (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(400)
        .send({
          endDate: "2016-30-12",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.msg).toBe("Wrong date format for endDate");
          done();
        });
    });

    test("minCount should not be greater than maxCount", (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(400)
        .send({
          minCount: 1000,
          maxCount: 500,
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.msg).toBe(
            "minCount can not be greater than maxCount"
          );
          done();
        });
    });

    test("Wrong minCount type", (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(400)
        .send({
          minCount: "asd",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.msg).toBe("Wrong type for minCount");
          done();
        });
    });
    test("Wrong maxCount type", (done) => {
      request(server)
        .post("/record")
        .expect("Content-Type", /json/)
        .expect(400)
        .send({
          maxCount: "asd",
        })
        .end((err, res) => {
          expect(err).toBeNull();
          expect(res.body.msg).toBe("Wrong type for maxCount");
          done();
        });
    });
  });
});
