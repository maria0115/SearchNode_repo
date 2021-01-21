const config = require("../config.json");
const axios = require("axios");
const searchquery = require("./search/searchquery.js");
const searchconvert = require("./search/searchconvert.js");
async function search(config, qObj, res, req) {

    //Test 변수
    // qObj.class = "all";
    // qObj.aOrd = "accuracy";
    // qObj.accOrrec = "created";
    // qObj.fieldname = "all";
    // qObj.gte = "now-7M/d";
    // qObj.pagenum = 0;
    // qObj.searchword = "1박 강예은";
    // qObj.searchwordarr = ["호랑이 김선호", "1박","특별"];
    // qObj.size = 5;
    // qObj.utc = "-540"
    // qObj.dateType = "season";

    //elasticsearch Authorization
    const id = config.elastic_id + ":" + config.elastic_pw;
    var authorization = Buffer.from(id, "utf8").toString('base64');
    var url = `${config.elastic_address}/${config.default_index}/`;

    //msearch or search query 받기
    var stringquery = "";
    var functionName = "";
    if (qObj.class === "all") {
        stringquery = await searchquery.MsearchQuery(qObj);
        console.log('MsearchConvert 여기로 들어옴');
        functionName = "MsearchConvert";
        url += "_msearch";
    } else {
        stringquery = await searchquery.SearchQuery(qObj);
        console.log(JSON.stringify(stringquery));
        functionName = "SearchConvert";
        url += "_search";
    }

    //elasticsearch 검색
    await axios({
        method: 'post',
        url: url,
        data: stringquery,
        headers: {
            Authorization: 'Basic ' + authorization,
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            var data = response.data;
            console.log(data,"search.js hi");
            //data 구조 변환
            eval(`searchconvert.${functionName}(data, res,qObj)`);
        }).catch(error => {
            throw new Error(error);
        });
};

module.exports = {
    search,
};