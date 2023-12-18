module.exports = function (router) {
    var SensorController = require('../controllers/sensor.controller');
    router.get('/api/sensor/getinfo', SensorController.get_info);
    router.get('/api/sensor/data', SensorController.get_all);
    router.get('/api/sensor/data/page=:page', SensorController.get_page);
    router.get('/api/sensor/search/type=:type&search=:search&page=:page&sort=:sort', SensorController.get_search);
    router.get('/api/sensor/sort/value=:value&type=:type&page=:page', SensorController.get_sort);
    router.get('/api/sensor/gettime/:timeStart&:timeEnd', SensorController.get_time_data);
};