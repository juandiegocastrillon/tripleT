'use strict';
var mocha = require('mocha');
var assert = require('assert');
var irv = require('./runOffVoting');
var _ = require('lodash');

describe('basic test', function() {
   it('no candidates', function() {
      var votes = [];
      assert.strictEqual(irv.getWinner(votes), '');
   });

   it('one vote - one candidate', function() {
      var votes = [
      {
         voter: 'John',
         vote: ['name1']
      }]
      var winner = irv.getWinner(votes);
      assert.strictEqual(winner, 'name1');
   });

   it('one vote - ten candidates', function() {
      var votes = [
      {
         voter: 'John',
         vote: ['name1', 'name2', 'name3', 'name4', 'name5',
                  'name6', 'namr7', 'name8', 'name9', 'name0']
      }]
      var winner = irv.getWinner(votes);
      assert.strictEqual(winner, 'name1');
   });

   it('two vote - ten candidates - tie', function() {
      var votes = [
      {
         voter: 'John',
         vote: ['name1', 'name2', 'name3', 'name4', 'name5',
                  'name6', 'namr7', 'name8', 'name9', 'name0']
      },
      {
         voter: 'Mary',
         vote: ['name5', 'name2', 'name3', 'name4', 'name1',
                  'name6', 'namr7', 'name8', 'name9', 'name0']
      }]
      var winner = irv.getWinner(votes);
      assert.strictEqual(winner, 'name1');
   });
});

describe('more complex elections', function() {
   it('two rounds', function() {
      var votes = [
      {
         voter: 'a',
         vote: ['Bob', 'Bill', 'Sue']
      },
      {
         voter: 'b',
         vote: ['Sue', 'Bob', 'Bill']
      },
      {
         voter: 'c',
         vote: ['Bill', 'Sue', 'Bob']
      },
      {
         voter: 'd',
         vote: ['Bob', 'Bill', 'Sue']
      },
      {
         voter: 'e',
         vote: ['Sue', 'Bob', 'Bill']
      }];

      var winner = irv.getWinner(votes);
      assert(_.isEqual(votes, [
      {
         voter: 'a',
         vote: ['Bob', 'Bill', 'Sue']
      },
      {
         voter: 'b',
         vote: ['Sue', 'Bob', 'Bill']
      },
      {
         voter: 'c',
         vote: ['Bill', 'Sue', 'Bob']
      },
      {
         voter: 'd',
         vote: ['Bob', 'Bill', 'Sue']
      },
      {
         voter: 'e',
         vote: ['Sue', 'Bob', 'Bill']
      }]))
   })
})