
async function PopularKeyword(qObj, config) {
    console.log("Popular",qObj);
    var query = {};
    query.size = 0;
    var aggs = {};
    var terms = {};
    terms.field = "keyword";
    var stations = {};
    stations.terms = terms;
    aggs.stations = stations;
    query.aggs = aggs;
    var squery = {};
    var created = {};
    created.gte = qObj.kgte;
    created.lt = qObj.klt;
    created.format = "yyyyMMddHHmmss";
    var range = {};
    range.created = created;
    squery.range = range;
    query.query = squery;
    return query;
}
async function RealationKeyword(qObj, config) {
    var searchwordarr = qObj.searchword.split(' ');
    var should = [];
    for (var i = 0; i < searchwordarr.length; i++) {
        var multimatch = {};
        multimatch.query = searchwordarr[i];
        multimatch.fields = "keyword.search";
        multimatch.type = "phrase";
        multimatch.operator = "or";
        var mmatch = {};
        mmatch['multi_match'] = multimatch;
        should.push(mmatch);
    }
    var bool = {};
    bool.should = should;
    var must = {};
    must.bool = bool;

    var bigbool = {};
    bigbool.must = must;
    var query = {};
    query.bool = bigbool;

    var q = await PopularKeyword(qObj, config);
    q.query = query;
    return q;

}

async function InsertKeywordQuery(qObj, config) {
    var stringquery = '';
    var index = {};
    var indexquery = {};
    indexquery['_index'] = config.keyword_index[config.version];
    indexquery['_type'] = "_doc";
    indexquery['_id'] = `k${Math.floor(Math.random() * Math.random() * 1000000000000000)}`
    // console.log(indexquery['_id'],"indexquery['_id']");
    index.index = indexquery;
    var query = {};
    query.keyword = qObj.searchword;
    query.created = qObj.created;

    stringquery += JSON.stringify(index) + "\n";
    stringquery += JSON.stringify(query) + "\n";
    console.log(stringquery, "insertstringquery");
    return stringquery;
}

module.exports = {
    PopularKeyword,
    InsertKeywordQuery,
    RealationKeyword,
};