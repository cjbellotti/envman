
Date.prototype.getYYYYMMDD = function () { return this.toISOString().replace(/(.*?)\-(.*?)\-(.*?)T.*/g,"$1-$2-$3"); }

window.collections.jobs = new EnvMan.Collections.Jobs();
window.collections.sistemas = new EnvMan.Collections.Sistemas();
window.collections.sistemas.comparator = "ID";
window.collections.entidades = new EnvMan.Collections.Entidades();
window.collections.entidades.comparator = "ID";
window.collections.valoresCanonicos = new EnvMan.Collections.ValoresCanonicos();
window.collections.valoresCanonicos.comparator = "ID";
window.collections.valoresSistema = new EnvMan.Collections.ValoresSistema();
window.collections.valoresSistema.comparator = "ID";
window.ambientes = [];

window.Fases = [
	"DESA",
	"IST",
	"UATP",
	"ISTM",
	"QAM",
	"PROD"
];


var tablas = {

	DVM_SISTEMA : window.collections.sistemas,
	DVM_ENTIDAD_CANONICA : window.collections.entidades,
	DVM_VALOR_CANONICO : window.collections.valoresCanonicos,
	DVM_VALOR_SISTEMA : window.collections.valoresSistema

};

window.generales.agregarRegistroAlJob = function(tabla, registro) {

	var ret =  true;
	if (!window.job.registros[tabla]) {
		window.job.registros[tabla] = [];
	}

	var index = _.findIndex(job.registros[tabla], { ID : registro.ID});

	if (index >= 0) {
		var ultimo = _.last(job.registros[tabla]);
		registro.ID = ultimo.ID + 1;
	}

	window.job.registros[tabla].push (registro);

	return ret;

}

window.generales.modificarRegistroEnJob = function(tabla, registro) {

	var ret = false;
	if (!window.job.registros[tabla]) {
		window.job.registros[tabla] = [];
	}

	var index = _.findIndex(job.registros[tabla], { ID : registro.ID});

	if (index >= 0) {
		window.job.registros[tabla][index] = registro;
		ret = true;
	}

	return ret;

}

window.generales.eliminarRegistroDeJob = function(tabla, registro) {

	var ret = false;
	if (window.job.registros[tabla]) {

		var index = _.findIndex(job.registros[tabla], { ID : registro.ID});

		if (index >= 0) {
			//window.job.registros[tabla] = _.without(window.job.registros[tabla], window.job.registros[tabla][index]);
			job.registros[tabla].splice(index,1);
			ret = true;
		}

	}

	return ret;

}

window.generales.obtenerRegistroDeJob = function(tabla, id) {

	var ret = null;
	if (window.job.registros[tabla]) {

		var index = _.findIndex(job.registros[tabla], { ID : id});

		if (index >= 0)
			ret = window.job.registros[tabla][index];

	}

	return ret;

}

window.generales.normalizarSistema = function (id) {

	var sistema = window.generales.obtenerRegistroDeJob("sistema", id);

	if (sistema == null) {

		var modelosistema = window.collections.sistemas.get(id);
		if (modelosistema) {

			var data = modelosistema.toJSON();
			window.generales.agregarRegistroAlJob("sistema", data);

		}

	}

}

window.generales.normalizarEntidadCanonica = function (id) {

	var entidadCanonica = window.generales.obtenerRegistroDeJob("entidadcanonica", id);

	if (entidadCanonica == null) {

		var modeloEntidadCanonica = window.collections.entidades.get(id);
		if (modeloEntidadCanonica) {

			var data = modeloEntidadCanonica.toJSON();
			window.generales.agregarRegistroAlJob("entidadcanonica", data);

		}

	}

}

window.generales.normalizarValorCanonico = function (id) {

	var valorCanonico = window.generales.obtenerRegistroDeJob("valorcanonico", id);

	if (valorCanonico == null) {

		var modeloValorCanonico = window.collections.valoresCanonicos.get(id);
		if (modeloValorCanonico) {

			var data = modeloValorCanonico.toJSON();
			window.generales.agregarRegistroAlJob("valorcanonico", data);

		}

	}

}

window.generales.agregarValorCanonicoAJob = function(registro) {

	window.generales.agregarRegistroAlJob("valorcanonico", registro);

	window.generales.normalizarEntidadCanonica(registro['ID_ENTIDAD_CANONICA']);

}

window.generales.modificarValorCanonicoEnJob = function(registro) {

	window.generales.modificarRegistroEnJob("valorcanonico", registro);

	window.generales.normalizarEntidadCanonica(registro['ID_ENTIDAD_CANONICA']);

}

window.generales.agregarValorSistemaAJob = function(registro) {

	window.generales.agregarRegistroAlJob("valorsistema", registro);

	window.generales.normalizarSistema(registro['ID_SISTEMA']);

	window.generales.normalizarEntidadCanonica(registro['ID_ENTIDAD_CANONICA']);

	window.generales.normalizarValorCanonico(registro['ID_VALOR_CANONICO']);

}

window.generales.modificarValorSistemaEnJob = function(registro) {

	window.generales.modificarRegistroEnJob("valorsistema", registro);

	window.generales.normalizarSistema(registro['ID_SISTEMA']);

	window.generales.normalizarEntidadCanonica(registro['ID_ENTIDAD_CANONICA']);

	window.generales.normalizarValorCanonico(registro['ID_VALOR_CANONICO']);

}

window.generales.crearTablas = function(tablas) {

	tablas = {};

	tablas.sistema = [];
	tablas.entidad = [];
	tablas.valorcanonico =[];
	tablas.valorsistema = [];	
}

window.generales.crearNuevoJob = function () {

	window.job = {

		job : "",
		target : "DESA",
		proyecto : "",
		descripcion : "",
		registros : {

			sistema : [],
			entidadcanonica : [],
			valorcanonico : [],
			valorsistema : []

		}

	};

}

window.generales.cargarColecciones = function () {

	for (var tabla in window.job.registros) {

		for (var index in window.job.registros[tabla]) {

			var registro = window.job.registros[tabla][index];
			var query = {};
			for (var field in registro) {

				if (field != 'ID' && field != 'DESCRIPCION')
					query[field] = registro[field];

			}

			var model = null;
			switch (tabla) {

				case "sistema":

					model = window.collections.sistemas.where(query);
					if (model != null && model.length > 0) {
						if (model[0].get('DESCRIPCION') != registro.DESCRIPCION)
							window.collections.sistemas.set(new EnvMan.Models.Sistema(registro), { remove : false });
					} else {
						window.collections.sistemas.add(new EnvMan.Models.Sistema(registro));
					}
					break;

				case "entidadcanonica":

					model = window.collections.entidades.where(query);
					if (model != null && model.length > 0) {
						if (model[0].get('DESCRIPCION') != registro.DESCRIPCION)
							window.collections.entidades.set(new EnvMan.Models.Entidad(registro), { remove : false});
					} else {
						window.collections.entidades.add(new EnvMan.Models.Entidad(registro));
					}
					break;

				case "valorcanonico":

					model = window.collections.valoresCanonicos.where(query);
					if (model != null && model.length > 0) {
						if (model[0].get('DESCRIPCION') != registro.DESCRIPCION)
							window.collections.valoresCanonicos.set(new EnvMan.Models.ValorCanonico(registro), { remove : false});
					} else {
						window.collections.valoresCanonicos.add(new EnvMan.Models.ValorCanonico(registro));
					}
					break;

				case "valorsistema":

					model = window.collections.valoresSistema.where(query);
					if (model != null && model.length > 0) {
						window.collections.valoresSistema.set(new EnvMan.Models.ValorCanonico(registro), { remove : false});
					} else {
						window.collections.valoresSistema.add(new EnvMan.Models.ValorCanonico(registro));
					}
					break;

			}

		}

	}

}

window.generales.limpiarRegistros = function (registros) {

	for (var tabla in registros) {

		for (var index in registros[tabla]) {

			for (var field in registros[tabla][index]) {

				if (field == 'IDN' || field == 'MOD' || field == 'origenReg') {

					delete registros[tabla][index][field];

				}

			}

		}

	}

}

window.generales.normalizarNombreTabla = function (nombreTabla) {

	var nombreTablaNormalizado = '';
	switch (nombreTabla) {
		case 'sistema':

			nombreTablaNormalizado = 'DVM_SISTEMA';
			break;

		case 'entidadcanonica':

			nombreTablaNormalizado = 'DVM_ENTIDAD_CANONICA';
			break;

		case 'valorcanonico':

			nombreTablaNormalizado = 'DVM_VALOR_CANONICO';
			break;

		case 'valorsistema':

			nombreTablaNormalizado = 'DVM_VALOR_SISTEMA';
			break;

		default:

			nombreTablaNormalizado = null;
			break;

	}

	return nombreTablaNormalizado;
	
};

// url: Debe empezar y terminar con '/'
window.generales.obtenerDatos = function (Coleccion, url) {

	var coleccion = new Coleccion();

	coleccion.url = url;

	coleccion.fetch({ async : false });
	
	return coleccion.toJSON();

}

window.generales.datos = {};

window.generales.datos.sistemas = function (ambiente) {

		return window.generales.obtenerDatos(EnvMan.Collections.Sistemas, '/sistema/' + ambiente);

}

window.generales.datos.entidades = function (ambiente) {

		return window.generales.obtenerDatos(EnvMan.Collections.Entidades, '/entidad-canonica/' + ambiente);

}

window.generales.datos.valoresCanonicos = function (ambiente) {

		return window.generales.obtenerDatos(EnvMan.Collections.ValoresCanonicos, '/valor-canonico/' + ambiente);

}

window.generales.datos.valoresSistema = function (ambiente) {

		return window.generales.obtenerDatos(EnvMan.Collections.ValoresSistema, '/valor-sistema/' + ambiente);

}

window.generales.cargarComboAmbientes = function (elemento) {

	elemento.html('');

	for (var index in window.ambientes){

			var option = $('<option/>');
			option.attr('value', window.ambientes[index]);
			option.html(ambientes[index]);
			elemento.append(option);

	}
}

window.generales.cargarComboSistemas = function (elemento, ambiente, modalidad) {

	elemento.html('');

	if (modalidad == '*')
		elemento.append('<option value="*">Todas</option>');

	var sistemas = window.generales.datos.sistemas(ambiente);
	for (var index in sistemas){

			var option = $('<option/>');
			option.attr('value', sistemas[index].ID);
			option.html(sistemas[index].NOMBRE + ' - ' + sistemas[index].PAIS);
			elemento.append(option);

	}

}

window.generales.cargarComboEntidades = function (elemento, ambiente, modalidad) {

	elemento.html('');

	if (modalidad == '*')
		elemento.append('<option value="*">Todas</option>');

	var entidades = window.generales.datos.entidades(ambiente);
	for (var index in entidades){

			var option = $('<option/>');
			option.attr('value', entidades[index].ID);
			option.html(entidades[index].NOMBRE);
			elemento.append(option);

	}

}

window.v2 = {};

window.v2.crearTablas = function (registros) {

		registros.DVM_SISTEMA = [];
		registros.DVM_ENTIDAD_CANONICA = [];
		registros.DVM_VALOR_CANONICO = [];
		registros.DVM_VALOR_SISTEMA = [];

}

window.v2.completarRegistros = function (registros) {


	for (var tabla in registros) {

		for (var index in registros[tabla]) {		

				window.v2.procesarRegistro(registros, registros[tabla][index]);

		}

	}

}

window.v2.procesarRegistro = function (registros, registro) {

	for (var field in registro) {

		window.v2.procesarCampo(registros, field, registro[field]);

	}
}

window.v2.generarQuery = function (registro, tabla) {

	var query = {};

	for (var field in config.claves[tabla]) {

		query[field] = registro[field];

	}

	return query;
}

window.v2.procesarCampo = function(registros, campo, valor) {

	if (config.relationships[campo]) {

		var tabla = config.relationships[campo];
		var registro = tablas[tabla].get(valor);
		
		if (registro) {
				var query = window.v2.generarQuery(registro.toJSON(), tabla);

				var index = _.findIndex(registros[tabla], query);
				if (index < 0) {

						var model = tablas[tabla].where(query);
						if (model.length > 0) {

								var data = model[0].toJSON();
								registros[tabla].push(data);

						}

				}

				window.v2.procesarRegistro(registros, registro.toJSON());

		}

	}

}


$(function() {
		
		$.ajax({

				url : '/ambientes',
				method : 'GET',
				async : false,
				success : function (data) {

					window.ambientes = data;

				}

		});


		$.ajax({

				url : '/config',
				method : 'GET',
				async : false,
				success : function (data) {

					window.config = data;

				}

		});

})
