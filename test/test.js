/*jslint mocha:true */

'use strict';
const expect = require('chai').expect;
const util = require('../index.js');

describe('function tests', function () {
    it('randPosInt', function () {
        let undef;
        expect(util.randPosInt(null)).to.equal(-1);
        expect(util.randPosInt(undef)).to.equal(-1);
        expect(util.randPosInt(0)).to.equal(-1);

        let size = 100;

        function test(result) {
            expect(result).to.be.at.most(size - 1);
            expect(result).to.be.at.least(0);

            //is an Integer
            expect(result).to.equal(Math.floor(result));
            expect(typeof result).to.equal('number');
        }

        for (let i = 0; i < 100 * size; i++) {
            test(util.randPosInt(size));
        }
    });

    it('randIndex', function () {
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
        for (let i = 0; i < 100 * size; i++) {
            let index = util.randIndex(list);
            expect(index).to.be.at.most(size - 1);
            expect(index).to.be.at.least(0);

            //is an Integer
            expect(index).to.be.a('string');
            expect(index == Math.floor(index)).to.be.true;
        }

        //test object
        for (let i = 0; i < 100 * size; i++) {
            let result = util.randIndex(obj);
            expect(result.length).to.equal(1);
            expect(result).to.be.oneOf(Object.keys(obj));
        }

        obj.f = function () {};

        for (let i = 0; i < 100 * size; i++) {
            let result = util.randIndex(obj, false);
            expect(result.length).to.equal(1);
            expect(result).to.be.oneOf(Object.keys(obj));
        }

        for (let i = 0; i < 100 * size; i++) {
            let result = util.randIndex(obj, true);
            expect(result.length).to.equal(1);
            expect(result).to.not.equal('f');
        }
    });

    it('randPick', function () {
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
        for (let i = 0; i < 100 * size; i++) {
            let result = util.randPick(list);
            expect(result).to.be.oneOf(list);
        }

        //test object
        for (let i = 0; i < 100 * size; i++) {
            let result = util.randPick(obj);
            expect(result).to.be.oneOf(list);
        }

        obj.f = function () {};

        //test object with function element
        for (let i = 0; i < 100 * size; i++) {
            let result = util.randPick(obj, false);
            expect(result).to.be.oneOf(Object.keys(obj).map(key=> obj[key]));
        }

        //test object with function element
        for (let i = 0; i < 100 * size; i++) {
            let targets = Object.keys(obj).filter(key=> key !== 'f').map(key=> obj[key]);
            let result1 = util.randPick(obj);
            let result2 = util.randPick(obj, true);

            expect(result1).to.be.oneOf(targets);
            expect(result2).to.be.oneOf(targets);
        }
    });

    it('isOk', function () {
        let undef;
        expect(util.isOk(undef)).to.equal(false);
        expect(util.isOk(null)).to.equal(false);
        expect(util.isOk(1)).to.equal(true);
        expect(util.isOk('abc')).to.equal(true);
        expect(util.isOk(false)).to.equal(true);
    });

    it('getValue', function () {
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

    });

    it('reduceByKey', function () {
        let list = [1, 2, 3, 4, 5];
        function getKey(num) {
            return num % 2;
        }

        let result = util.reduceByKey(list, getKey, true, (a, b)=> a + b, 5);
        expect(result[0]).to.equal(5 + 2 + 4);
        expect(result[1]).to.equal(5 + 1 + 3 + 5);
    });

    it('groupByKey', function () {
        let list = [1, 2, 3, 4, 5];
        function getKey(num) {
            return num % 2;
        }

        let result = util.groupByKey(list, getKey);
        expect(result[0]).to.deep.equal([2, 4]);
        expect(result[1]).to.deep.equal([1, 3, 5]);
    });

    it('pickOne', function () {
        let undef;
        expect(util.pickOne('abc', 1)).to.equal('abc');

        //whiteList
        expect(util.pickOne(undef, 1)).to.equal(1);
        expect(util.pickOne(null, 1)).to.equal(1);
        expect(util.pickOne(null, 1, [null])).to.be.a('null');
        expect(util.pickOne(undef, 1, [undef])).to.be.a('undefined');

        //blackList
        expect(util.pickOne(2, 1)).to.equal(2);
        expect(util.pickOne(2, 1, null, [2, 4, 6])).to.equal(1);

    });

    it('getNewId', function () {
        let newId = util.getNewId(500);
        expect(newId.length).to.equal(500);
        expect(newId.search(/[^a-zA-Z0-9]/)).to.equal(-1);

        newId = util.getNewId(500, '!@#$%^&*()');
        expect(newId.length).to.equal(500);
        expect(newId.search(/[!@#$%^&]/)).to.not.equal(-1);
        expect(newId.search('!')).to.not.equal(-1);
        expect(newId.search('@')).to.not.equal(-1);
        expect(newId.search('#')).to.not.equal(-1);
        expect(newId.search('$')).to.not.equal(-1);
        expect(newId.search('%')).to.not.equal(-1);
        expect(newId.search('^')).to.not.equal(-1);
        expect(newId.search('&')).to.not.equal(-1);
        expect(newId.search('a')).to.equal(-1);
    });

    it('countByKey', function () {

        //no getKey function
        let arr = [1, 2, 3, 1, 1, '1', '1'];
        let obj = util.countByKey(arr);
        expect(obj[1]).to.equal(5);
        expect(obj[2]).to.equal(1);
        expect(obj[3]).to.equal(1);
        expect(obj[5]).to.be.an('undefined');

        function getSum(obj) {
            let sum = 0;
            for (let key in obj) {
                sum += obj[key];
            }

            return sum;
        }

        expect(getSum(obj)).to.equal(arr.length);

        function getKey(key) {
            if (key < 2) {
                return '<2';
            }else {
                return '>=2';
            }
        }

        //with getKey function
        obj = util.countByKey(arr, getKey);
        expect(obj['<2']).to.equal(5);
        expect(obj['>=2']).to.equal(2);
        expect(obj[1]).to.be.an('undefined');
        expect(getSum(obj)).to.equal(arr.length);

        //input is an object
        let input = {
            a: 1,
            b: 1,
            c: 2,
            1: 3,
            test: '1',
        };
        obj = util.countByKey(input);
        expect(obj['1']).to.equal(3);
        expect(obj['2']).to.equal(1);
        expect(obj['3']).to.equal(1);
        expect(obj.test).to.be.an('undefined');
        expect(getSum(obj)).to.equal(Object.keys(input).length);

        //ignore function
        let ignore = {
            a: 1,
            b: 1,
            c: 2,
            1: 3,
            test: function () {},
        };
        obj = util.countByKey(ignore);
        expect(obj['1']).to.equal(2);
        expect(obj['2']).to.equal(1);
        expect(obj.test).to.be.an('undefined');
        expect(getSum(obj)).to.equal(Object.keys(ignore).length - 1);
        obj = util.countByKey(ignore, x=>x, false);
        expect(getSum(obj)).to.equal(Object.keys(ignore).length);
    });

    it('getUniqueKeys', function () {
        let arr = [1, 2, 3, 1, 1, '1', '1'];
        expect(util.getUniqueKeysAfterCount(arr).length).to.equal(3);
        expect(util.getUniqueKeysAfterCount(arr).indexOf('1')).to.not.equal(-1);
        expect(util.getUniqueKeysAfterCount(arr).indexOf('2')).to.not.equal(-1);
        expect(util.getUniqueKeysAfterCount(arr).indexOf('3')).to.not.equal(-1);
    });

    it('increment', function () {
        let undef;
        expect(util.increment(undef)).to.equal(1);
        expect(util.increment(null)).to.equal(1);
        expect(util.increment(2)).to.equal(3);
        expect(util.increment(-5, -1)).to.equal(-6);
        expect(util.increment(-5, 0)).to.equal(-5);
        expect(util.increment(1, '')).to.equal('1');
    });

    it('objectMap', function () {
        let obj = {
            a: 1,
            b: 2,
            c: 3,
            test: function () {},
        };
        function map(value) {
            return value * 2;
        }

        expect(util.objectMap(obj, map)).to.deep.equal({
            a: 2, b: 4, c: 6,
        });
    });

    it('objectReduce', function () {
        let obj = {
            a: 1,
            b: 2,
            c: 3,
        };
        function reduce(prev, current) {
            return prev + current;
        }

        function reduce2(prev, current) {
            return '' + prev + current;
        }

        expect(util.objectReduce(obj, reduce, 0)).to.equal(6);
        expect(util.objectReduce(obj, reduce, '0')).to.equal('0123');
        expect(util.objectReduce(obj, reduce2)).to.equal('123');
    });
});
