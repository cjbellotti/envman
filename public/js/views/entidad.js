EnvMan.Views.Entidad = Backbone.View.extend({

	className : "modal fade",
	attributes : {
		"aria-hidden" : "true",
		"style" : "z-index: 1063"
	},

	initialize : function () {

		this.template = swig.compile( $('#entidad-screen-template').html());

	},

	events : {

		"click #aceptar" : "guardar"

	},

	guardar: function () {

		var nuevo = false;
		var id = this.model.get('ID');
		if (!id) {

			var id = 1;
			var ultima = window.collections.entidades.last();
			if (ultima) {
				id = ultima.get("ID") + 1;
			}

			this.model.set('ID', id);
			nuevo = true;
		}

		var nombre = this.$el.find('#nombre').val();
		var descripcion = this.$el.find('#descripcion').val();

		this.model.set('NOMBRE', nombre);
		this.model.set('DESCRIPCION', descripcion);

		window.collections.entidades.add(this.model);

		if (nuevo) {

			var index = _.findIndex(window.job.registros.entidadcanonica, { NOMBRE : nombre });
			if (index < 0) {	
					window.collections.entidades.add(this.model);
					generales.agregarRegistroAlJob("entidadcanonica", this.model.toJSON());
			}

		} else {
			window.collections.entidades.set(this.model, { remove : false });
			generales.modificarRegistroEnJob("entidadcanonica", this.model.toJSON());
		}

	},

	render : function () {

		var data = {};
		if (this.model) {

			data = this.model.toJSON();

		}

		this.$el.html(this.template(data));

		var self = this;
		this.$el.on('hidden.bs.modal', function () {
			self.$el.remove();
		});

	}

});
