'use strict';
function getNewId(length, characters){
    var text = "";
    var possible = characters? characters : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < length; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

function countByKey(listOrObj, getKeyFunc){
    let obj = {};
    if(typeof getKeyFunc == "undefined"){
        getKeyFunc = function(key){ return key;};
    }
    for(let i in listOrObj){
        let key = getKeyFunc(listOrObj[i]);
        obj[key] = obj[key]? obj[key]+1 : 1;
    }
    return obj;
}

function getUniqueKeys(listOrObj, getKeyFunc){
    let obj = countByKey(listOrObj, getKeyFunc);
    return Object.keys(obj);
}

module.exports = {
    getNewId: getNewId,
    countByKey: countByKey,
    getUniqueKeys: getUniqueKeys
}