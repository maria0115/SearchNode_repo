async function MsearchConvert(data, res,qObj) {
    // console.log(JSON.stringify(data),"-----------------data");
    var result = {};
    // result.class = "approval";
    var response = data.responses;
    var dataquery = {};
    var keywordIndex = 0;
    for (var i = 0; i < response.length; i++) {
        var resdata = response[i].hits;
        // console.log(resdata,"resdata");
        if(response[i].aggregations){
            keywordIndex = i;
            break;
        }
        var d = [];
        if (resdata.hits.length > 0) {
            for (var j = 0; j < resdata.hits.length; j++) {

                var resd = resdata.hits[j]['_source']
                if(resd.category=='person'){
                    var body = resd.body;
                    var rebody = body.replace(/'/gi,'"');
                    var jsonBody = JSON.parse(rebody);
                    resd.jobTitle = jsonBody.jobTitle;
                    resd.jobPosition = jsonBody.jobPosition;
                    resd.company = jsonBody.company;
                    resd.phone = jsonBody.phone;
                    resd.tel = jsonBody.tel;
                    resd.email = jsonBody.email;
                    resd.job = jsonBody.job;
                }
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
    result.data = dataquery;
    for (var i = keywordIndex; i < response.length; i++) {

    }
    result.popular = response[keywordIndex].aggregations.stations.buckets;
    result.relation = response[keywordIndex+1].aggregations.stations.buckets;
    console.log(result);
    res.statusCode = 200;
    res.setHeader("Content-type", "application/json; charset=UTF-8");
    res.send(JSON.stringify(result));

    

}

module.exports = {
    MsearchConvert,
};