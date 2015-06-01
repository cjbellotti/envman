EnvMan.Views.CompararAmbientes = Backbone.View.extend({
		
	className : "modal fade",
	attributes : {
		"aria-hidden" : "true",
		"style" : "z-index: 1063"
	},

	initialize : function (){

		window.generales.crearTablas(this.ambiente1);
		window.generales.crearTablas(this.ambiente2);
		this.template = swig.compile ( $('#comparacion-ambientes-template').html() );
		this.ambiente1View = new EnvMan.Views.TablasAmbiente(this.ambiente1); 
		this.ambiente2View = new EnvMan.Views.TablasAmbiente(this.ambiente2); 

	},

	render : function () {

		this.$el.html(this.template());
		this.$el.find('#ambiente1').html(this.ambiente1View.el);
		this.$el.find('#ambiente2').html(this.ambiente2View.el);
	
		this.ambiente1View.render();
		this.ambiente2View.render();

		var self = this;
		this.$el.on('hidden.bs.modal', function () {
			self.$el.remove();
		});
			
	}
});
