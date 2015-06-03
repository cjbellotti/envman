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

		this.ambiente1View.$el.find('#ambiente').on('change', this, this.comparar);
		this.ambiente2View.$el.find('#ambiente').on('change', this, this.comparar);

		var self = this;
		this.$el.on('hidden.bs.modal', function () {
			self.$el.remove();
		});
			
	},

	comparar : function (e) {

		var self = e.data;

		var ambiente1 = self.ambiente1View.$el.find('#ambiente').val();
		var ambiente2 = self.ambiente2View.$el.find('#ambiente').val();

		var ambiente1Data = {};
		ambiente1Data.target = ambiente2;
		ambiente1Data.registros = _.clone(self.ambiente1View.tablasAmbiente);
	
		var ambiente2Data = {};
		ambiente2Data.target = ambiente1;
		ambiente2Data.registros = _.clone(self.ambiente2View.tablasAmbiente);

		$.ajax({	

			method : 'POST',
			url : '/verificar',
			contentType : 'application/json',
			data : JSON.stringify(ambiente1Data),
			success : function (data) {

				for (var ambiente in data) {

					for (var index in data[ambiente]){

						
						var query = {};

					
									
						self.ambiente1View.tablasAmbiente = data[ambiente2];
					}

				}

				$.ajax({

					method : 'POST',
					url : '/verificar',
					contentType : 'application/json',
					data : JSON.stringify(ambiente2Data),
					success : function (data) {
						
						self.ambiente2View.tablasAmbiente = data[ambiente1];

					}

				});

			}

		});

	}

});
