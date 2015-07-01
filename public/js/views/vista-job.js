EnvMan.Views.Job = Backbone.View.extend({

	initialize : function () {
	
		this.template = swig.compile( $('#job-screen-template').html() );

		window.collections.sistemas.reset();
		window.collections.entidades.reset();
		window.collections.valoresCanonicos.reset();
		window.collections.valoresSistema.reset();

		window.collections.sistemas.fetchData({
			success : function () {

				window.collections.entidades.fetchData({
					success : function () {

						window.collections.valoresCanonicos.fetchData({

							success : function () {

								window.collections.valoresSistema.fetchData({

									success : function () {

										window.generales.cargarColecciones();

									}

								});

							}

						});

					}

				});

			}

		});

		var self = this;
		$.post('/verificar/' + window.job.job, function (data) {

				var dc;
				for (dc in data);
				
				for (var tabla in data[0]) {

					var Model = null;
					var collection = null;
					switch (tabla) {

						case 'sistema':

							Model = EnvMan.Models.Sistema;
							collection = window.collections.sistemas;
							break;

						case 'entidadcanonica' :

							Model = EnvMan.Models.Entidad;
							collection = window.collections.entidades;
							break;

						case 'valorcanonico' : 

							Model = EnvMan.Models.ValorCanonico;
							collection = window.collections.valoresCanonicos;
							break;

						case 'valorsistema' : 

							Model = EnvMan.Models.ValorSistema;
							collection = window.collections.valoresSistema;
							break;
							
					}

					for (var index in data[tabla]) {

						var modelData = {};
						for (var field in data[tabla][index]) {

							if (field != 'IDN' && field != 'origen') {

								modelData[field] = data[tabla][index][field];

							}

						}

						var model = new Model(modelData);

						if (data[tabla][index].IDN) {

							collection.add(model);

						} else if (data[tabla][index].MOD) {

							collection.set(model, { remove : false });
							
						}

					}

				}
		});

	},

	events : {
		"click .fase-anterior" : "faseAnterior",
		"click .siguiente-fase" : "siguienteFase",
		"click #tabSistemas" : "mostrarTablaSistemas",
		"click #tabEntidades" : "mostrarTablaEntidades",
		"click #tabValoresSistema" : "mostrarTablaValorSistema",
		"click #tabValoresCanonicos" : "mostrarTablaValorCanonico",
		"click #aceptar" : "guardar",
		"click #verificar" : "verificar",
		"click #importar" : "importar"
	},

	faseAnterior : function (e) {

		e.preventDefault();
		var index = window.Fases.indexOf(window.job.target);
		if (index >= 0) {
			index--;
			window.job.target = window.Fases[index];
			this.$el.find('.btn-group button:not(.disabled)').addClass('disabled');
			this.$el.find('#' + job.target + ' button').removeClass('disabled');
		}

	},

	siguienteFase : function (e) {

		e.preventDefault();
		var index = window.Fases.indexOf(window.job.target);
		if (index >= 0) {
			index++;
			window.job.target = window.Fases[index];
			this.$el.find('.btn-group button:not(.disabled)').addClass('disabled');
			this.$el.find('#' + job.target + ' button').removeClass('disabled');
		}

	},

	mostrarTablaSistemas : function (e) {

		this.$el.find('#tabSistemas').addClass('active');
		this.$el.find('#tabEntidades').removeClass('active');
		this.$el.find('#tabValoresSistema').removeClass('active');
		this.$el.find('#tabValoresCanonicos').removeClass('active');

		var configTable = {};
		configTable.headers = [];
		configTable.headers.push("ID");
		configTable.headers.push("PAIS");
		configTable.headers.push("NOMBRE");
		configTable.headers.push("DESCRIPCION");
		configTable.arrayData = job.registros.sistema;
		configTable.title = "Sistema";
		configTable.table = "sistema";
		configTable.model = EnvMan.Models.Sistema;
		configTable.view = EnvMan.Views.Sistema;
		configTable.viewImport = EnvMan.Views.SistemaImportar;

		var sistemasTable = crearTabla(configTable);

		sistemasTable.render();
		this.$el.find('.tab-content').html('');
		this.$el.find('.tab-content').append(sistemasTable.$el);

	},

	mostrarTablaEntidades : function (e) {

		this.$el.find('#tabSistemas').removeClass('active');
		this.$el.find('#tabEntidades').addClass('active');
		this.$el.find('#tabValoresSistema').removeClass('active');
		this.$el.find('#tabValoresCanonicos').removeClass('active');

		var configTable = {};

		configTable.headers = [];
		configTable.headers.push("ID");
		configTable.headers.push("NOMBRE");
		configTable.headers.push("DESCRIPCION");
		configTable.arrayData = job.registros.entidadcanonica;
		configTable.title = "Entidad Canonica";
		configTable.table = "entidadcanonica";
		configTable.model = EnvMan.Models.Entidad;
		configTable.view = EnvMan.Views.Entidad;
		configTable.viewImport = EnvMan.Views.EntidadImportar;

		var entidadesTable = crearTabla(configTable);

		entidadesTable.render();
		this.$el.find('.tab-content').html('');
		this.$el.find('.tab-content').append(entidadesTable.$el);

	},

	mostrarTablaValorSistema : function (e) {

		this.$el.find('#tabSistemas').removeClass('active');
		this.$el.find('#tabEntidades').removeClass('active');
		this.$el.find('#tabValoresSistema').addClass('active');
		this.$el.find('#tabValoresCanonicos').removeClass('active');

		var configTable = {};

		configTable.headers = [];
		configTable.headers.push("ID");
		configTable.headers.push("ID_SISTEMA");
		configTable.headers.push("PAIS");
		configTable.headers.push("ID_VALOR_CANONICO");
		configTable.headers.push("ID_ENTIDAD_CANONICA");
		configTable.headers.push("VALOR_SISTEMA");
		configTable.arrayData = job.registros.valorsistema;
		configTable.title = "Valor Sistema";
		configTable.table = "valorsistema";
		configTable.model = EnvMan.Models.ValorSistema;
		configTable.view = EnvMan.Views.ValorSistema;
		configTable.viewImport = EnvMan.Views.ValorSistemaImportar;
		configTable.processCell = function (field, content, rowData) {

			var nombre = content;
			if (field == "ID_ENTIDAD_CANONICA"){

				var entidad = window.collections.entidades.get(content);
				if (!entidad)
					nombre = "Entidad " + content + " inexistente.";
				else
					nombre = entidad.get('NOMBRE');

			} else if (field == "ID_SISTEMA") {

				var sistema = window.collections.sistemas.get(content);
				if (!sistema)
					nombre = "Sistema " + content + " inexistente.";
				else
					nombre = sistema.get('NOMBRE');

			} else if (field == "ID_VALOR_CANONICO") {

				var valorCanonico = window.collections.valoresCanonicos.get(content);
				if (!valorCanonico)
					nombre = "Valor Canonico " + content + " inexistente.";
				else
					nombre = valorCanonico.get('VALOR_CANONICO');

			} else if (field == 'PAIS') {

				var sistema = window.collections.sistemas.get(rowData.ID_SISTEMA);
				if (!sistema)
					nombre = "Sin Pais";
				else
					nombre = sistema.get('PAIS');		
			}

			return nombre;

		}

		var valorSistemaTable = new crearTabla(configTable);

		valorSistemaTable.render();
		this.$el.find('.tab-content').html('');
		this.$el.find('.tab-content').append(valorSistemaTable.$el);

	},

	mostrarTablaValorCanonico : function (e) {

		this.$el.find('#tabSistemas').removeClass('active');
		this.$el.find('#tabEntidades').removeClass('active');
		this.$el.find('#tabValoresSistema').removeClass('active');
		this.$el.find('#tabValoresCanonicos').addClass('active');

		var configTable = {};

		configTable.headers = [];
		configTable.headers.push("ID");
		configTable.headers.push("ID_ENTIDAD_CANONICA");
		configTable.headers.push("DESCRIPCION");
		configTable.headers.push("VALOR_CANONICO");
		configTable.arrayData = job.registros.valorcanonico;
		configTable.title = "Valor Canonico";
		configTable.table = "valorcanonico";
		configTable.model = EnvMan.Models.ValorCanonico;
		configTable.view = EnvMan.Views.ValorCanonico;
		configTable.viewImport = EnvMan.Views.ValorCanonicoImportar;
		configTable.processCell = function (field, content) {

			var nombre = content;
			if (field == "ID_ENTIDAD_CANONICA"){

				var entidad = window.collections.entidades.get(content);

				if (!entidad)
					nombre = "Entidad " + content + " inexistente.";
				else
					nombre = entidad.get('NOMBRE');


			}

			return nombre;

		}

		var valorCanonicoTable = new crearTabla(configTable);

		valorCanonicoTable.render();
		this.$el.find('.tab-content').html('');
		this.$el.find('.tab-content').append(valorCanonicoTable.el);

	},

	guardar : function (e) {

			if (window.job.job == '')
					delete window.job.job;
		window.job.fecha = window.job.fecha || new Date();
		window.job.proyecto = this.$el.find('#proyecto').val();
		window.job.descripcion = this.$el.find('#descripcion').val();
		window.generales.limpiarRegistros(window.job.registros);
		var jobModel = new EnvMan.Models.Job(window.job);
		jobModel.save();
		window.job = jobModel.toJSON();
		window.collections.jobs.reset();
		window.collections.jobs.fetch();

	},

	verificar : function (e) {

		e.preventDefault();
		var view = new EnvMan.Views.VerificarJob();
		$('#modals').append(view.el);
		view.render();
		view.$el.modal({

			backdrop : 'static',
			keyboard : false

		});
	},

	importar : function (e) {

		e.preventDefault();
		
		var view = new EnvMan.Views.ImportarArchivo ();
		$('#modals').append(view.el);
		view.render();
		view.$el.modal({

			backdrop : 'static',
			keyboard : false

		});

	},

	render : function (job) {

		this.$el.html(this.template(job));
		this.$el.find('#' + job.target + ' button').removeClass('disabled');
		this.mostrarTablaSistemas();

		if (window.job.job != '')
				this.$el.find('#importar').attr('disabled', 'disabled');

		var self = this;
		for (var tabla in window.job.registros) { 

				Object.observe(window.job.registros[tabla], function() {

					self.$el.find('#importar').attr('disabled', 'disabled');

				}); 

		}

	}

});

