const { AZURE_POOL } = require('../util/poolConfig')

const { headers }  = require('../util/headers')


module.exports = async function (context, req) {

    try {
        let azurePool = await AZURE_POOL
        let offerCodes = await azurePool.request().query(`SELECT DISTINCT offer_code FROM sessions`)
        offerCodes = offerCodes.recordset
  
        context.res = {
            status: 200, 
            headers: headers, 
            body: {
                status: true, 
                offerCodes: offerCodes
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