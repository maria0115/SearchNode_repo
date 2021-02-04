const config = require('./config.json');

var prodconfig = config;

prodconfig.getReaders = "http://mail.saerom.co.kr/portal.nsf/getUserNameList?openpage";

module.exports = prodconfig;