EnvMan.Views.TablasAmbiente = Backbone.View.extend({

	initialize : function (tablasAmbiente) {

		this.template = swig.compile( $('#tablas-ambiente-template').html() );
		this.tablasAmbiente = tablasAmbiente;

	},

	events : {

		"click #tabSistemas" : "mostrarTablaSistemas",
		"click #tabEntidades" : "mostrarTablaEntidades",
		"click #tabValoresCanonicos" : "mostrarTablaValorCanonico",
		"click #tabValoresSistema" : "mostrarTablaValorSistema",
		"change #ambiente" : "cargarAmbiente"

	},

	procesarFila : function (row, data) {

		if (data.IDN) {
			row.css('background', 'green');	
		} else if (data.MOD) {
			row.css('background', 'blue');	
		} else {
			row.css('background', 'white');
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
		configTable.processRow = this.procesarFila;
		sistemasTable = MyTable(configTable);
		sistemasTable.setHeight(250);
		sistemasTable.setArrayData(this.tablasAmbiente.sistema);
		this.$el.find('.tab-content').html('');
		this.$el.find('.tab-content').append(sistemasTable);

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
		configTable.processRow = this.procesarFila;
		var entidadesTable = MyTable(configTable);
		entidadesTable.setHeight(250);
		entidadesTable.setArrayData(this.tablasAmbiente.entidadcanonica);
		this.$el.find('.tab-content').html('');
		this.$el.find('.tab-content').append(entidadesTable);

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
		configTable.processRow = this.procesarFila;
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

		var valorSistemaTable = MyTable(configTable);
		valorSistemaTable.setHeight(250);
		valorSistemaTable.setArrayData(this.tablasAmbiente.valorsistema);

		this.$el.find('.tab-content').html('');
		this.$el.find('.tab-content').append(valorSistemaTable);

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
		configTable.processRow = this.procesarFila;
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

		var valorCanonicoTable = MyTable(configTable);
		valorCanonicoTable.setHeight(250);
		valorCanonicoTable.setArrayData(this.tablasAmbiente.valorcanonico);

		this.$el.find('.tab-content').html('');
		this.$el.find('.tab-content').append(valorCanonicoTable);

	},

	cargarAmbiente : function (e) {

		console.log('cargarAmbiente');
		var ambiente = this.$el.find('#ambiente').val();
		this.tablasAmbiente.sistema = window.generales.datos.sistemas(ambiente);
		this.tablasAmbiente.entidadcanonica = window.generales.datos.entidades(ambiente);
		this.tablasAmbiente.valorcanonico = window.generales.datos.valoresCanonicos(ambiente);
		this.tablasAmbiente.valorsistema = window.generales.datos.valoresSistema(ambiente); 

	},	

	render : function () {

		this.$el.html(this.template());

		window.generales.cargarComboAmbientes(this.$el.find('#ambiente'));

		this.cargarAmbiente();

		this.mostrarTablaSistemas(); 

	}

});
