const config = require("../../config.json");
require('date-utils');
async function SearchQuery(qObj) {
    var result = await Query(qObj);
    return result;
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
        var lt = '';
        var gte = "";
        var format = "";
        var createdate = {};
        if (qObj.dateType === "season" || qObj.dateType === "ago") {
            gte = qObj.gte;
            lt = "now";
        } else if (qObj.dateType === "custom") {
            gte = qObj.gte[0];
            lt = qObj.gte[1];
            format = "yyyyMMdd";
            createdate.format = format;
        }
        
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
    SearchQuery,
    MsearchQuery,
};