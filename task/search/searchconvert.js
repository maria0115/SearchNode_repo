function SearchConvert(data, res, qObj) {
    var result = {};
    // console.log('searchconvert', data);
    var d = [];
    var resultdata = data.hits;
    console.log(resultdata,"searchconvert hi");
    if (resultdata.total > 0) {
        for (var i = 0; i < resultdata.hits.length; i++) {
            
            var resdata = resultdata.hits[i]['_source'];
            if(resdata.category=='person'){
                var body = resdata.body;
                var rebody = body.replace(/'/gi,'"');
                var jsonBody = JSON.parse(rebody);
                resdata.jobTitle = jsonBody.jobTitle;
                resdata.jobPosition = jsonBody.jobPosition;
                resdata.company = jsonBody.company;
                resdata.phone = jsonBody.phone;
                resdata.tel = jsonBody.tel;
                resdata.email = jsonBody.email;
                resdata.job = jsonBody.job;
            }

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
    // console.log(data);
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
    console.log(dataquery);

    res.statusCode = 200;
    res.setHeader("Content-type", "application/json; charset=UTF-8");
    res.send(JSON.stringify(dataquery));

}

module.exports = {
    SearchConvert,
    MsearchConvert,
};