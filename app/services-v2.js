var app = require('express')(),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	manageJob = require('./tables/job'),
	verifyJob = require('./lib/verify-job'),
	generarScript = require('./lib/generar-script-dvm-v3'),
	getConfig = require('./lib/get-config'),
	exclude = require('./lib/utils/exclude');

var dataLayer = process.env.DATA_LAYER || '';

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
	console.log(req.body);
	next();
});

var servicios = {};

var ambientes = JSON.parse(fs.readFileSync('./app/cfg/ambientes.json'));

function definirServicio (file) {

	var filename = file.replace(/^.*[\\|\/]/, '');
	var nombreServicio = filename.substring(0, filename.indexOf('.'));
	console.log('Servicio %s', nombreServicio);

	servicios[nombreServicio] = {};

	var Servicio = require(file);
	for (var ambiente in ambientes) {

		servicios[nombreServicio][ambiente] = new Servicio(ambientes[ambiente][0]);

	}

	var url = '/' + nombreServicio + '/:ambiente';

	console.log('Publicando GET - %s...', url);
	app.get(url + '/:ID?', function (req, res) {

		var serviceName = req.url.substring(req.url.indexOf('/') + 1, req.url.substring(1).indexOf('/') + 1);
		var params = {};		
		if (!req.params.ID)
			params = undefined;
		else
			params = exclude(req.params, { exclude : { ambiente : "" } });

		
		var status = 200;
		var ret = servicios[serviceName][req.params.ambiente].read(params);
		if (ret == null) {
			status = 404;
			ret = {};
		}
		res.status(status)
			.json(ret)
			.end();

	});

	console.log('Publicando POST - %s...', url);
	app.post(url, function (req, res) {
		res.json(servicios[req.params.ambiente].create(req.body))
			.end();
	});

	console.log('Publicando PUT - %s...', url);
	app.put(url + '/:ID', function (req, res) {

		var status = 200;
		ret = servicios[req.params.ambiente].update(req.params, req.body);

		if (!ret) {
			status = 404;
			ret = {}
		}

		res.json(ret)
			.end();
	});

	console.log('Publicando DELETE - %s...', url);
	app.delete(url + '/:ID', function (req, res) {

		var status = 200;
		var ret = servicios[req.params.ambiente].delete(req.params);

		if (!ret) {
			status = 404;
			ret = {};
		}

		res.status(status)
			.json(ret)
			.end();
	});

}

function definirServicioJob () {

	console.log('Publicando GET - /job/:job/:tabla?/:id?...');
	app.get('/job/:job?/:tabla?/:ID?', function (req, res) {

		var status = 200;
		var job = {};
		var ret = {};

		if (req.params.ID) {

			ret = manageJob.getRegistro(req.params.job, req.params.tabla, req.params.ID);

		} else {

			if (req.params.tabla) {

				ret = manageJob.getRegistros(req.params.job, req.params.tabla);

			} else {

				if (req.params.job) {

					ret = manageJob.getJob(req.params.job);
				} else {

					ret = manageJob.getJob();

				}

			}

		} 

		if (ret == null) {
			ret = {};
			status = 404;
		}

		res.status(status)
			.json(ret)
			.end();

	});

	console.log('Publicando POST - /job/:job?/:tabla?...');
	app.post('/job/:job?/:tabla?', function (req, res) {

		var status = 200;
		var job;
		if (!req.params.job) {

			job = manageJob.addJob(req.body);
			if (job == null) {
				job = {};
				status = 500;
			} else {
				manageJob.persist();
			}

		} else {
			job = manageJob.addRegistrosTojob(req.params.job, req.params.tabla, req.body);
			if (job == null) {
				job = {};
				status = 500;
			} else {
				manageJob.persist();
			}
		}

		res.status (status)
			.json(job)
			.end();

	});

	console.log('Publicando PUT - /job/:job?/:tabla?...');
	app.put('/job/:job?/:tabla?/:id?', function (req, res) {

		var status = 200;
		var ret = null;

		if (req.params.id) {

			ret = manageJob.updateRegistroFromJob(req.params.job, 
													req.params.tabla, 
													req.params.id, req.body);
			manageJob.persist();

		} else if (req.params.job) {

			ret = manageJob.updateJob(req.params.job, req.body);
			manageJob.persist();

		}

		if (ret == null) {
			status = 404;
		}

		res.status (status)
			.json(ret)
			.end();

	});

	console.log('Publicando DELETE - /job/:job?/:tabla?...');
	app.delete('/job/:job?/:tabla?/:id?', function (req, res) {

		var status = 200;
		var ret = null;

		if (req.params.id) {

			ret = manageJob.removeRegistrosFromjob(req.params.job, 
													req.params.tabla, 
													req.params.id);
			manageJob.persist();

		} else if (req.params.job) {

			ret = manageJob.removeJob(req.params.job);
			manageJob.persist();

		}

		if (ret == null) {
			status = 404;
		}

		res.status (status)
			.json(ret)
			.end();

	});

	console.log('Publicando POST - /verificar');
	app.post('/verificar', function (req, res) {

		var result = verifyJob(req.body);
		res.json(result)
			.end();

	});

	console.log('Publicando POST - /verificar/:job');
	app.post('/verificar/:job', function (req, res) {

		var result = verifyJob(req.params.job);
		res.json(result)
			.end();

	});

	console.log('Publicando GET - /generar-script/:job');
	app.get('/generar-script/:job', function (req, res) {

		var result = generarScript(req.params.job);
		res.json(result)
			.end();

	});

	console.log('Publicando POST - /generar-script/:job');
	app.post('/generar-script', function (req, res) {

		var result = generarScript(req.body);
		res.json(result)
			.end();

	});

	console.log('Publicando GET - /ambientes');
	app.get('/ambientes', function (req, res) {

		var listaAmbientes = [];
		for (var ambiente in ambientes)
				listaAmbientes.push(ambiente);

		res.json(listaAmbientes)
			.end();
	});

	console.log('Publicando GET - /config');
	app.get('/config', function (req, res) {

		res.json(getConfig())
			.end();

	});		

}

fs.readdir(__dirname + '/tables/' + dataLayer, function (err, files) {

	if (err) throw err;

	files.forEach(function (file) {
		if(file.indexOf('.js') > 0 && file.indexOf('job') < 0)
			definirServicio(__dirname + '/tables/' + dataLayer + '/' +  file);
	});

	definirServicioJob();

});

module.exports = app;
