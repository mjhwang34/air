const fs = require('fs');
const moment = require('moment');
const yargs = require('yargs');

const air = require('./air');
const dao = require('./dao');
const utils = require('./utils');

var yyyymmdd = moment();

console.log(process.argv);

yargs.version("1.1.0");
yargs.demandCommand();

yargs.command({
    command : 'save',
    describe : 'create air quality json file and save data in database',
    demandCommand : true,
    builder : {
        filepath : {
            describe : 'input file path',
            demandOption : true
        }
    }
})

utils.log("START : UPDATE AIR", yyyymmdd);

function save(station_name){
    var filedate = moment().format('YYYYMMDD');
    var fullpath = `${yargs.argv['filepath']}/${filedate}_${station_name}.json`;
    air.air_api(station_name).then(data => {
        console.log(data);
        air.parse_json(data).then(str=>{
            fs.writeFile(fullpath, str, "utf8", function(err){
                if(err==null){
                    console.log("json file updated");
                }else{
                    console.log(err);
                }
            })
        }).catch(err=> {
            console.error(err);
        })
        air.parse_db(data, station_name).then(parsed_data => {
            dao.tools.insertAirInfos(parsed_data);
        })
    }).catch(err => {
        console.error(err);
    })
}

save('동대문구')
save('성동구')
save('종로구')