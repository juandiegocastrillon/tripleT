var mongoose  = require('mongoose');
var PmRequest = mongoose.model('PmRequest').schema;
var _ 		  = require('lodash')

var pmRequestContainerSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  requests: [PmRequest]
});

pmRequestContainerSchema.methods.addRequest = function(request) {
  this.requests.push(request);
  this.save();
}

pmRequestContainerSchema.methods.removeRequest = function(request) {
	this.requests = _.reject(this.requests, request);
	this.save();
}
module.exports = mongoose.model('PmRequestContainer', pmRequestContainerSchema);
