const Connection = require("../common/mysql.common");

let actionFlags = {
  idStart: "1",
  timeStart: "",
  timeEnd: "",
  sortType: "id",
  sortMode: "ASC",
  search: "",
};

const Action = {
  insertData: (action, result) => {
    Connection.insertData("action", action, (data) => {
      result(data);
    });
  },

  getAll: (result) => {
    Connection.getAll("action", (data) => {
      result(data);
    });
  },
  getCountA: (result) => {
    Connection.getCountA("action", (data) => {
      result(data);
    });
  },
  getInfo: (result) => {
    Connection.getInfo("action", (data) => {
      actionFlags.timeStart = data.startTime;
      actionFlags.timeEnd = data.endTime;
      actionFlags.idStart = "1";
      result(data);
    });
  },
  getPage: (page, result) => {
    Connection.getPage("action", page, (data1) => {
      Connection.getInfo("action", (data2) => {
        result({ getInfo: data2, getPage: data1 });
      });
    });
  },
  getTimeData: (timeStart, timeEnd, result) => {
    Connection.getTimeData("action", timeStart, timeEnd, (data) => {
      actionFlags.idStart = data.id;
      result(data);
    });
  },

  getTimeInfo: (timeStart, timeEnd, result) => {
    Connection.getTimeInfo(timeStart, timeEnd, (data) => {
      actionFlags.timeStart = data.startTime;
      actionFlags.timeEnd = data.endTime;
      result(data);
    });
  },
};

module.exports = Action;
