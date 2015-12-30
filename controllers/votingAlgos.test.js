'use strict';
var mocha = require('mocha');
var assert = require('assert');
var votingAlgo = require('./votingAlgorithms');
var _ = require('lodash');

describe('basic test', function() {
   it('no candidates', function() {
      var votes = [];
      assert.strictEqual(votingAlgo.instantRunOff(votes), '');
   });

   it('one vote - one candidate', function() {
      var votes = [
      {
         voter: 'John',
         vote: ['name1']
      }]
      var winner = votingAlgo.instantRunOff(votes);
      assert.strictEqual(winner, 'name1');
   });

   it('one vote - ten candidates', function() {
      var votes = [
      {
         voter: 'John',
         vote: ['name1', 'name2', 'name3', 'name4', 'name5',
                  'name6', 'namr7', 'name8', 'name9', 'name0']
      }]
      var winner = votingAlgo.instantRunOff(votes);
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
      var winner = votingAlgo.instantRunOff(votes);
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

      var winner = votingAlgo.instantRunOff(votes);
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

describe('most complex election', function() {
   it('many rounds', function() {
      var votes = [
      {
      voter: "spkelley",
      vote: [
      "Andriatis",
      "Ben Gruber",
      "Bo",
      "Connor Mc",
      "Michael Traub",
      "JT",
      "JuanDe",
      "Emanuele",
      "Dan Chen",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "richterc",
      vote: [
      "Ben Gruber",
      "JT",
      "Michael Traub",
      "Connor Mc",
      "JuanDe",
      "Emanuele",
      "Dan Chen",
      "Bo",
      "Andriatis",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "ifndez",
      vote: [
      "JuanDe",
      "Ben Gruber",
      "Bo",
      "Connor Mc",
      "Michael Traub",
      "JT",
      "Emanuele",
      "Dan Chen",
      "Andriatis",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "ececca",
      vote: [
      "Emanuele",
      "JuanDe",
      "Bo",
      "Connor Mc",
      "Michael Traub",
      "JT",
      "Dan Chen",
      "Ben Gruber",
      "Andriatis",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "stroming",
      vote: [
      "JT",
      "JuanDe",
      "Michael Traub",
      "Connor Mc",
      "Emanuele",
      "Bo",
      "Dan Chen",
      "Ben Gruber",
      "Andriatis",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "davidhwu",
      vote: [
      "JT",
      "JuanDe",
      "Bo",
      "Connor Mc",
      "Michael Traub",
      "Emanuele",
      "Dan Chen",
      "Ben Gruber",
      "Andriatis",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "mtraub",
      vote: [
      "Michael Traub",
      "Bo",
      "Connor Mc",
      "JT",
      "JuanDe",
      "Emanuele",
      "Dan Chen",
      "Ben Gruber",
      "Andriatis",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "ammier",
      vote: [
      "Ben Gruber",
      "Joe Schuman",
      "Andriatis",
      "JT",
      "Michael Traub",
      "JuanDe",
      "Bo",
      "Connor Mc",
      "Emanuele",
      "Dan Chen",
      "Bailey Montano "
      ]
      },
      {
      voter: "codyjaco",
      vote: [
      "JuanDe",
      "Andriatis",
      "Bo",
      "Connor Mc",
      "Michael Traub",
      "JT",
      "Emanuele",
      "Dan Chen",
      "Ben Gruber",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "dchen17",
      vote: [
      "Dan Chen",
      "JT",
      "Michael Traub",
      "Emanuele",
      "JuanDe",
      "Andriatis",
      "Ben Gruber",
      "Joe Schuman",
      "Bo",
      "Connor Mc",
      "Bailey Montano "
      ]
      },
      {
      voter: "cunqueim",
      vote: [
      "JT",
      "Michael Traub",
      "JuanDe",
      "Bo",
      "Connor Mc",
      "Emanuele",
      "Dan Chen",
      "Ben Gruber",
      "Andriatis",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "jschuman",
      vote: [
      "JT",
      "Ben Gruber",
      "JuanDe",
      "Michael Traub",
      "Bo",
      "Connor Mc",
      "Emanuele",
      "Andriatis",
      "Joe Schuman",
      "Bailey Montano ",
      "Dan Chen"
      ]
      },
      {
      voter: "alatham",
      vote: [
      "Andriatis",
      "JT",
      "JuanDe",
      "Connor Mc",
      "Emanuele",
      "Ben Gruber",
      "Bailey Montano ",
      "Joe Schuman",
      "Dan Chen",
      "Bo",
      "Michael Traub"
      ]
      },
      {
      voter: "hagan",
      vote: [
      "JT",
      "Andriatis",
      "Bo",
      "Connor Mc",
      "Michael Traub",
      "JuanDe",
      "Emanuele",
      "Dan Chen",
      "Ben Gruber",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "ericwong",
      vote: [
      "JuanDe",
      "Andriatis",
      "Bo",
      "Connor Mc",
      "Michael Traub",
      "JT",
      "Emanuele",
      "Dan Chen",
      "Ben Gruber",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "skebede",
      vote: [
      "Andriatis",
      "JT",
      "JuanDe",
      "Ben Gruber",
      "Michael Traub",
      "Connor Mc",
      "Bo",
      "Emanuele",
      "Dan Chen",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "cgoul",
      vote: [
      "JuanDe",
      "Ben Gruber",
      "Connor Mc",
      "Michael Traub",
      "Andriatis",
      "Bailey Montano ",
      "JT",
      "Bo",
      "Emanuele",
      "Dan Chen",
      "Joe Schuman"
      ]
      },
      {
      voter: "sprinale",
      vote: [
      "Bailey Montano ",
      "JT",
      "JuanDe",
      "Ben Gruber",
      "Bo",
      "Andriatis",
      "Connor Mc",
      "Dan Chen",
      "Michael Traub",
      "Emanuele",
      "Joe Schuman"
      ]
      },
      {
      voter: "fsoucy",
      vote: [
      "JT",
      "JuanDe",
      "Emanuele",
      "Michael Traub",
      "Bo",
      "Connor Mc",
      "Dan Chen",
      "Ben Gruber",
      "Andriatis",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "alibadr",
      vote: [
      "JuanDe",
      "Michael Traub",
      "Bo",
      "Connor Mc",
      "JT",
      "Emanuele",
      "Dan Chen",
      "Ben Gruber",
      "Andriatis",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "alecand",
      vote: [
      "JuanDe",
      "JT",
      "Michael Traub",
      "Bo",
      "Connor Mc",
      "Emanuele",
      "Dan Chen",
      "Ben Gruber",
      "Andriatis",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "tomcook",
      vote: [
      "JT",
      "JuanDe",
      "Emanuele",
      "Bo",
      "Connor Mc",
      "Michael Traub",
      "Dan Chen",
      "Ben Gruber",
      "Andriatis",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "jhomrich",
      vote: [
      "JT",
      "JuanDe",
      "Bo",
      "Connor Mc",
      "Michael Traub",
      "Dan Chen",
      "Emanuele",
      "Ben Gruber",
      "Andriatis",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "shguo",
      vote: [
      "Ben Gruber",
      "JT",
      "Bo",
      "Connor Mc",
      "Michael Traub",
      "JuanDe",
      "Dan Chen",
      "Emanuele",
      "Andriatis",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "jfdjesus",
      vote: [
      "JuanDe",
      "JT",
      "Bo",
      "Michael Traub",
      "Andriatis",
      "Emanuele",
      "Dan Chen",
      "Connor Mc",
      "Ben Gruber",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      },
      {
      voter: "bmontano",
      vote: [
      "JT",
      "Ben Gruber",
      "Emanuele",
      "JuanDe",
      "Andriatis",
      "Connor Mc",
      "Bo",
      "Michael Traub",
      "Dan Chen",
      "Bailey Montano ",
      "Joe Schuman"
      ]
      }
   ];

      var instantRunOffWinner = votingAlgo.instantRunOff(votes);
      assert(_.isEqual(instantRunOffWinner, 'JT'));

      var classicalElectionWinner = votingAlgo.classicalElection(votes, 2);
      assert(_.isEqual(classicalElectionWinner, ['JuanDe', 'JT']));


   })
})