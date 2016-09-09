
[![Build Status](https://travis-ci.org/sdf611097/js-utils.png)](https://travis-ci.org/sdf611097/js-utils)
[![Coverage Status](https://img.shields.io/codecov/c/github/sdf611097/js-utils/master.svg)](https://codecov.io/github/sdf611097/js-utils?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/sdf611097/js-utils.svg)](https://gemnasium.com/github.com/sdf611097/js-utils)

ct-js-utils
===
A javascript utils by CT.

# APIs
* flat2DList(list, getList)
* isOk(value)
* getValue(defaultValue, arg1, ..., argN)
* groupByKey(listOrObj, getKeyFunc, ignoreFunctions)
* reduceByKey(listOrObj, getKeyFunc, ignoreFunctions, reduceFunc, defaultValue)
* getNewId(length, characters)
* objectMap(obj, mapFunc, ignoreFunctions)
* objectReduce(obj, reduceFunc, defaultValue, ignoreFunctions)
* countByKey(listOrObj, getKeyFunc, ignoreFunctions)
* getUniqueKeysAfterCount(listOrObj, getKeyFunc, ignoreFunctions)
* increment(value, diff)
* pickOne(value, otherwise, whiteList, blackList)
* randPosInt(listSize)
* randIndex(listOrObj, ignoreFunctions)
* randPick(listOrObj, ignoreFunctions)

## flat2DList(list, getList)
Convert 2D list into 1D.
```js
let list = [[1], [2, 2], [3, 3, 3]];
expect(util.flat2DList(list)).to.deep.equal([1, 2, 2, 3, 3, 3]);

let objList = [{ list: ['a'] }, { list: ['a', 'b'] }, { list: ['a', 'c', 'd'] }];
expect(util.flat2DList(objList, obj=> obj.list))
    .to.deep.equal(['a', 'a', 'b', 'a', 'c', 'd']);
```

## groupByKey(listOrObj, getKeyFunc, ignoreFunctions)
Group obj to an array base on the key(getKeyFunc(obj)).
```js
let list = [1,2,3,4,5];
function getKey(num){
    return num % 2;
}
let result = util.groupByKey(list, getKey);
expect(result[0]).to.deep.equal([2,4]);
expect(result[1]).to.deep.equal([1,3,5]);
```

## reduceByKey(listOrObj, getKeyFunc, ignoreFunctions, reduceFunc, defaultValue)
Reduce obj to an array base on the key(getKeyFunc(obj)).
```js
let list = [1,2,3,4,5];
function getKey(num){
    return num % 2;
}
let result = util.reduceByKey(list, getKey, true, (a,b)=> a+b, 5);
expect(result[0]).to.equal(5 + 2 + 4);
expect(result[1]).to.equal(5 + 1 + 3 + 5);
```

## getNewId(length, characters)
Get a string with certain length and random chose from a-z, A-Z, 0-9 in default.
```js
let newId = util.getNewId(500);
expect(newId.length).to.equal(500);
//each character in this string is a-z, A-Z, 0-9
expect(newId.search(/[^a-zA-Z0-9]/)).to.equal(-1);
//advanced usage, specified character list
newId = util.getNewId(500, '!@#$%^&*()');
expect(newId.length).to.equal(500);
expect(newId.search(/[!@#$%^&]/)).to.not.equal(-1);
```

## objectMap(obj, mapFunc, ignoreFunctions)
A map function of Object. Ignore functions in the object in default.
```js
let obj = {
    a: 1,
    b: 2,
    c: 3,
    test: function(){}
};
function map(value){
    return value * 2;
}
expect(util.objectMap(obj, map)).to.deep.equal({
    a: 2, b:4, c:6
});
```

## objectReduce(obj, reduceFunc, defaultValue, ignoreFunctions)
A reduce function of Object. Ignore functions in the object in default.
`defaultValue, ignoreFunctions` are optional.
```js
let obj = {
    a: 1,
    b: 2,
    c: 3
};
function reduce(prev, current){
    return prev + current;
}
function reduce2(prev, current){
    return '' + prev + current;
}
expect(util.objectReduce(obj, reduce, 0)).to.equal(6);
expect(util.objectReduce(obj, reduce, '0')).to.equal('0123');
expect(util.objectReduce(obj, reduce2)).to.equal('123');
```
## countByKey(listOrObj, getKeyFunc, ignoreFunctions)
Get a object which contain same value(String) after getKeyFunc.

default getKeyFunc
`getKeyFunc = function(key){ return key;};`

```js
let arr = [1,2,3,1,1];
let obj = util.countByKey(arr);
expect(obj[1]).to.equal(3);
expect(obj[2]).to.equal(1);
expect(obj[3]).to.equal(1);
expect(obj[5]).to.be.an('undefined');
//all the key is treat as string value
arr.push('1');
arr.push('1');
expect(obj[1]).to.equal(5);

function getKey(key){
    if(key < 2){
        return '<2';
    }else{
        return '>=2';
    }
}
//with getKey function, [1,2,3,1,1,'1','1']
obj = util.countByKey(arr, getKey);
expect(obj['<2']).to.equal(5);
expect(obj['>=2']).to.equal(2);

//input is an object
let input = {
    a:1,
    b:1,
    c:2,
    1:3,
    'test': '1'
};
obj = util.countByKey(input);
expect(obj['1']).to.equal(3);
expect(obj['2']).to.equal(1);
expect(obj['3']).to.equal(1);
expect(obj.test).to.be.an('undefined');
```

## getUniqueKeysAfterCount(listOrObj, getKeyFunc, ignoreFunctions)
Get an unique key array after countByKey
```js
let arr = [1,2,3,1,1,'1','1'];
console.log(util.getUniqueKeysAfterCount(arr)); //['1','2','3']
```
## increment(value, diff)
Get a result after value + diff (default 1)
```js
let undef;
expect(util.increment(undef)).to.equal(1);
expect(util.increment(null)).to.equal(1);
expect(util.increment(2)).to.equal(3);
expect(util.increment(-5, -1)).to.equal(-6);
expect(util.increment(-5, 0)).to.equal(-5);
expect(util.increment(1, '')).to.equal('1');
```
## pickOne(value, otherwise, whiteList, blackList)
Pick value or otherwise by whiteList and blackList.
whiteList can be `[0, '', null, undefiend]` (which put into if will go to else)
If `value` is in `blackList`, will return `otherwise`.
```js
let undef;
expect(util.pickOne('abc', 1)).to.equal('abc');
//whiteList
expect(util.pickOne(undef, 1)).to.equal(1);
expect(util.pickOne(null, 1)).to.equal(1);
expect(util.pickOne(null, 1, [null])).to.be.a('null');
expect(util.pickOne(undef, 1, [undef])).to.be.a('undefined');
//blackList
expect(util.pickOne(2, 1)).to.equal(2);
expect(util.pickOne(2, 1, null, [2,4,6])).to.equal(1);
```

## isOk(value)
Return false only when value is null or undefined.
```js
let undef;
expect(util.isOk(undef)).to.equal(false);
expect(util.isOk(null)).to.equal(false);
expect(util.isOk(1)).to.equal(true);
expect(util.isOk('abc')).to.equal(true);
expect(util.isOk(false)).to.equal(true);
```
## getValue(defaultValue, arg1, ..., argN)
Avoid null or undefined from 'a'-'f' test['a'].get('b')['c']['d'].func2('e')['f'].  
If it is null or undefined in the path, will get defaultValue. Simplify it to
```js
getValue(DEFAULT_V, test, 'a', prev=>prev.get('b'), 'c', 'd', prev=> prev.func2('e'), 'f')
```
If arg is function, will treat it as a getter from prev result. Otherwise, as a key to get related value from object(array).

```js
const getValue = util.getValue;
let undef;

//obj[k1][k2], obj is undefined, get default
let t0 = getValue('qq', undef, 'a');
expect(t0).to.equal('qq');

//test, test is not null and not undefined, get test itself
let test = {};
let t10 = getValue(1, test);
expect(t10).to.deep.equal({});

//test[k1][k2], test[k1] is undefined, get default
let t1 = getValue(1, test, 'a', 'b');
expect(t1).to.equal(1);

//one level retreive
//test[k1] is exist and neither undefined nor null, get test[k1]
test.a = { b: {} };
let t11 = getValue(1, test, 'a');
expect(t11).to.deep.equal(t11, { b: {} });

//2 level retreive
//test[k1][k2] is exist and neither undefined nor null, get test[k1][k2]
let t2 = getValue(1, test, 'a', 'b');
expect(t2).to.deep.equal({});

//multi level(3) retreive
//test[k1][k2][k3] is exist, get test[k1][k2][k3]
const ABC = {
    value: 5,
    get: function (arg) {
        return this.value + arg;
    },
};
test.a.b.c = ABC;
let t3 = getValue(1, test, 'a', 'b', 'c');
expect(t3.value).to.equal(5);
expect(t3).to.deep.equal(ABC);

//test[k1][k2][k3].get(100)
let t4 = getValue(1, test, 'a', 'b', 'c', function (prevResult) {
    return prevResult.get(100);
});

expect(t4).to.equal(105);

//only set default, return default
let t5 = getValue('onlyDefault');
expect(t5).to.equal('onlyDefault');

function getObj(key) {
    let obj = {};
    obj.key = key;
    obj.get = getObj;
    obj.null = null;
    return obj;
}

let testObj = getObj('begin');

//testObj.get(k1).get(k2),  test.get(k1) is null, get default
let t6 = getValue('hi', testObj, obj=> obj.null, obj=> obj.get('hi'));
expect(t6).to.equal('hi');

//testObj.get(k1).get(k2),  return test.get(k1).get(k2)
let t7 = getValue('t7', testObj, obj=> obj.get('a'), obj=> obj.get('ab'));
expect(t7).to.deep.equal(getObj('ab'));

//test[k1].get[k2]
test.k1 = getObj('hi');
let t8 = getValue('t8', test, 'k1', obj=> obj.get('t8'));
expect(t8).to.deep.equal(getObj('t8'));
```

## randPosInt(listSize)
If listSize is not > 0, return -1,
Otherwise return 0 ~ listSize -1;
```js
let undef;
expect(util.randPosInt(null)).to.equal(-1);
expect(util.randPosInt(undef)).to.equal(-1);
expect(util.randPosInt(0)).to.equal(-1);

let size = 100;
let result = util.randPosInt(size);
expect(result).to.be.at.most(size - 1);
expect(result).to.be.at.least(0);

//is an Integer
expect(result).to.equal(Math.floor(result));
expect(typeof result).to.equal('number');

```

## randIndex(listOrObj, ignoreFunctions)
return the index of list or obj, ignoreFunctions is false in default.
```js
let list = [1, 2, 3, 4, 5];
let obj = {
    a: list[0],
    b: list[1],
    c: list[2],
    d: list[3],
    e: list[4],
};

let size = list.length;

//test list
let index = util.randIndex(list);
expect(index).to.be.at.most(size - 1);
expect(index).to.be.at.least(0);

//is an Integer
expect(index).to.be.a('string');
expect(index == Math.floor(index)).to.be.true;

//test object
let result = util.randIndex(obj);
expect(result.length).to.equal(1);
expect(result).to.be.oneOf(Object.keys(obj));

obj.f = function () {};

result = util.randIndex(obj, false);
expect(result.length).to.equal(1);
expect(result).to.be.oneOf(Object.keys(obj));

result = util.randIndex(obj, true);
expect(result.length).to.equal(1);
expect(result).to.not.equal('f');
```
## randPick(listOrObj, ignoreFunctions)
return one element from list or obj, ignoreFunctions is false in default

```js
let list = [1, 2, 3, 4, 5];
let obj = {
    a: list[0],
    b: list[1],
    c: list[2],
    d: list[3],
    e: list[4],
};

let size = list.length;

//test list
let result = util.randPick(list);
expect(result).to.be.oneOf(list);

//test object
result = util.randPick(obj);
expect(result).to.be.oneOf(list);

obj.f = function () {};

//test object with function element
result = util.randPick(obj, false);
expect(result).to.be.oneOf(Object.keys(obj).map(key=> obj[key]));

let targets = Object.keys(obj).filter(key=> key !== 'f').map(key=> obj[key]);
let result1 = util.randPick(obj);
let result2 = util.randPick(obj, true);

expect(result1).to.be.oneOf(targets);
expect(result2).to.be.oneOf(targets);
```