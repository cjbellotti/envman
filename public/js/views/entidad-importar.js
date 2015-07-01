EnvMan.Views.EntidadImportar = Backbone.View.extend({

	className : "modal fade",
	attributes : {
		"aria-hidden" : "true",
		"style" : "z-index: 1100"
	},

	initialize : function (config) {

		this.template = swig.compile( $('#entidad-importar-template').html() );

		this.onImportarFunction = config.onImportar || function (env) { console.log("No Implementado.")};
		this.env = config.env;

		var config = {}
		config.headers = [];
		config.headers.push("ID");
		config.headers.push("NOMBRE");
		config.headers.push("DESCRIPCION");
		config.selectable = true;
		this.table = MyTable(config);

	},

	events : {

		"change #ambiente" : "cargarTabla",	
		"click #importar" : "onImportar"

	},

	onImportar : function (e) {

		this.onImportarFunction(this);

	},

	cargarTabla : function (e) {

			var ambiente = this.$el.find('#ambiente').val();

			var espera = new EnvMan.Views.Espera();
			$('#modals').append(espera.el);
			espera.render();
			espera.show();
			var lista = window.generales.datos.entidades(ambiente);
			espera.hide();

			var arrayData = [];
			for (var index in lista) {
				if (_.findIndex(job.registros.sistema, lista[index]) < 0)
					arrayData.push(lista[index]);
			}

			this.table.setArrayData(arrayData);
			
	},

	render : function () {

		this.$el.html(this.template());

		window.generales.cargarComboAmbientes(this.$el.find('#ambiente'));

		this.$el.find('#ambiente').val(window.job.target);

		if (window.job.target != 'DESA')
			this.$el.find('#ambiente').attr('disabled', 'disabled');

		this.cargarTabla();	

		this.$el.find('.table-entidad-importar').append(this.table);

		var self = this;
		this.$el.on('hidden.bs.modal', function () {
			self.$el.remove();
		});

	}

});
