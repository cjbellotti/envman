EnvMan.Views.Espera = Backbone.View.extend({

	className : "modal fade",
	attributes : {
		"data-backdrop" : "static",
		"data-keyboard" : "false",
		"style" : "z-index: 1163"
	},

	initialize : function (config) {

		if (config){
			if (config.onclose)
				this.onclose = config.onclose;

			if (config.onshow)
				this.onshow = config.onshow;

		}

		this.template = swig.compile( $('#espera-template').html());

	},


	render : function () {

		this.$el.html(this.template());

		var self = this;
		this.$el.on('hidden.bs.modal', function () {
			self.$el.remove();
			if (self.onclose)
					self.onclose();
		});

		this.$el.on('shown.bs.modal', function () {
			if (self.onshow)
				self.onshow();
		});

	},

	show : function () {

		this.$el.modal({

			backdrop : 'static',
			keyboard : false

		});
	},

	hide : function () {

		this.$el.modal('toggle');

	}


});
