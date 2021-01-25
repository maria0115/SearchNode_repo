const query = require('./searchkeyword/query.js');
// const configjson = require('../../config.json');
const axios = require('axios');

async function InsertKeyword(config, qObj, res, req) {
    // qObj.searchword = "1박 김선호";

    const id = config.elastic_id + ":" + config.elastic_pw;
    var authorization = Buffer.from(id, "utf8").toString('base64');
    var url = `${config.elastic_address}/_bulk`;

    if(qObj.searchword!==" "){
        var insertquery = await query.InsertKeywordQuery(qObj,config);
        console.log(insertquery,"insertquery");
        //elasticsearch 검색
        await axios({
            method: 'put',
            url: url,
            data: insertquery,
            headers: {
                Authorization: 'Basic ' + authorization,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response.status);
            }).catch(error => {
                throw new Error(error);
            });
    }


}

module.exports = {
    InsertKeyword,
};