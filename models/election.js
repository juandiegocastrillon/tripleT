var mongoose = require('mongoose');
var Vote = mongoose.model('Vote');

var _ = require('lodash');

/**
 * Schema for an election
 */
var electionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  candidates: [{
    type: String,
    required: true
  }],
  votes : [{
    type: mongoose.Schema.ObjectId,
    ref: 'Vote'
  }],
  creator: {
    type: String,
    required: true
  }
});


electionSchema.methods.castVote = function(voteCast) {
  var electionVotes = this.votes;
  _.forEach(electionVotes, function(voteID) {
    Vote.findOne({_id: voteID}, function(err, vote) {
      if (vote) {
        if (voteCast.voter === vote.voter) {
          Vote.remove({_id: vote.id}, function(err) {
            if (err) console.error(err);
          });
          vote.save();
        }
      }
    })
  })

  this.votes = electionVotes;
  this.votes.push(voteCast.id);
  this.save();
}

module.exports = mongoose.model('Election', electionSchema);