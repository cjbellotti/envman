var manageJob = require('../tables/job');
var generarScript = require('./generar-script-dvm-v2');

function wrapGenerarScript(job) {

	var result = {};
	for (var dc in job.registros) {

		var data = {
				target : job.target,
				registros : job.registros[dc]

		};
		result[dc] = generarScript(data, dc);

	}

	return result;

}
module.exports = wrapGenerarScript;
