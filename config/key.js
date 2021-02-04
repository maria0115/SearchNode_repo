if(process.env.NODE_ENV === 'development'){
    module.exports = require('./dev.js');
    console.log(process.env.NODE_ENV);
}else{
    console.log(process.env.NODE_ENV);
    module.exports = require('./prod.js');
}