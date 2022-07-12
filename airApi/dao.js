const db = require('./database');

var dao = {};
module.exports = dao;

const query_file_path = './mapper.xml';
const query_namespace = 'mapper';

function exportQuery(id, param){
    return db.exportQuery(query_file_path, query_namespace, id, param);
}

function update(id, data){
    console.log('here');
    var query = exportQuery(id, data);
    console.log(query);
    return db.update(query);
}

dao.tools = {};
dao.tools.insertAirInfos = function(data){
    return update('insertAirInfos', {list:data});
}