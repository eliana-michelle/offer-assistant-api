const { AZURE_POOL } = require('../util/poolConfig');

const { headers }  = require('../util/headers');
const { formatMultiValueOptions, checkForUndefined, formatFormDate, getDateSqlStatement } = require('../util/common');


module.exports = async function (context, req) {
    const values = req.body.values;
    const offices = values.office ? formatMultiValueOptions(values.office): null;
    const offerCodes = values.offerCode ? formatMultiValueOptions(values.offerCodes) : null;
    const cancelStatus = values.cancelStatus ? formatMultiValueOptions(values.cancelStatus) : null;
    const letterSentFrom = checkForUndefined(values.letterSentFrom) ? null : formatFormDate(values.letterSentFrom);
    const letterSentTo = checkForUndefined(values.letterSentTo) ? null : formatFormDate(values.letterSentTo);
    const expirationFrom = checkForUndefined(values.expirationFrom) ? null : formatFormDate(values.expirationFrom);
    const expirationTo = checkForUndefined(values.expirationTo) ? null : formatFormDate(values.expirationTo);
    const updatedFrom = checkForUndefined(values.updatedFrom) ? null : formatFormDate(values.updatedFrom);
    const updatedTo = checkForUndefined(values.updatedTo) ? null : formatFormDate(values.updatedTo);

    try {
        let azurePool = await AZURE_POOL;

        sqlStatement=``
        if(Object.keys(values).length === 0){
            sqlStatement+='SELECT * FROM sessions'
        } else {
            sqlStatement+='SELECT * FROM sessions WHERE '

            if(offices){
                if(offices.length === 1){
                    sqlStatement+=`office = '${offices}'`
                } else {
                    sqlStatement+=`office IN (SELECT value FROM string_split('${offices}', ','))` 
                }
                sqlStatement+=' AND'
            }
            if(offerCodes){
                if(offerCodes.length === 1){
                    sqlStatement+=` offer_code = '${offerCodes}'`
                } else {
                    sqlStatement+=` offer_code IN(SELECT value FROM string_split('${offerCodes}', ','))`
                }
                sqlStatement+=' AND'
            }
            if(cancelStatus){
                if(cancelStatus.length === 1) {
                    sqlStatement+=` cancel_status = '${cancelStatus}'`
                } else {
                    sqlStatement+=` cancel_status IN(SELECT value FROM string_split('${cancelStatus}', ','))`
                }
                sqlStatement+=' AND'
            }
            if(letterSentFrom || letterSentTo) {
                sqlStatement+= getDateSqlStatement('letter_sent', letterSentTo, letterSentFrom)
            }
            if(expirationFrom || expirationTo){
                sqlStatement+= getDateSqlStatement('expiration_date', expirationTo, expirationFrom)
            }
            if(updatedFrom || updatedTo){
                sqlStatement+= getDateSqlStatement('updated_at', updatedTo, updatedFrom)
            }

            const checkForDanglingAnd = sqlStatement.substr(sqlStatement.length - 3);
            
            if(checkForDanglingAnd === 'AND'){
                sqlStatement = sqlStatement.substr(0, sqlStatement.length - 3)
            };
        }
        
        const sessionsRaw =  await azurePool.request().query(sqlStatement);
        const sessions = sessionsRaw.recordset;

       
        context.res = {
            status: 200, 
            headers: headers, 
            body: {
                status: true, 
                sessions: sessions
            }
        }
    } catch (error){
        context.log(error)
        context.res = {
            status: 500, 
            headers: headers
        }
    }  
}