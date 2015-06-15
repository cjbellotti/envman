var request = require('sync-request');

var env = "DESA";
var dc = "DESA";
function initialize (connectionData) {

	var functions = {};

	functions.create = function (contentData) {
	 
	 	return {};

	}

	functions.read = function (query) {

    if (query != undefined)
      query = query.ID;
    else
      query = '';

	 	return JSON.parse(request('GET', 'http://localhost:5000/valor-sistema/' + env + '/' + dc + '/' + query).body.toString('utf8'));

	}

	functions.update = function (query, contentData) {

	 	return {}; 

	}

	functions.delete = function(query) {

		return {}; 

	}

	functions.lastId = function() {
		return request('GET', 'http://localhost:5000/valor-sistema/' + env + '/' + dc + '/lastid').ID;
	}

	return functions;

}

module.exports = initialize;
