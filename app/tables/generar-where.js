module.exports = function (query) {

		var result = '';

		if (query != undefined) {

			var campos = [];
			for (var field in query){
				var comillas = '';
				if (!parseInt(query[field]))
						comillas = "'";
				campos.push(field + ' = ' + comillas + query[field] + comillas);

			}
		
			result = campos.join(' AND ');			

		}
		else
		  result = '';

		return result;

}
