var config = require("../config.json");
const util = require("../lib/util.js");
const logger = require("../lib/log.js");
const axios = require("axios");
require('date-utils');

async function search(config, qObj, res, req) {
    qObj.class = "all";
    qObj.aOrd = "desc";
    qObj.accOrrec = "created";
    qObj.fieldname = "all";
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
           stringquery = await MsearchQuery(qObj);
           functionName = "MsearchConvert";
           url += "_msearch";
       } else {
           stringquery = await SearchQuery(qObj);
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
               eval(functionName + '(data, res,qObj)');
           }).catch(error => {
               throw new Error(error);
           });
   };
   
   function SearchConvert(data, res, qObj) {
       var result = {};
       // console.log('searchconvert', data);
       var d = [];
       var resultdata = data.hits;
       // console.log(resultdata);
       if (resultdata.total > 0) {
           for (var i = 0; i < resultdata.hits.length; i++) {
               var resdata = resultdata[i]['_source']
               d.push(resdata);
           }
   
           var category = {};
           category.total_cnt = resultdata.total;
           category.data = d;
           result[qObj.class] = category;
       }
       res.statusCode = 200;
       res.setHeader("Content-type", "application/json; charset=UTF-8");
       res.send(JSON.stringify(result));
   }
   
   function MsearchConvert(data, res, qObj) {
       console.log(data);
       var result = {};
       // result.class = "approval";
       var response = data.responses;
       var dataquery = {};
       for (var i = 0; i < response.length; i++) {
           var resdata = response[i].hits;
           // console.log(resdata,"resdata");
           var d = [];
           if (resdata.hits.length > 0) {
               for (var j = 0; j < resdata.hits.length; j++) {
                   var resd = resdata.hits[j]['_source']
                   d.push(resd);
               }
               var category = resdata.hits[0]['_source'].category;
               var total_cnt = resdata.total;
               var categorydata = {};
               categorydata.total_cnt = total_cnt;
               categorydata.data = d;
               // console.log(categorydata);
               dataquery[category] = categorydata;
   
           }
           // result.data = dataquery;
       }
       console.log(dataquery);
   
       res.statusCode = 200;
       res.setHeader("Content-type", "application/json; charset=UTF-8");
       res.send(JSON.stringify(dataquery));
   
   }
   
   async function SearchQuery(qObj) {
       var result = await Query(qObj);
       return result;
   }
   
   async function Query(qObj) {
       console.log(qObj);
       var esquery = {};
       console.log(qObj);
       if (qObj.searchwordarr.length > 0) {
           for (var i = 0; i < qObj.searchwordarr.length; i++) {
               qObj.searchword += ` ${qObj.searchwordarr[i]}`;
           }
       }
       console.log(qObj.searchword);
       var query = {};
       if (qObj.searchword !== '') {
           var smallquery = {};
           smallquery.query = qObj.searchword;
           smallquery.operator = "AND";
   
           var bool = {};
           var should = [];
           if (qObj.fieldname !== 'all') {
               var match = {};
               var smallmatch = {};
               smallmatch[`${qObj.fieldname}.search`] = smallquery;
               match.match = smallmatch;
               should.push(match);
           } else {
               for (var i = 0; i < config.default_field.length; i++) {
                   var match = {};
                   var smallmatch = {};
                   console.log(config.default_field[i]);
                   const field = config.default_field[i];
                   smallmatch[`${field}.search`] = smallquery;
                   match.match = smallmatch;
                   // console.log(match);
                   should.push(match);
                   // console.log(should);
               }
               // console.log(should);
           }
           var filter = [];
           var smallq = {};
           var categ = qObj.class;
           smallq.category = categ;
           var smallm = {};
           smallm.match = smallq;
           filter.push(smallm);
           // console.log(q.query.bool)
           const utc = UtcDate(qObj.utc);
           var lt='';
           var gte = "";
           var format = "";
           if(qObj.dateType === "season" || qObj.dateType === "ago"){
               gte = qObj.gte;
               lt = "now";
           }else if(qObj.dateType === "custom"){
               gte = qObj.gte[0];
               lt = qObj.gte[1];
               format = "yyyyMMdd";
           }
           var createdate = {};
           createdate.lt = lt;
           createdate.gte = gte;
           createdate['time_zone'] = utc;
           var range = {};
           range.created = createdate;
           var rangefilter = {};
           rangefilter.range = range;
           filter.push(rangefilter);
   
           bool.filter = filter;
           bool.should = should;
           query.bool = bool;
           esquery.query = query;
       } else {
           esquery.query = { "match_all": {} };
           if (qObj.fieldname !== '') {
               esquery["_source"] = qObj.fieldname;
           }
       }
       esquery.size = qObj.size;
       esquery.from = qObj.pagenum;
       var sortfield = {};
       sortfield.order = qObj.aOrd;
       var sort = {};
       sort[qObj.accOrrec] = sortfield;
       esquery.sort = sort;
       console.log(JSON.stringify(esquery), "esquery");
       return esquery;
   }
   
   async function MsearchQuery(qObj) {
   
       console.log("MsearchQuery로옴");
       var index = {};
       index.index = config.default_index;
       // console.log(index);
       var stringquery = '';
       var category = config.default_category;
       var q = await Query(qObj);
       // console.log(JSON.stringify(q), "q");
       // console.log(category[2], "length");
       for (var i = 0; i < category.length; i++) {
           var query = {};
   
           var smallquery = {};
           var categ = category[i];
           smallquery.category = categ;
           var smallmatch = {};
           smallmatch.match = smallquery;
           // console.log(q.query.bool)
           q.query.bool.filter[0] = smallmatch;
           query[i] = q;
   
           stringquery += JSON.stringify(index) + "\n";
           stringquery += JSON.stringify(query[i]) + "\n";
           // console.log(stringquery, 'stringquery');
       }
   
       console.log(stringquery);
       return stringquery;
   }
   
   function UtcDate(utc) {
   
       var date = '';
       if (utc >= 0) {
           var utctime = new Date((utc));
           date = utctime.toFormat('-HH:MI');
       } else {
           var utctime = new Date((utc * -1));
           date = utctime.toFormat('+HH:MI');
       }
   
       return date;
   
   }

module.exports = {
    search,
};