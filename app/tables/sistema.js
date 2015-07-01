var request = require('sync-request');
var generarWhere = require('./generar-where');
var _ = require('underscore');

var dc = "LocalDTV";
function initialize (connectionData) {

	this.dc = _.clone(connectionData.datasource);

	this.create = function (contentData) {
	 
	 	return {};

	}

	this.read = function (query) {

		query = generarWhere(query);

		var response = request('GET', 'http://localhost:8080/envman-datalayer/datalayer/' + this.dc + '/DTVLA.DVM_SISTEMA/' + query).body.toString('utf8');
		var ret = JSON.parse(response);
		if (_.isEmpty(ret))
				ret = null;
	 	return ret;

	}

	this.update = function (query, contentData) {

		return {};

	}

	this.delete = function(query) {

		return {};

	}

	this.lastId = function() {
		return request('GET', 'http://localhost:8080/envman-datalayer/datalayer/' + this.dc + '/DTVLA.DVM_SISTEMA/lastid').ID;
	}

}

module.exports = initialize;
