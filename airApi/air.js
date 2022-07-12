const moment = require('moment');
const request = require('request');

var air = {};
module.exports = air;

const station_name_seq = {'동대문구':1 , '성동구':2, '종로구':3};

air.air_api = function(station_name){
    console.log(station_name);
    var url = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=idexeeezUsEPdbnJ%2BWNFg1ImgUZ21EIA%2BzhJbHrUn3NA%2FoAzR3YTaTPH2nTXKGuSA%2BxjyemKa81puLL303Yiww%3D%3D&returnType=json&numOfRows=23&pageNo=1&stationName='+encodeURI(station_name)+'&dataTerm=DAILY&ver=1.0';

    return new Promise((resolve, reject) => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED="0";
        request(url, function(error, response, body){
            if(error != null){
                reject(error);
            } else {
                if(response.statusCode == 200) {
                    resolve(JSON.parse(body))
                } else {
                    reject(response);
                }
            }
        })
    })
}

air.parse_json = function(json){
    return new Promise((resolve, reject) => {
        if(json.length === 0){
            reject();
        } else {
            var temp=[];
            for(idx in json['response']['body']['items']){
                if(json['response']['body']['items'][idx]['dataTime'].slice(0,10)==moment().format('YYYY-MM-DD')){
                    temp.push(json['response']['body']['items'][idx]);
                }
            }
            console.log(temp);
            var str = JSON.stringify(temp);
            resolve(str);
        }
    })
}

air.parse_db = function(json, station_name){
    return new Promise((resolve, reject) => {
        var templist = [];
        for(idx in json['response']['body']['items']){
            if(json['response']['body']['items'][idx]['dataTime'].slice(0,10)==moment().format('YYYY-MM-DD')){
                //console.log("aaa");
                var temp = json['response']['body']['items'][idx];
                var tempdate = json['response']['body']['items'][idx]['dataTime'].slice(11, 13);
                temp['stationName'] = station_name_seq[station_name];
                temp['stationNameAndDate'] = station_name + '_'+ moment().format('YYYYMMDD') + tempdate;
                templist.push(temp);
            }
        }
        //console.log(templist);
        resolve(templist);
    })
}