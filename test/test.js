'use strict';
const expect = require('chai').expect;
const util = require('../index.js');

describe('function tests',function(){
    it('pickOne', function(){
        let undef;
        expect(util.pickOne(undef, 1)).to.equal(1);
        expect(util.pickOne(null, 1)).to.equal(1);
        expect(util.pickOne(2, 1)).to.equal(2);
        expect(util.pickOne('abc', 1)).to.equal('abc');
    })
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
        expect(obj[5]).to.be.undefined;

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
        expect(obj[1]).to.be.undefined;
        expect(getSum(obj)).to.equal(arr.length);

        //input is a object
        let input = {
            a:1,
            b:1,
            c:2,
            1:3,
            'test': '1'
        }
        obj = util.countByKey(input);
        expect(obj['1']).to.equal(3);
        expect(obj['2']).to.equal(1);
        expect(obj['3']).to.equal(1);
        expect(obj['test']).to.be.undefined;
        expect(getSum(obj)).to.equal(Object.keys(input).length);

        //ignore function
        let ignore = {
            a:1,
            b:1,
            c:2,
            1:3,
            'test': function(){}
        }
        obj = util.countByKey(ignore);
        expect(obj['1']).to.equal(2);
        expect(obj['2']).to.equal(1);
        expect(obj['test']).to.be.undefined;
        expect(getSum(obj)).to.equal(Object.keys(ignore).length-1);
        obj = util.countByKey(ignore, x=>x, false);
        expect(getSum(obj)).to.equal(Object.keys(ignore).length);
    });

    it('getUniqueKeys', function(){
        let arr = [1,2,3,1,1,'1','1'];
        expect(util.getUniqueKeys(arr).length).to.equal(3);
        expect(util.getUniqueKeys(arr).indexOf('1')).to.not.equal(-1);
        expect(util.getUniqueKeys(arr).indexOf('2')).to.not.equal(-1);
        expect(util.getUniqueKeys(arr).indexOf('3')).to.not.equal(-1);
    });

    it('increment', function(){
        let undef;
        expect(util.increment(undef)).to.equal(1);
        expect(util.increment(null)).to.equal(1);
        expect(util.increment(2)).to.equal(3);
    });
});