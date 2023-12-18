function timeFormatter(datetime) {
    [date, time] = datetime.split(' ');
    [day, month, year] = date.split('-');
    return year + "-" + month + "-" + day + " " + time;
}

module.exports = timeFormatter;