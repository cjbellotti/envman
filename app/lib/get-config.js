var fs = require('fs');

var relationships = JSON.parse(fs.readFileSync('./app/cfg/relationship.json'));
var claves = JSON.parse(fs.readFileSync('./app/cfg/claves.json'));

function getConfig() {

		var data = {

			relationships : relationships,
			claves : claves

		};

		return data;
}

module.exports = getConfig;
