const Connection = require('../common/mysql.common');

const Sensor = {
    insertData: (sensor, result) => {
        Connection.insertData("sensor", sensor, (data) => {
            result(data);
        });
    },
    getInfo: (result) => {
        Connection.getInfo('sensor', (data) => {
            result(data);
        });
    },
    getAll: (result) => {
        Connection.getAll('sensor', (data) => {
            result(data);
        });
    },
    getPage: (page, result) => {
        Connection.getPage('sensor', page, (data1) => {
            Connection.getInfo('sensor', (data2) => {
                result({ getInfo: data2, getPage: data1 });
            })
        });
    },
    getSearch: (type, search, page, action, result) => {
        Connection.getSearch('sensor', type, search, page, action, (data1) => {
            Connection.getSearchInfo('sensor', type, search, (data2) => {
                result({ length: data2, getPage: data1 });
            });
        });
    },
    getSort: (value, type, page, result) => {
        Connection.getSort('sensor', value, type, page, (data) => {
            console.log(data);
            result(data);
        });
    },
    getTimeData: (timeStart, timeEnd, result) => {
        Connection.getTimeData('sensor', timeStart, timeEnd, (data1) => {
            Connection.getTimeInfo('sensor', timeStart, timeEnd, (data2) => {
                result({ getInfo: data2, getPage: data1 });
                console.log({ getInfo: data2, getPage: data1 });
            })
        });
    },
}
module.exports = Sensor;