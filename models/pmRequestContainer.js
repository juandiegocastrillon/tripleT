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

pmRequestContainerSchema.methods.removeRequests = function(requests) {
	currentRequests = this.requests;
	_.forEach(requests, function(requestToDelete) {
		idx = _.findIndex(currentRequests, function(request) {
			return request.author === requestToDelete.author && request.item === requestToDelete.item;
		});
		currentRequests.splice(idx, 1);
	});
	this.requests = currentRequests;
	this.save();
}
module.exports = mongoose.model('PmRequestContainer', pmRequestContainerSchema);
