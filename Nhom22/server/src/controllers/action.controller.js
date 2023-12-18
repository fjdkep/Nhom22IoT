const Action = require('../models/action.model');
const Connection = require('../common/mysql.common');

exports.get_info = (req, res) => {
    Action.getInfo((data) => {
        res.send(data);
    })
};

exports.get_all = (req, res) => {
    Action.getAll((data) => {
        res.send(data);
    }
    );
};
exports.get_count = (req, res) => {
    Action.getCountA((data) => {
      res.send(data);
    });
  };
  
exports.get_page = (req, res) => {
    Action.getPage(req.params.page, (data) => {
        res.send(data);
    });
}

exports.get_time_data = (req, res) => {
    Action.getTimeData(req.params.timeStart, req.params.timeEnd, (data) => {
        res.send(data);
    });
}

exports.get_time_info = (req, res) => {
    Action.getTimeInfo(req.params.timeStart, req.params.timeEnd, (data) => {
        res.send(data);
    });
}
