EnvMan.Views.ListaJobs = Backbone.View.extend({

	initialize : function () {

		this.template = swig.compile( $('#lista-job-template').html());
		this.listenTo(collections.jobs, 'reset', this.render, this);

		var config = {};
		config.headers = [];
		config.headers.push("Fecha");
		config.headers.push("Job");
		config.headers.push("Proyecto");
		config.headers.push("Descripcion");
		this.table = MyTable(config);
		this.table.setHeight(350);

	},

	events : {

		"click #agregar" : "agregar",
		"click #comparar" : "comparar",
		"click .link-job" : "mostrarJob",
		"change #ordenar" : "ordenar",
		"keyup #filtro" : "filtrar",
		"click #filtrar" : "filtrar"	

	},

	agregar : function (e) {

		generales.crearNuevoJob();
		var view = new EnvMan.Views.Job();
		$('#modals').html(view.el);
		view.render(window.job);
		$('#jobScr').modal({
			backdrop : 'static',
			keyboard : false
		});

	},

	comparar : function (e) {

		var view = new EnvMan.Views.CompararAmbientes();
		$('#modals').html(view.el);
		view.render();
		view.$el.modal({
			backdrop: 'static',
			keyboard: false
		});	

	},

	mostrarJob : function (e) {

		e.preventDefault();

		var nroJob = e.target.getAttribute('job');
		var jobModel = new EnvMan.Models.Job({ job : nroJob });
		var xhr = jobModel.fetch();

		xhr.done(function(data, err) {

			window.job = data;
						
			var view = new EnvMan.Views.Job();
			$('#modals').html(view.el);
			view.render(window.job);
			$('#jobScr').modal({
				backdrop : 'static',
				keyboard : false
			});

		});

	},

	ordenar : function (e) {

		var ordenarPor = this.$el.find('#ordenar').val();
		this.$el.find('#ordenar .ordenar-temporal').remove();

		switch (ordenarPor)
		{
			case 'fecha':

				var tmpJobArray = collections.jobs.toJSON();
				tmpJobArray = _.sortBy(tmpJobArray, function (o) {

					//return o.fecha || Date.now();
					return o.fecha;

				});

				var arrayData = [];
				for (var index in tmpJobArray) {

					arrayData.push(this.cargarJobArray(tmpJobArray[index]));

				}

				this.table.setArrayData(arrayData);

				break;

			case 'proyecto':

				var tmpJobArray = collections.jobs.toJSON();
				tmpJobArray = _.sortBy(tmpJobArray, function (o) {

					return o.proyecto;

				});

				var arrayData = [];
				for (var index in tmpJobArray) {

					arrayData.push(this.cargarJobArray(tmpJobArray[index]));

				}

				this.table.setArrayData(arrayData);

				break;
		}

	},

	filtrar : function () {

		var filtro = this.$el.find('#filtro').val();
		console.log(filtro);
		var ordenarPor = this.$el.find('#ordenar').val();
		this.$el.find('#ordenar .ordenar-temporal').remove();

		switch (ordenarPor)
		{
			case 'fecha':

				var tmpJobArray = collections.jobs.toJSON();
				tmpJobArray = _.sortBy(tmpJobArray, function (o) {

					return o.fecha;

				});

				var arrayData = [];
				for (var index in tmpJobArray) {

					var fecha = new Date(tmpJobArray[index].fecha || Date.now()).getYYYYMMDD();
					if (fecha.indexOf(filtro) >= 0)
						arrayData.push(this.cargarJobArray(tmpJobArray[index]));

				}

				this.table.setArrayData(arrayData);

				break;

			case 'proyecto':

				var tmpJobArray = collections.jobs.toJSON();
				tmpJobArray = _.sortBy(tmpJobArray, function (o) {

					return o.proyecto;

				});

				var arrayData = [];
				for (var index in tmpJobArray) {

					var proyecto = tmpJobArray[index].proyecto;
					if (proyecto.indexOf(filtro) >= 0)
						arrayData.push(this.cargarJobArray(tmpJobArray[index]));

				}

				this.table.setArrayData(arrayData);

				break;
		}

	},

	cargarJobArray : function (data) {

		var arrayData = {};

		arrayData.Fecha = new Date(data.fecha || Date.now()).getYYYYMMDD();
		arrayData.Job = '<a href="#" class="link-job" job="'+ data.job +'">' + data.job + '</a>';
		arrayData.Proyecto = data.proyecto;
		arrayData.Descripcion = data.descripcion;

		return arrayData;

	},

	render : function () {

		var self = this;
		var xhr = collections.jobs.fetch();
		xhr.done(function () {

			var tmpJobArray = collections.jobs.toJSON();

			var arrayData = [];

			for (var index in tmpJobArray) {

				var data = {};
				data.Fecha = new Date(tmpJobArray[index].fecha || Date.now()).getYYYYMMDD();
				data.Job = '<a href="#" class="link-job" job="'+ tmpJobArray[index].job +'">' + tmpJobArray[index].job + '</a>';
				data.Proyecto = tmpJobArray[index].proyecto;
				data.Descripcion = tmpJobArray[index].descripcion;
				arrayData.push(data);
			}

			self.table.setArrayData(arrayData);

			self.$el.html(self.template());
			self.$el.find('.table-container').append(self.table);

		});
		
	}

});
