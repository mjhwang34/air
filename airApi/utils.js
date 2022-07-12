const moment = require('moment');

var utils = {};
module.exports = utils;

utils.log = function(...args){
    args.splice(0,0,moment().format('YYYY-MM-DD HH:mm ::'));
    console.log(args.join(' '));
}