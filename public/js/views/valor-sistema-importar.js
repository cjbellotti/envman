EnvMan.Views.ValorSistemaImportar = Backbone.View.extend({

	className : "modal fade",
	attributes : {
		"aria-hidden" : "true",
		"style" : "z-index: 1100"
	},

	initialize : function (config) {

		this.template = swig.compile( $('#valor-sistema-importar-template').html() );

		this.onImportarFunction = config.onImportar || function (env) { console.log("No Implementado.")};
		this.env = config.env;

		var config = {}
		config.headers = [];
		config.headers.push("ID");
		config.headers.push("ID_SISTEMA");
		config.headers.push("ID_ENTIDAD_CANONICA");
		config.headers.push("ID_VALOR_CANONICO");
		config.headers.push("VALOR_SISTEMA")
		config.selectable = true;
		config.processCell = function (field, content) {

			var nombre = content;
			if (field == "ID_ENTIDAD_CANONICA"){

				if (parseInt(content)) {

					var entidad = window.collections.entidades.get(content);
				  	if (entidad)
						nombre = entidad.get('NOMBRE');
				  	else
						nombre = content;

				}


			} else if (field == "ID_SISTEMA") {

				if (parseInt(content)) {

					var valorCanonico = window.collections.sistemas.get(content);
				  	if (valorCanonico)
						nombre = valorCanonico.get('NOMBRE');
				  	else
						nombre = content;

				}

			} else if (field == "ID_VALOR_CANONICO") {

				if (parseInt(content)) {	

					var valorCanonico = window.collections.valoresCanonicos.get(content);
				  	if (valorCanonico)
						nombre = valorCanonico.get('VALOR_CANONICO');
				  	else
						nombre = content;

				}

			} 

			return nombre;

		}

		this.table = MyTable(config);

	},

	events : {

		"change #ambiente" : "cargarTabla",			
		"change #id-entidad" : "cargarTabla",
		"change #id-sistema" : "cargarTabla",
		"click #importar" : "onImportar"

	},

	onImportar : function (e) {

		this.onImportarFunction(this);

	},

	cargarTabla : function (e) {

			var ambiente = this.$el.find('#ambiente').val();
			var sistema = this.$el.find('#id-sistema').val();
			var entidad = this.$el.find('#id-entidad').val();


			var self = this;
			var espera = new EnvMan.Views.Espera({

					onshow : function () {
							var lista = window.generales.datos.valoresSistema(ambiente);

							var arrayData = [];
							for (var index in lista) {
								if (_.findIndex(job.registros.sistema, lista[index]) < 0 &&
												(lista[index].ID_SISTEMA == sistema || sistema == '*') &&
												(lista[index].ID_ENTIDAD_CANONICA == entidad || entidad == '*'))
									arrayData.push(lista[index]);
							}

							self.table.setArrayData(arrayData);
							espera.hide();

					},

					onclose : function () {
					}
			});
			$('#models').append(espera.el);
			espera.render();
			espera.show();
			
	},

	render : function () {

		// Solo cargo en la tabla los sistemas que NO se encuentren en el Job.

		this.$el.html(this.template());

		window.generales.cargarComboAmbientes(this.$el.find('#ambiente'));

		this.$el.find('#ambiente').val(window.job.target);

		window.generales.cargarComboSistemas(this.$el.find('#id-sistema'), window.job.target, '*');
		window.generales.cargarComboEntidades(this.$el.find('#id-entidad'), window.job.target, '*');

		if (window.job.target != 'DESA')
				this.$el.find('#ambiente').attr('disabled', 'disabled');

		this.$el.find('.table-valor-sistema-importar').append(this.table);

		this.cargarTabla();

		var self = this;
		this.$el.on('hidden.bs.modal', function () {
			self.$el.remove();
		});

	}

});
