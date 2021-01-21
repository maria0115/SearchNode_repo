async function PopularKeywordConvert(data, res, qObj) {
     var result = data.aggregations.stations.buckets;
    res.statusCode = 200;
    res.setHeader("Content-type", "application/json; charset=UTF-8");
    res.send(JSON.stringify(result));

}

module.exports = {
    PopularKeywordConvert,
};