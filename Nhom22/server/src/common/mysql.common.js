const mysql = require("mysql2");
const timeFormatter = require("../utils/time.util");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "31072002",
  database: "demo",
  dateStrings: ["DATETIME"],
});

connection.connect((error) => {
  if (error) {
    console.error("Connect error:", error);
  } else {
    console.log("Connected to MySQL");
  }
});

const Connection = {
  insertData: (table, data, result) => {
    const query = "INSERT INTO " + table + " SET ?";
    connection.query(query, data, (err, res) => {
      if (err) {
        result(err);
      } else {
        result(table + " : " + res.insertId);
      }
    });
  },
  getInfo: (table, result) => {
    const query =
      "SELECT COUNT(*) AS numData, CEIL(COUNT(*)/30) AS numPage, MIN(time) AS startTime, MAX(time) AS endTime FROM " +
      table;
    connection.query(query, (err, data) => {
      if (err) {
        result(null);
      } else {
        result(data[0]);
      }
    });
  },
  getAll: (table, result) => {
    const query = "SELECT * FROM " + table;
    1;
    connection.query(query, (err, data) => {
      if (err) {
        result(null);
      } else {
        result(data);
      }
    });
  }, getCountA: (table, result) => {
    const query = `
    SELECT on_table.device_id, on_table.bat, IFNULL(off_table.tat, 0) as tat
    FROM (
        SELECT device_id, COUNT(*) as bat
        FROM action
        WHERE status = 'on'
        GROUP BY device_id
    ) on_table
    LEFT JOIN (
        SELECT device_id, COUNT(*) as tat
        FROM action
        WHERE status = 'off'
        GROUP BY device_id
    ) off_table
    ON on_table.device_id = off_table.device_id;
`;

    connection.query(query, (err, data) => {
      if (err) {
        result(err);
      } else {
        result(data);
      }
    });
  },
  getPage: (table, page, result) => {
    connection.query(
      `SELECT * FROM ${table} WHERE id >= ${(parseInt(page) - 1) * 30 + 1
      }  LIMIT 30`,
      (err, data) => {
        if (err) {
          result(null);
        } else {
          result(data);
        }
      }
    );
  },
  getSearch: (table, type, search, page, action, result) => {
    connection.query(
      `SELECT * FROM (SELECT * FROM ${table} WHERE
            ${type} LIKE ${type === "time" ? "'%" + search + "%'" : "'" + search + "'"
      }
            ORDER BY id ${action} LIMIT ${(page - 1) * 30
      },30) as subData  ORDER BY id ASC`,
      (err, data) => {
        if (err) {
          result(null);
        } else {
          result(data);
        }
      }
    );
  },
  getSearchInfo: (table, type, search, result) => {
    connection.query(
      `SELECT COUNT(*) as numData, CEIL(COUNT(*)/30) as numPage FROM ${table} WHERE ${type} LIKE ${type === "time" ? "'%" + search + "%'" : search
      }`,
      (err, data) => {
        if (err) {
          result(null);
        } else {
          result(data[0]);
        }
      }
    );
  },
  getSort: (table, value, type, page, result) => {
    connection.query(
      `SELECT * FROM ( SELECT * FROM ${table} ORDER BY ${value} ${type} LIMIT ${(page - 1) * 30
      } , 30) as subData ORDER BY ${value} ASC`,
      (err, sensor) => {
        if (err) {
          result(null);
        } else {
          result(sensor);
        }
      }
    );
  },
  getTimeData: (table, timeStart, timeEnd, result) => {
    timeStart = timeFormatter(timeStart);
    timeEnd = timeFormatter(timeEnd);
    connection.query(
      `SELECT * FROM ${table} WHERE time >= '${timeStart}' and time <= '${timeEnd}' LIMIT 30`,
      (err, data) => {
        if (err) {
          result(null);
        } else {
          result(data);
        }
      }
    );
  },
  getTimeInfo: (table, timeStart, timeEnd, result) => {
    timeStart = timeFormatter(timeStart);
    timeEnd = timeFormatter(timeEnd);
    connection.query(
      `SELECT COUNT(*) AS numData,CEIL(COUNT(*)/30) AS numPage,MIN(time) AS startTime,
        MAX(time) AS endTime FROM ${table} WHERE time >= '${timeStart}' and time <= '${timeEnd}' LIMIT 30`,
      (err, data) => {
        if (err) {
          result(null);
        } else {
          result(data[0]);
        }
      }
    );
  },
};

module.exports = Connection;
