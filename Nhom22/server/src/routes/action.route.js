module.exports = function (router) {
    var ActionController = require('../controllers/action.controller');
    router.get('/api/action/getinfo', ActionController.get_info);
    router.get('/api/action/data', ActionController.get_all);
    router.get('/api/action/count', ActionController.get_count);
    router.get('/api/action/data/page=:page', ActionController.get_page);
    router.get('/api/action/gettime/:timeStart&:timeEnd', ActionController.get_time_data);
    router.get('/api/action/gettimeinfo/:timeStart&:timeEnd', ActionController.get_time_info);
}