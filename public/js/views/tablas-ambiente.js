EnvMan.Views.TablasAmbiente = Backbone.View.extend({

	initialize : function (tablasAmbiente) {

		this.template = swig.compile( $('#tablas-ambiente-template').html() );
		this.tablasAmbiente = tablasAmbiente;

	},

	events : {

		"click #tabSistemas" : "mostrarTablaSistemas",
		"click #tabEntidades" : "mostrarTablaEntidades",
		"click #tabValoresCanonicos" : "mostrarTablaValorCanonico",
		"click #tabValoresSistema" : "mostrarTablaValorSistema"

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
		configTable.arrayData = this.tablasAmbiente.sistema;
		configTable.title = "Sistema";
		configTable.table = "sistema";
		configTable.model = EnvMan.Models.Sistema;
		configTable.view = EnvMan.Views.Sistema;
		configTable.viewImport = EnvMan.Views.SistemaImportar;

		var sistemasTable = crearTabla(configTable);

		sistemasTable.render();
		this.$el.find('.tab-content').html('');
		sistemasTable.$el.find('.botones').remove();
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
		configTable.arrayData = this.tablasAmbiente.entidadcanonica;
		configTable.title = "Entidad Canonica";
		configTable.table = "entidadcanonica";
		configTable.model = EnvMan.Models.Entidad;
		configTable.view = EnvMan.Views.Entidad;
		configTable.viewImport = EnvMan.Views.EntidadImportar;

		var entidadesTable = crearTabla(configTable);

		entidadesTable.render();
		this.$el.find('.tab-content').html('');
		entidadesTable.$el.find('.botones').remove();
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
		configTable.headers.push("ID_VALOR_CANONICO");
		configTable.headers.push("ID_ENTIDAD_CANONICA");
		configTable.headers.push("VALOR_SISTEMA");
		configTable.arrayData = this.tablasAmbiente.valorsistema;
		configTable.title = "Valor Sistema";
		configTable.table = "valorsistema";
		configTable.model = EnvMan.Models.ValorSistema;
		configTable.view = EnvMan.Views.ValorSistema;
		configTable.viewImport = EnvMan.Views.ValorSistemaImportar;
		configTable.processCell = function (field, content) {

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
					nombre = sistema.get('NOMBRE') + ' - ' + sistema.get('PAIS');

			} else if (field == "ID_VALOR_CANONICO") {

				var valorCanonico = window.collections.valoresCanonicos.get(content);
				if (!valorCanonico)
					nombre = "Valor Canonico " + content + " inexistente.";
				else
					nombre = valorCanonico.get('VALOR_CANONICO');

			}

			return nombre;

		}

		var valorSistemaTable = new crearTabla(configTable);

		valorSistemaTable.render();
		this.$el.find('.tab-content').html('');
		valorSistemaTable.$el.find('.botones').remove();
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
		configTable.arrayData = this.tablasAmbiente.valorcanonico;
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
		valorCanonicoTable.$el.find('.botones').remove();
		this.$el.find('.tab-content').append(valorCanonicoTable.el);

	},

	render : function () {

		this.$el.html(this.template());

		this.mostrarTablaSistemas(); 

	}

});
