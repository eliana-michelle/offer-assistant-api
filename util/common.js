const moment = require('moment');

export const formatMultiValueOptions = (options) => {
    options.map(option => option.value);
    if(options.includes('*')){
        options.shift()
    }
    if(options.length === 0){
        return null
    }
    return options
};

export const checkForUndefined = (value) => value === undefined;

export const formatFormDate = (value) => moment(value).endOf('day').format().replace('T', ' ').split('+')[0];

export const getDateSqlStatement = (dateField, toDate, fromDate) => {
    if(toDate && fromDate){
        return ` (${dateField} BETWEEN '${fromDate}' AND '${toDate}') AND`
    } else if (fromDate) {
        return ` (${dateField} >= '${fromDate}') AND`
    } else if (toDate){
        return sqlStatement+=` (${dateField} <= '${toDate}') AND`
    }
}