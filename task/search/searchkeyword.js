const query = require('./searchkeyword/query.js');
const convert = require('./searchkeyword/convert.js');
const config = require('../../config.json');
const axios = require('axios');
async function SearchKeyword(config, qObj, res, req) {
    qObj.searchword = "김선호";
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

module.exports = {
    SearchKeyword,
};