EnvMan.Views.VerificarJob = Backbone.View.extend({

	className : "modal fade",
	attributes : {
		"aria-hidden" : "true",
		"style" : "z-index: 1200"
	},

	initialize : function (config) {

		this.template = swig.compile( $('#verificar-job-template').html() );

		var config = {}
		config.headers = [];
		config.headers.push("DC");
		config.headers.push("Tipo");
		config.headers.push("Descripcion");
		config.headers.push("Accion");
		this.table = MyTable(config);

	},

	events : {

		"click #exportar" : "exportar"

	},

	exportar : function (e) {

		e.preventDefault();
		$.ajax({
			url : '/generar-script',
			method : 'POST',
			contentType : 'application/json',
			data : JSON.stringify({
					target : window.job.target,
					registros : this.datos
			}),
			success : function (data) {
				console.log(data);

				var view = new EnvMan.Views.VerScript(data);
				$('#modals').append(view.el);
				view.render();
				//view.$el.find('#despliegue').html(data.despliegue);
				//view.$el.find('#rollback').html(data.rollback);
				view.$el.modal({
					backdrop : 'static',
					keyboard : false
				});
			}

		});

	},

	render : function () {

		// Solo cargo en la tabla los sistemas que NO se encuentren en el Job.


	/*	espera.$el.modal({

			backdrop : 'static',
			keyboard : false

		});*/

		var self = this;

		var espera = new EnvMan.Views.Espera({

				onclose : function () {

					self.$el.html(self.template());
					self.$el.find('.table-content').append(self.table);

					self.$el.on('hidden.bs.modal', function () {
						self.$el.remove();
					});

				}
		});
		espera.render();
		$('#modals').append(espera.el);
		espera.show();

		window.generales.limpiarRegistros(window.job.registros);
		$.ajax({
			method : 'POST',
			url : '/verificar', 
			contentType : 'application/json',
			data : JSON.stringify(window.job),
			success: function (data) {

			self.datos = data;

					var arrayData = [];
					for (var dc in data) {
							for (var tabla in data[dc]) {

								for (var index in data[dc][tabla]) {

									var registro = {};
									registro.DC = dc;
									registro.Tipo = tabla;
									registro.Accion = (data[dc][tabla][index].MOD) ? "Update" : "Insert";
									registro.Descripcion = "";

									for (var field in data[dc][tabla][index]) {
										if (field != "MOD" && field != "IDN" && field != 'origenReg') {
											registro.Descripcion += field + " : " + data[dc][tabla][index][field] + " - ";
										}
									}
									arrayData.push(registro);

								}

							}

					}

					self.table.setArrayData(arrayData);

					//espera.$el.modal('hide');
					//
					espera.hide();
					
			}
		});


	}

});
