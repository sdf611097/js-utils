ct-js-utils
===
A javascript utils by CT.

# APIs

* groupByKey(listOrObj, getKeyFunc, ignoreFunctions)
* reduceByKey(listOrObj, getKeyFunc, ignoreFunctions, reduceFunc, defaultValue)
* getNewId(length, characters)
* objectMap(obj, mapFunc, ignoreFunctions)
* objectReduce(obj, reduceFunc, defaultValue, ignoreFunctions)
* countByKey(listOrObj, getKeyFunc, ignoreFunctions)
* getUniqueKeysAfterCount(listOrObj, getKeyFunc, ignoreFunctions)
* increment(value, diff)
* pickOne(value, otherwise, whiteList, blackList)

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
