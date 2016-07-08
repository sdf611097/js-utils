/*jslint mocha:true */

'use strict';
const expect = require('chai').expect;
const util = require('../index.js');

describe('function tests',function(){
    it('reduceByKey', function(){
        let list = [1,2,3,4,5];
        function getKey(num){
            return num % 2;
        }
        let result = util.reduceByKey(list, getKey, true, (a,b)=> a+b, 5);
        expect(result[0]).to.equal(5 + 2 + 4);
        expect(result[1]).to.equal(5 + 1 + 3 + 5);
    });
    it('groupByKey', function(){
        let list = [1,2,3,4,5];
        function getKey(num){
            return num % 2;
        }
        let result = util.groupByKey(list, getKey);
        expect(result[0]).to.deep.equal([2,4]);
        expect(result[1]).to.deep.equal([1,3,5]);
    });

    it('pickOne', function(){
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

    });
    it('getNewId', function(){
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

    it('countByKey', function(){
        //no getKey function
        let arr = [1,2,3,1,1,'1','1'];
        let obj = util.countByKey(arr);
        expect(obj[1]).to.equal(5);
        expect(obj[2]).to.equal(1);
        expect(obj[3]).to.equal(1);
        expect(obj[5]).to.be.an('undefined');

        function getSum(obj){
            let sum = 0;
            for(let key in obj){
                sum += obj[key];
            }
            return sum;
        }

        expect(getSum(obj)).to.equal(arr.length);

        function getKey(key){
            if(key < 2){
                return '<2';
            }else{
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
        expect(getSum(obj)).to.equal(Object.keys(input).length);

        //ignore function
        let ignore = {
            a:1,
            b:1,
            c:2,
            1:3,
            'test': function(){}
        };
        obj = util.countByKey(ignore);
        expect(obj['1']).to.equal(2);
        expect(obj['2']).to.equal(1);
        expect(obj.test).to.be.an('undefined');
        expect(getSum(obj)).to.equal(Object.keys(ignore).length-1);
        obj = util.countByKey(ignore, x=>x, false);
        expect(getSum(obj)).to.equal(Object.keys(ignore).length);
    });

    it('getUniqueKeys', function(){
        let arr = [1,2,3,1,1,'1','1'];
        expect(util.getUniqueKeysAfterCount(arr).length).to.equal(3);
        expect(util.getUniqueKeysAfterCount(arr).indexOf('1')).to.not.equal(-1);
        expect(util.getUniqueKeysAfterCount(arr).indexOf('2')).to.not.equal(-1);
        expect(util.getUniqueKeysAfterCount(arr).indexOf('3')).to.not.equal(-1);
    });

    it('increment', function(){
        let undef;
        expect(util.increment(undef)).to.equal(1);
        expect(util.increment(null)).to.equal(1);
        expect(util.increment(2)).to.equal(3);
        expect(util.increment(-5, -1)).to.equal(-6);
        expect(util.increment(-5, 0)).to.equal(-5);
        expect(util.increment(1, '')).to.equal('1');
    });

    it('objectMap', function(){
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
    });

    it('objectReduce', function(){
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
    });
});
