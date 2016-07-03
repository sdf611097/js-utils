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

function getUniqueKeys(listOrObj, getKeyFunc){
    let obj = countByKey(listOrObj, getKeyFunc);
    return Object.keys(obj);
}

function increment(value, incr) {
    incr = incr? incr: 1;
    return value? value + incr : incr;
}

function pickOne(value, otherwise){
    return value? value: otherwise;
}

module.exports = {
    objectMap: objectMap,
    objectReduce: objectReduce,
    pickOne: pickOne,
    getNewId: getNewId,
    countByKey: countByKey,
    getUniqueKeys: getUniqueKeys,
    increment: increment
};
