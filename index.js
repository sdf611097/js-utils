'use strict';

function flat2DList(list, getList) {
    if (typeof getList == 'undefined') {
        getList = (obj) => obj;
    }

    let arr2D = list.map((obj, i)=> getList(obj, i));
    return arr2D.reduce((prev, current)=> prev.concat(current), []);
}

//return 0 ~ keysSize -1
//NoteForME: Using bitwise OR 0 to floor a number is faster, but 32-bit signed integers only
//http://stackoverflow.com/questions/7487977/using-bitwise-or-0-to-floor-a-number
function randPosInt(listSize) {
    return listSize > 0 ? Math.floor(Math.random() * listSize) : -1;
}

function randIndex(listOrObj, ignoreFunctions) {
    let keys = Object.keys(listOrObj);
    if (typeof ignoreFunctions === 'undefined') {
        ignoreFunctions = true;
    }

    if (ignoreFunctions) {
        keys = keys.filter(key=> typeof listOrObj[key] != 'function');
    }

    return keys[randPosInt(keys.length)];
}

function randPick(listOrObj, ignoreFunctions) {
    return listOrObj[randIndex(listOrObj, ignoreFunctions)];
}

function isOk(value) {
    return !((typeof value === 'undefined') || value === null);
}

function getValue(defaultValue) {
    let valuePath = Array.prototype.slice.call(arguments, 1);
    let ret = defaultValue;
    if (valuePath.length === 0) {
        return ret;
    }

    function getLastValue(lastValue, funcOrAttr) {
        if (typeof funcOrAttr === 'function') {
            return funcOrAttr(lastValue);
        }else {
            return lastValue[funcOrAttr];
        }
    }

    let lastValue = valuePath[0];
    if (isOk(lastValue) && valuePath.length === 1) {
        ret = lastValue;
    }

    for (let i = 1; i < valuePath.length; i++) {
        if (!isOk(lastValue) || !isOk(getLastValue(lastValue, valuePath[i]))) {
            break;
        } else if (i == valuePath.length - 1) {
            ret = getLastValue(lastValue, valuePath[i]);
        } else {
            //ok and not the last argument
            lastValue = getLastValue(lastValue, valuePath[i]);
        }
    }

    return ret;
}

function getNewId(length, characters) {
    var text = '';
    const defaultCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var possible = characters ? characters : defaultCharacters;
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

function objectMap(obj, mapFunc, ignoreFunctions) {
    if (typeof ignoreFunctions == 'undefined') {
        ignoreFunctions = true;
    }

    let keys = Object.keys(obj);
    if (ignoreFunctions) {
        keys = keys.filter(key=> typeof obj[key] != 'function');
    }

    let ret = {};
    keys.forEach(key=> {
        ret[key] = mapFunc(obj[key]);
    });
    return ret;
}

function objectReduce(obj, reduceFunc, defaultValue, ignoreFunctions) {
    if (typeof ignoreFunctions === 'undefined') {
        ignoreFunctions = true;
    }

    let keys = Object.keys(obj);
    if (ignoreFunctions) {
        keys = keys.filter(key=> typeof obj[key] !== 'function');
    }

    return keys.reduce((prev, key, index)=> {
        if (index === 0 && typeof defaultValue === 'undefined') {
            return obj[keys[0]];
        } else {
            return reduceFunc(prev, obj[key]);
        }
    }, defaultValue);
}

function reduceByKey(listOrObj, getKeyFunc, ignoreFunctions, reduceFunc, defaultValue) {
    let obj = {};
    if (typeof ignoreFunctions === 'undefined') {
        ignoreFunctions = true;
    }

    if (typeof getKeyFunc == 'undefined') {
        getKeyFunc = function (key) { return key;};
    }

    for (let i in listOrObj) {
        if (ignoreFunctions && typeof listOrObj[i] == 'function') {
            continue;
        }

        let key = getKeyFunc(listOrObj[i]);
        if (typeof defaultValue !== 'undefined' && defaultValue !== null) {
            obj[key] = pickOne(obj[key], defaultValue, [0, '']);
        }

        obj[key] = reduceFunc(obj[key], listOrObj[i]);
    }

    return obj;
}

function groupByKey(listOrObj, getKeyFunc, ignoreFunctions) {
    function reduceFunc(lastResult, oriObj) {
        lastResult = pickOne(lastResult, []);
        lastResult.push(oriObj);
        return lastResult;
    }

    return reduceByKey(listOrObj, getKeyFunc, ignoreFunctions, reduceFunc);
}

function countByKey(listOrObj, getKeyFunc, ignoreFunctions) {
    function reduceFunc(lastResult, oriObj) {
        return increment(lastResult, 1);
    }

    return reduceByKey(listOrObj, getKeyFunc, ignoreFunctions, reduceFunc);
}

function getUniqueKeys(listOrObj, getKeyFunc, ignoreFunctions) {
    let obj = countByKey(listOrObj, getKeyFunc, ignoreFunctions);
    return Object.keys(obj);
}

function increment(value, diff) {
    diff = pickOne(diff, 1, [0, '']);
    return value ? value + diff : diff;
}

function pickOne(value, otherwise, whiteList, blackList) {
    if (whiteList && whiteList.indexOf(value) != -1) {
        return value;
    }else if (blackList && blackList.indexOf(value) != -1) {
        return otherwise;
    }else {
        return value ? value : otherwise;
    }
}

module.exports = {
    randPosInt,
    randIndex,
    randPick,
    isOk,
    getValue,
    groupByKey,
    reduceByKey,
    objectMap,
    objectReduce,
    pickOne,
    getNewId,
    countByKey,
    getUniqueKeys,
    increment,
    flat2DList,
};
