
async function PopularKeyword(config, qObj, res, req) {
    var query = {};
    query.size = 0;
    var aggs = {};
    var terms = {};
    terms.field = "keyword";
    var stations = {};
    stations.terms = terms;
    aggs.stations = stations;
    query.aggs = aggs;
    return query;

}

async function InsertKeywordQuery(config, qObj, res, req){
    var searchwordarr = qObj.searchword.split(" ");
    var stringquery = '';
    for (var i = 0; i < searchwordarr.length; i++) {
        var index={};
        var indexquery = {};
        indexquery['_index'] = config.keyword_index;
        indexquery['_type'] = "_doc";
        indexquery['_id'] = `k${Math.floor(Math.random() *Math.random()*1000000000000000)}`
        console.log(indexquery['_id'],"indexquery['_id']");
        index.index = indexquery;
        var query = {};
        query.keyword = searchwordarr[i];

        stringquery += JSON.stringify(index) + "\n";
        stringquery += JSON.stringify(query) + "\n";
    }
    console.log(stringquery, "stringquery");
    return stringquery;
}

module.exports = {
    PopularKeyword,
    InsertKeywordQuery,
};