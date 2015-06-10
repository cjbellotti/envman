var manageJob = require('../tables/job');
var fs = require('fs');
var _ = require('underscore');
var swig = require('swig');

var scriptDespliegueTemplate = fs.readFileSync(__dirname + '/../cfg/templates/general-body-script-despliegue.sql').toString();

var templateInsert = fs.readFileSync(__dirname + '/../cfg/templates/general-insert-script-despliegue.sql').toString();
var templateUpdate = fs.readFileSync(__dirname + '/../cfg/templates/general-update-script-despliegue.sql').toString();
var claves = JSON.parse(fs.readFileSync('./app/cfg/claves.json'));

var DATOS = {};
var tablas = {};

DATOS.ADD = function (valor, nombre) {
	if (!DATOS[nombre]) {
		DATOS[nombre] = "";
	}

	if (DATOS[nombre].indexOf(nombre) < 0)
		DATOS[nombre] += valor + '\n';

	return "";
}

DATOS.EXIST = function (cadena, busqueda) {
	return (cadena.indexOf(busqueda) >= 0);
}

DATOS.GET_DATA = function(tabla, campo, id){

	var data = null;	
	var index = _.findIndex(tablas[tabla], { ID : parseInt(id) });
	if (index >= 0) 
		data = tablas[tabla][index][campo];
	return data;
		
}

var templateDir = __dirname + '/../cfg/templates';
var templates = {};
fs.readdir(templateDir, function (err, files) {

	if (err) throw err;

	console.log('Templates:');
	files.forEach(function (file) {
		if(file.indexOf('.sql') > 0) {

			console.log('\t - ' + file);

			var segmentosNombreArchivo = file.split('-');
			var tabla = segmentosNombreArchivo[0];
			var accion = segmentosNombreArchivo[1];

			if (!templates[tabla])
				templates[tabla] = {};

			var template = fs.readFileSync(templateDir + '/' + file).toString();
			templates[tabla][accion] = swig.compile(template);

		}

	});

});

function limpiarRegistro (registro) {

	var registroNuevo = {};

	for (var field in registro) {

		if (field != 'IDN' && field != 'MOD' && field != 'origenReg'){
			var comilla = "";
			if (typeof registro[field] == 'string' && registro[field].indexOf("'") < 0)
				comilla = "'";
			registroNuevo[field] = comilla + registro[field] + comilla;
		}

	}

	return registroNuevo;

}

function normalizarNombreTablas(job) {


	var jobTemp = _.clone(job);
	jobTemp.registros = _.clone(job.registros);

	if (jobTemp.registros.sistema) {

		jobTemp.registros.DVM_SISTEMA = [];
		for (var index in jobTemp.registros.sistema) {
			jobTemp.registros.DVM_SISTEMA.push(jobTemp.registros.sistema[index]);
		}
		delete jobTemp.registros['sistema'];

	}

	if (jobTemp.registros.entidadcanonica) {

		jobTemp.registros.DVM_ENTIDAD_CANONICA = [];
		for (var index in jobTemp.registros.entidadcanonica) {
			jobTemp.registros.DVM_ENTIDAD_CANONICA.push(jobTemp.registros.entidadcanonica[index]);
		}
		delete jobTemp.registros['entidadcanonica'];

	}

	if (jobTemp.registros.valorcanonico) {

		jobTemp.registros.DVM_VALOR_CANONICO = [];
		for (var index in jobTemp.registros.valorcanonico) {
			jobTemp.registros.DVM_VALOR_CANONICO.push(jobTemp.registros.valorcanonico[index]);
		}
		delete jobTemp.registros['valorcanonico'];

	}

	if (jobTemp.registros.valorsistema) {

		jobTemp.registros.DVM_VALOR_SISTEMA = [];
		for (var index in jobTemp.registros.valorsistema) {
			jobTemp.registros.DVM_VALOR_SISTEMA.push(jobTemp.registros.valorsistema[index]);
		}
		delete jobTemp.registros['valorsistema'];

	}

	return jobTemp;

}

function generarComando(comando, tabla, registro) {

	if (registro.IDN) {
		registro.ID = registro.IDN;
	}

	DATOS.TABLA  = tabla;
	DATOS.VALORES = limpiarRegistro (registro);
	DATOS.ORIGEN = limpiarRegistro (registro.origenReg || {});
	DATOS.CAMPOS = [];
	for (var field in DATOS.VALORES) {
		DATOS.CAMPOS.push(field);
	}
	DATOS.CLAVES = [];
	for (var field in claves[tabla]) {
		DATOS.CLAVES.push(field);
	}

	var template = "";
	if (templates[tabla]) {
		if (templates[tabla][comando])
			template = templates[tabla][comando];
		else
			template = templates.general[comando];
	} else
		template = templates.general[comando];

	var script = template(DATOS);

	return script;

}

function generarRollback(tabla, registro) {

	var accion = "delete";

	if (registro.IDN) {
		registro.ID = registro.IDN;
	} else if (registro.MOD) {
		accion = "update";
	} 


	DATOS.TABLA = tabla;
	DATOS.VALORES = limpiarRegistro(registro.origenReg || registro), 
	DATOS.ORIGEN = limpiarRegistro(registro)
	DATOS.CAMPOS = [];
	for (var field in DATOS.VALORES) {
		DATOS.CAMPOS.push(field);
	}
	DATOS.CLAVES = [];
	for (var field in claves[tabla]) {
		DATOS.CLAVES.push(field);
	}

	var template = "";
	if (templates[tabla]) {
		if (templates[tabla][accion])
			template = templates[tabla][accion];
		else
			template = templates.general[accion];
	} else
		template = templates.general[accion];

	var script = template(DATOS);

	return script;

}

function generarScript(nroJob) {

	var script = "";

	var job = {};

	if (_.isObject(nroJob)) {

		job.registros = nroJob;

	} else {

		job = manageJob.getJob(nroJob);

	}

	job = normalizarNombreTablas(job);

	tablas = job.registros;


	if (job) {

		for (var tabla in job.registros) {

			for (var registro in job.registros[tabla]) {

				if (job.registros[tabla][registro].MOD == undefined)
					script += generarComando('insert', tabla, job.registros[tabla][registro]) + "\n";
				else if (job.registros[tabla][registro].IDN || job.registros[tabla][registro].MOD)
					script += generarComando('update',tabla, job.registros[tabla][registro]) + "\n";

			}

		}

	}

	DATOS.ACCIONES = script;

	script = templates.general.body(DATOS);

	var result = {};
	result.despliegue = script;

	script = "";

	DATOS.DECLARACIONES = "";
	if (job) {

		for (var tabla in job.registros) {

			for (var registro in job.registros[tabla]) {

				script += generarRollback(tabla, job.registros[tabla][registro]) + '\n';

			}

		}

	}

	DATOS.ACCIONES = script;

	script = templates.general.body(DATOS);

	result.rollback = script;
	DATOS.DECLARACIONES = "";
	
	return result;

}

module.exports = generarScript;
