var _ = require('underscore');

module.exports = function (source, options) {

		var newObject = _.clone(source);

		if (options)
				if (options.exclude)
						for (var field in options.exclude)
								delete newObject[field];

		return newObject;


}
