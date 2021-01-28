async function MsearchConvert(data, res,qObj) {
    // console.log(JSON.stringify(data),"-----------------data");
    var result = {};
    // result.class = "approval";
    var response = data.responses;
    console.log(response);
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
            // console.log(resdata.hits,"----------");
            for (var j = 0; j < resdata.hits.length; j++) {
                // console.log(resd.category,"category");

                    var resd = resdata.hits[j]['_source'];
                    // console.log(resd,"resd");
                    if(resd.category=='person'){
                        var body = resd.body;
                        // console.log(body);
                        var rebody = body.replace(/'/gi,'"');
                        // console.log(rebody,"rebody");
                        var jsonBody = JSON.parse(rebody);
                        // console.log(jsonBody,"jsonBody");
                        resd.jobTitle = jsonBody.jobTitle;
                        resd.jobPosition = jsonBody.jobPosition;
                        resd.company = jsonBody.company;
                        resd.phone = jsonBody.phone;
                        resd.tel = jsonBody.tel;
                        resd.email = jsonBody.email;
                        resd.job = jsonBody.job;
                    }
                    d.push(resd);

                // console.log('for문 성공적',j);
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
    console.log(dataquery,"dataquery");
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