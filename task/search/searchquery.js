const config = require("../../config.json");
// use new Date
require('date-utils');

// _search
async function SearchQuery(qObj) {
    console.log('왜여기로오지');
    var result = await Query(qObj);
    return result;
}
// _msearch
async function MsearchQuery(qObj) {
    console.log("MsearchQuery 여기로 왔다")
    var index = {};
    // ex){"index":"search"}
    index.index = config.default_index;

    // ex) {"query":{"bool":{"filter":[{"match":{"category":"dept"}},{"range":{"created":
    // {"gte":"now-7d/d","lt":"now","time_zone":"+09:00"}}}],"must":[{"match":{"subject.search":
    // {"query":"김선호","operator":"AND"}}},{"match":{"body.search":{"query":"김선호",
    // "operator":"AND"}}},{"match":{"author.search":{"query":"김선호","operator":"AND"}}}]}},
    // "size":5,"from":0,"sort":{"created":{"order":"desc"}}}
    var q = await Query(qObj);
    var stringquery = '';
    var category = config.default_category;
    for (var i = 0; i < category.length; i++) {
        var query = {};
        var smallquery = {};
        var categ = category[i];
        smallquery.category = categ;
        var smallmatch = {};
        smallmatch.match = smallquery;
        q.query.bool.filter[0] = smallmatch;
        query[i] = q;

        stringquery += JSON.stringify(index) + "\n";
        stringquery += JSON.stringify(query[i]) + "\n";
    }
    console.log(stringquery, "stringquery");
    return stringquery;
}
async function Query(qObj) {
    console.log(qObj);
    var esquery = {};
    console.log(qObj.searchwordarr);
    console.log(qObj.searchword);
    var query = {};
    if (qObj.searchword !== '') {
        var bool = {};
        var filter = [];
        var smallq = {};
        var categ = qObj.class;
        smallq.category = categ;
        var smallm = {};
        smallm.match = smallq;
        filter.push(smallm);
        // console.log(q.query.bool)
        if (qObj.gte !== "default") {
            const utc = UtcDate(qObj.utc);
            var createdate = {};
            createdate.format = "yyyyMMddHHmmss";
            createdate.lt = qObj.lt;
            createdate.gte = qObj.gte;
            createdate['time_zone'] = utc;
            var range = {};
            range.created = createdate;
            var rangefilter = {};
            rangefilter.range = range;
            filter.push(rangefilter);
        }
        bool.filter = filter;
        var must = [];
        var fields = [];
        if (qObj.fieldname !== 'all') {
            fields.push(`${qObj.fieldname}.search`);
        } else {
            for (var i = 0; i < config.default_field.length; i++) {
                const field = config.default_field[i];
                fields.push(`${field}.search`);
            }
        }
        for (var i = 0; i < qObj.searchwordarr.length; i++) {
            if (qObj.searchwordarr[i].indexOf(" ") !== -1) {
                var searcharr = qObj.searchwordarr[i].split(" ");
                var should = [];
                for (var j = 0; j < searcharr.length; j++) {
                    var mustquery = {};
            mustquery.operator = "AND";
            mustquery.fields = fields;
            mustquery.type = "best_fields";
                    mustquery.query = searcharr[j];
                    var mustmultimatch = {};
                    mustmultimatch['multi_match'] = mustquery;
                    console.log(mustmultimatch,"mustmultimatch");
                    should.push(mustmultimatch);
                    console.log(should,"should");
                    var shouldinmust = {};
                    shouldinmust.should = should;
                    var mustbool = {};
                    mustbool.bool = shouldinmust;
                }
                must.push(mustbool);
            } else {
                var mustquery = {};
            mustquery.operator = "AND";
            mustquery.fields = fields;
            mustquery.type = "best_fields";
                mustquery.query = qObj.searchwordarr[i];
                var mustmultimatch = {};
                mustmultimatch['multi_match'] = mustquery;
                must.push(mustmultimatch);
            }
        }
        bool.must = must;
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
    if (qObj.aOrd === "desc") {
        var sortfield = {};
        sortfield.order = qObj.aOrd;
        var sort = {};
        sort[qObj.accOrrec] = sortfield;
        esquery.sort = sort;
    }
    // console.log(JSON.stringify(esquery), "esquery");
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