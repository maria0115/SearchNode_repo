const query = require('./searchkeyword/query.js');
const convert = require('./searchkeyword/convert.js');
// const configjson = require('../../config.json');
const axios = require('axios');
async function SearchKeyword(config, qObj, res, req) {
    
    const keywordquery = await query.PopularKeyword(config, qObj, res, req);

    const id = config.elastic_id + ":" + config.elastic_pw;
    var authorization = Buffer.from(id, "utf8").toString('base64');
    var url = `${config.elastic_address}/${config.keyword_index}/_search`;
    console.log(JSON.stringify(keywordquery) ,"keywordquery");

     //elasticsearch 검색
     await axios({
        method: 'post',
        url: url,
        data: keywordquery,
        headers: {
            Authorization: 'Basic ' + authorization,
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            var data = response.data;
            console.log(data,"searchkeyword.js hi");
            convert.PopularKeywordConvert(data, res, qObj)
        }).catch(error => {
            throw new Error(error);
        });


}

async function InsertKeyword(config, qObj, res, req) {
    // qObj.searchword = "1박 김선호";

    const id = config.elastic_id + ":" + config.elastic_pw;
    var authorization = Buffer.from(id, "utf8").toString('base64');
    var url = `${config.elastic_address}/_bulk`;

    var insertquery = await query.InsertKeywordQuery(config, qObj, res, req);
    // console.log(insertquery,"insertquery");
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

module.exports = {
    SearchKeyword,
    InsertKeyword,
};