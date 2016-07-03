# ct-js-utils
A javascript utils by CT.

#APIs

* getNewId(length, characters)
* objectMap(obj, mapFunc, ignoreFunctions)
* objectReduce(obj, reduceFunc, defaultValue, ignoreFunctions)
* countByKey(listOrObj, getKeyFunc, ignoreFunctions)
* getUniqueKeys(listOrObj, getKeyFunc)
* increment(value, incr)
* pickOne(value, otherwise)

#getNewId(length, characters)
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

#objectMap(obj, mapFunc, ignoreFunctions)
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

#objectReduce(obj, reduceFunc, defaultValue, ignoreFunctions)
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
