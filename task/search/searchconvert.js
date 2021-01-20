function SearchConvert(data, res, qObj) {
    var result = {};
    // console.log('searchconvert', data);
    var d = [];
    var resultdata = data.hits;
    console.log(resultdata,"searchconvert hi");
    if (resultdata.total > 0) {
        for (var i = 0; i < resultdata.hits.length; i++) {
            
            if(resultdata.hits[i]['_source'].category=='person'){
                var body = resultdata.hits[i]['_source'].body;
                var rebody = body.replace(/'/gi,'"');
                var jsonBody = JSON.parse(rebody);
                resultdata.hits[i]['_source'].jobTitle = jsonBody.jobTitle;
                resultdata.hits[i]['_source'].jobPosition = jsonBody.jobPosition;
                resultdata.hits[i]['_source'].company = jsonBody.company;
                resultdata.hits[i]['_source'].phone = jsonBody.phone;
                resultdata.hits[i]['_source'].tel = jsonBody.tel;
                resultdata.hits[i]['_source'].email = jsonBody.email;
                resultdata.hits[i]['_source'].job = jsonBody.job;
            }

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

                if(resdata.hits[j]['_source'].category=='person'){
                    var body = resdata.hits[i]['_source'].body;
                    var rebody = body.replace(/'/gi,'"');
                    var jsonBody = JSON.parse(rebody);
                    resdata.hits[j]['_source'].jobTitle = jsonBody.jobTitle;
                    resdata.hits[j]['_source'].jobPosition = jsonBody.jobPosition;
                    resdata.hits[j]['_source'].company = jsonBody.company;
                    resdata.hits[j]['_source'].phone = jsonBody.phone;
                    resdata.hits[j]['_source'].tel = jsonBody.tel;
                    resdata.hits[j]['_source'].email = jsonBody.email;
                    resdata.hits[j]['_source'].job = jsonBody.job;
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