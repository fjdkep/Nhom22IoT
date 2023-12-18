const Sensor = require('../models/sensor.model');
exports.get_info = (req, res) => {
    Sensor.getInfo((data) => {
        res.send(data);
    });
}

exports.get_all = (req, res) => {
    Sensor.getAll((data) => {
        res.send(data);
    });
}

exports.get_page = (req, res) => {
    Sensor.getPage(req.params.page, (data) => {
        res.send(data);
    });
}

exports.get_search = (req, res) => {
    Sensor.getSearch(req.params.type, req.params.search, req.params.page, req.params.sort, (data) => {
        res.send(data);
    });
}

exports.get_sort = (req, res) => {
    Sensor.getSort(req.params.value, req.params.type, req.params.page, (data) => {
        res.send(data);
    });
}

exports.get_time_data = (req, res) => {
    Sensor.getTimeData(req.params.timeStart, req.params.timeEnd, (data) => {
        res.send(data);
    });
}