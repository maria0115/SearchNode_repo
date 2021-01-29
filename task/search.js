const config = require("../config.json");
const axios = require("axios");
const searchquery = require("./search/searchquery.js");
const searchconvert = require("./search/searchconvert.js");
const searchkeyword = require("./search/searchkeyword.js");

async function search(config, qObj, res, req) {

    //Test 변수
    // qObj.class = "approval";
    // qObj.aOrd = "accuracy";
    // qObj.accOrrec = "created";
    // qObj.fieldname = "all";
    // qObj.gte = "default";
    // qObj.lt = "now";
    // qObj.pagenum = 0;
    // qObj.searchword = " ";
    // qObj.searchwordarr = [];
    // qObj.size = 5;
    // qObj.utc = "-540"
    // qObj.dateType = "season";
    // qObj.created = "20210125T170331+09:00";

    // qObj = {
    //     from: 1,
    //     size: 10,
    //     fieldname: 'all',
    //     searchword: '1000만 1',
    //     searchwordarr: [ '1000만 1' ],
    //     accOrrec: 'created',
    //     aOrd: 'accuracy',
    //     class: 'all',
    //     pagenum: 0,
    //     check: false,
    //     dateType: 'all',
    //     gte: 'default',
    //     lt: '',
    //     utc: -540,
    //     created: '20210128T113111',
    //     term: 'thisWeek',
    //     cookie: 'language=en; DomAuthSessId=EB6BE3538E78A47C35ECDA4387F6723F',
    //     kgte: '20210123150000',
    //     klt: '20210128023111',
    //     sessionId: 'DomAuthSessId=EB6BE3538E78A47C35ECDA4387F6723F',
    //     readers: [
    //         "[sysadmin]"
    //     ],
    //     locale: 'ko'
    //   };
    var url = `${config.getReaders}`;

    await axios({
            method: 'get',
            url: url,
            headers: {
                "Cookie": qObj.sessionId,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response.data,"도미노!!!!!!!");
                qObj.readers = response.data;
                qObj.readers = ["[sysadmin]"];
            }).catch(error => {
                throw new Error(error);
            });

    //elasticsearch Authorization
    const id = config.elastic_id + ":" + config.elastic_pw;
    var authorization = Buffer.from(id, "utf8").toString('base64');
    var url = `${config.elastic_address[config.version]}/${config.default_index[config.nowversion]}/`;

    //msearch or search query 받기
    var stringquery = "";
    var functionName = "";

    stringquery = await searchquery.MsearchQuery(qObj);
    console.log(stringquery,"stringquery");
    console.log('MsearchConvert 여기로 들어옴');
    functionName = "MsearchConvert";
    url += "_msearch";

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
            // console.log('data시작');
            // console.log(JSON.stringify(data), "search.js hi");
            //data 구조 변환
            eval(`searchconvert.${functionName}(data,res,qObj,config)`);
        }).catch(error => {
            throw new Error(error);
        });

    searchkeyword.InsertKeyword(config, qObj, res, req);

};

module.exports = {
    search,
};