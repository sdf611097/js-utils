'use strict';
function getNewId(length, characters){
    var text = "";
    var possible = characters? characters : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function objectMap(obj, mapFunc, ignoreFunctions){
    if(typeof ignoreFunctions == "undefined"){
        ignoreFunctions = true;
    }
    let keys = Object.keys(obj);
    if(ignoreFunctions){
        keys = keys.filter(key=> typeof obj[key] != 'function');
    }
    let ret = {};
    keys.forEach(key=>{
        ret[key] = mapFunc(obj[key]);
    });
    return ret;
}

function objectReduce(obj, reduceFunc, defaultValue, ignoreFunctions){
    if(typeof ignoreFunctions == "undefined") {
        ignoreFunctions = true;
    }
    let keys = Object.keys(obj);
    if(ignoreFunctions) {
        keys = keys.filter(key=> typeof obj[key] != 'function');
    }
    return keys.reduce((prev, key, index)=> {
        if(index === 0 && typeof defaultValue === "undefined") {
            return obj[keys[0]];
        } else {
            return reduceFunc(prev, obj[key]);
        }
    }, defaultValue);
}

function countByKey(listOrObj, getKeyFunc, ignoreFunctions){
    let obj = {};
    if(typeof ignoreFunctions == "undefined"){
        ignoreFunctions = true;
    }
    if(typeof getKeyFunc == "undefined"){
        getKeyFunc = function(key){ return key;};
    }
    for(let i in listOrObj){
        if(ignoreFunctions && typeof listOrObj[i]=='function'){
            continue;
        }
        let key = getKeyFunc(listOrObj[i]);
        obj[key] = increment(obj[key], 1);
    }
    return obj;
}

function getUniqueKeysAfterCount(listOrObj, getKeyFunc, ignoreFunctions){
    let obj = countByKey(listOrObj, getKeyFunc, ignoreFunctions);
    return Object.keys(obj);
}

function increment(value, diff) {
    diff = pickOne(diff, 1, [0, '']);
    return value? value + diff : diff;
}

function pickOne(value, otherwise, whiteList, blackList){
    if(whiteList && whiteList.indexOf(value)!=-1){
      return value;
    }else if(blackList && blackList.indexOf(value)!=-1){
      return otherwise;
    }else{
      return value? value: otherwise;
    }
}

module.exports = {
    objectMap: objectMap,
    objectReduce: objectReduce,
    pickOne: pickOne,
    getNewId: getNewId,
    countByKey: countByKey,
    getUniqueKeysAfterCount: getUniqueKeysAfterCount,
    increment: increment
};
