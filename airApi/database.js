const mybatisMapper = require('mybatis-mapper');
const mysql = require('mysql');
const config = require('./config');

var _database = {};
module.exports = _database;

class Database{
    constructor(){
        this.connection = mysql.createConnection(config.db);
    }
    ready(){
        return new Promise();
    }
    query(sql, args){
        if(args){
            var _sql = sql;
            for(var i=0; i<args.length; i++){
                _sql = _sql.replace('?', '\''+args[i]+'\'');
            }
        }
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if(err)
                    return reject(err);
                resolve(rows);
            })
        })
    }
    close(){
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if(err)
                    return reject(err);
                resolve();
            })
        })
    }
}

_database.execute = function(callback){
    const database = new Database();
    return callback(database).then(
        result=> {
            database.close().then(() =>result)
        },
        err => {
            database.close().then(() => {throw err;})
        }
    )
}

_database.exportQuery = function(query_file_path, query_namespace, id, param){
    mybatisMapper.createMapper([query_file_path]);
    console.log("*");
    var format = { language:'sql', indent:' '};
    return mybatisMapper.getStatement(query_namespace, id, param, format);
}

_database.update = function(query){
    return new Promise((resolve, reject) => {
        _database.execute(
            database => database.query(query).then((rows) => {
                resolve(rows);
            }).catch(err => {
                reject(err);
            })
        ).catch(err=>{
            reject(err);
        })
    })
}

_database.fix_db_array_json = function (obj){ //model 사용하지 않고 json 형식으로 바꾸기
    if(obj.length || obj.length==0){
        var arr = [];
        obj.forEach(it => {
            arr.push(require('dataobject-parser').transpose(JSON.parse(JSON.stringify(it)))._data)
        });
        return arr;
    } else {
        return require('dataobject-parser').transpose(obj)._data;
    }
}