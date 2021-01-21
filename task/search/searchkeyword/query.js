
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

module.exports = {
    PopularKeyword,
};