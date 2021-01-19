const config = require("../config.json");
const axios = require("axios");
const searchquery = require("./search/searchquery.js");
const searchconvert = require("./search/searchconvert.js");
async function search(config, qObj, res, req) {

    qObj.class = "approval";
    qObj.aOrd = "desc";
    qObj.accOrrec = "created";
    qObj.fieldname = "subject";
    qObj.gte = "now-7d/d";
    qObj.pagenum = 0;
    qObj.searchword = "김선호";
    qObj.searchwordarr = [];
    qObj.size = 5;
    qObj.utc = "-540"
    qObj.dateType = "season";

    //elasticsearch
    const id = config.elastic_id + ":" + config.elastic_pw;
    var authorization = Buffer.from(id, "utf8").toString('base64');
    var url = `${config.elastic_address}/${config.default_index}/`;
    //msearch
    var stringquery = "";
    var functionName = "";
    if (qObj.class === "all") {
        stringquery = await searchquery.MsearchQuery(qObj);
        functionName = "MsearchConvert";
        url += "_msearch";
    } else {
        stringquery = await searchquery.SearchQuery(qObj);
        console.log(JSON.stringify(stringquery));
        functionName = "SearchConvert";
        url += "_search";
    }
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
            eval(`searchconvert.${functionName}(data, res,qObj)`);
        }).catch(error => {
            throw new Error(error);
        });
};

module.exports = {
    search,
};