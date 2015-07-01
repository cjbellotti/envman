EnvMan.Views.ValorCanonicoImportar = Backbone.View.extend({

	className : "modal fade",
	attributes : {
		"aria-hidden" : "true",
		"style" : "z-index: 1100"
	},

	initialize : function (config) {

		this.template = swig.compile( $('#valor-canonico-importar-template').html() );

		this.onImportarFunction = config.onImportar || function (env) { console.log("No Implementado.")};
		this.env = config.env;

		var config = {}
		config.headers = [];
		config.headers.push("ID");
		config.headers.push("ID_ENTIDAD_CANONICA");
		config.headers.push("DESCRIPCION");
		config.headers.push("VALOR_CANONICO");
		config.selectable = true;
		config.processCell = function (field, content) {

			var nombre = content;
			if (field == "ID_ENTIDAD_CANONICA"){

				var entidad = window.collections.entidades.get(content);
				if (entidad)
					nombre = entidad.get('NOMBRE');
				else
					nombre = content;

			} 

			return nombre;

		}

		this.table = MyTable(config);

	},

	events : {

		"change #ambiente" : "cargarTabla",		
		"change #id-entidad" : "cargarTabla",
		"click #importar" : "onImportar"

	},

	onImportar : function (e) {

		this.onImportarFunction(this);

	},

	cargarTabla : function (e) {

			var lista;
			var ambiente = this.$el.find('#ambiente').val();
			var entidad = this.$el.find('#id-entidad').val();

			var self = this;
			var espera = new EnvMan.Views.Espera({

					onshow : function () {
							lista = window.generales.datos.valoresCanonicos(ambiente);
							var arrayData = [];
							for (var index in lista) {
								if ((_.findIndex(job.registros.sistema, lista[index]) < 0 &&
												lista[index].ID_ENTIDAD_CANONICA == entidad) || entidad == '*')
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

		window.generales.cargarComboEntidades(this.$el.find('#id-entidad'), window.job.target, '*');

		if (window.job.target != 'DESA')
			this.$el.find('#ambiente').attr('disabled', 'disabled');

		this.$el.find('.table-valor-canonico-importar').append(this.table);

		this.cargarTabla();

		var self = this;
		this.$el.on('hidden.bs.modal', function () {
			self.$el.remove();
		});

	}

});
