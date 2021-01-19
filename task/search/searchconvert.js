function SearchConvert(data, res, qObj) {
    var result = {};
    // console.log('searchconvert', data);
    var d = [];
    var resultdata = data.hits;
    console.log(resultdata,"searchconvert hi");
    if (resultdata.total > 0) {
        for (var i = 0; i < resultdata.hits.length; i++) {
            var resdata = resultdata.hits[i]['_source']
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

module.exports = {
    SearchConvert,
    MsearchConvert,
};