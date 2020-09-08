const moment = require('moment');
exports = {}

exports.formatMultiValueOptions = (options) => {
    const values = options.map(option => option.value);
    if(values.includes('*')){
        values.shift()
    }
    if(values.length === 0){
        return null
    }
    return values
};

exports.checkForUndefined = (value) => value === undefined;

exports.formatFormDate = (value) => moment(value).endOf('day').format().replace('T', ' ').split('+')[0];

exports.getDateSqlStatement = (dateField, toDate, fromDate) => {
    if(toDate && fromDate){
        return ` (${dateField} BETWEEN '${fromDate}' AND '${toDate}') AND`
    } else if (fromDate) {
        return ` (${dateField} >= '${fromDate}') AND`
    } else if (toDate){
        return sqlStatement+=` (${dateField} <= '${toDate}') AND`
    }
}

module.exports = exports;