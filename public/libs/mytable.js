function MyTable(config) {

	var processCell = config.processCell || function (field, data) { return data; };

	var tableData = [];

	var myTableDiv = $('<div class="fixed-table-container" style="width : 100%"/>');

	var headerBackground = $('<div class="header-background"/>');
	myTableDiv.append(headerBackground);

	var innerTableDiv = $('<div class="fixed-table-container-inner"/>');
	myTableDiv.append(innerTableDiv);

	var table = $('<table/>');
	innerTableDiv.append(table);

	var thead = $('<thead/>');

	var row = $('<tr/>');

	if (config.selectable) {

		var th = $('<th/>');
		th.addClass('myTable-header-checkbox');
		th.addClass('first');
		var checkbox = $('<input type="checkbox" class="myTable-checkbox"></input>');

		checkbox.on('click', function () {

			var value = checkbox.prop('checked');

			for (var index in tableData) {

				tableData[index].find('input').prop('checked', value);

			}

		});

		th.css('width', '3%');

		var divInner = $('<div class="th-inner"/>');
		divInner.append(checkbox);

		th.append(divInner);
		row.append(th);

	}

	var headerTemplate = {};

	for (var header in config.headers) {

		var th = $('<th/>');
		var divInner = $('<div class="th-inner"/>');
		divInner.html(config.headers[header]);
		th.append(divInner);
		row.append(th);

		headerTemplate[config.headers[header]] = "";

	}

	var cellWidth = 97 / config.headers.length;
	thead.append(row);

	table.append(thead);

	var tBody = $('<tbody/>');
	table.append(tBody);

	myTableDiv.addRow = function (data) {

		var row = $('<tr/>');

		if (config.processRow)
			config.processRow(row, data);

		if (config.selectable) {

			var td = $('<td/>');
			var checkbox = $('<input type="checkbox" class="myTable-checkbox"></input>');
			checkbox.on('change', function () {

				var value = checkbox.prop('checked');
				if (value) {
					row.css('background', 'green');
				} else {
					row.css('background', 'white');
				}

			})
			td.addClass('myTable-body-checkbox');
			td.append(checkbox);
			td.css('width', '3%')
			row.append(td);

		}


		for (var field in data) {
			if (headerTemplate[field] != undefined)
				headerTemplate[field] = data[field];
		}

		for (var field in headerTemplate) {
			var td = $('<td/>');
			var content = processCell(field, headerTemplate[field], data);
			//td.html(data[field]);
			td.html(content);
			td.css('width', cellWidth + '%');
			//td.addClass('myTable-cell-body');
			row.append(td);
		}

		tBody.append(row);
		tableData.push(row);

	}

	myTableDiv.getRow = function (index) {

		return tableData[index];

	}

	myTableDiv.removeRow = function (index) {

		tableData[index].remove();
		tableData = _.without(tableData, tableData[index]);

	}

	myTableDiv.removeRows = function (rows) {

		var rowsElements = [];

		for (var index in rows) {

			rowsElements.push(tableData[rows[index]]);

		}

		for (var index in rowsElements) {

			tableData = _.without(tableData, rowsElements[index]);
			rowsElements[index].remove();

		}

	}

	myTableDiv.removeSelectedRows = function () {
		var rows = myTableDiv.getSelectedRows();
		if (rows.length > 0)
			myTableDiv.removeRows(rows);
	}

	myTableDiv.getSelectedRows = function () {

		var selecteds = [];

		for (var index in tableData) {
			if(tableData[index].find('input').prop('checked'))
				selecteds.push(parseInt(index));
		}

		return selecteds;

	}

	myTableDiv.setHeight = function (height) {
		myTableDiv.css('height', height + 'px');
	}

	myTableDiv.reset = function () {
		for (var index in tableData) {
			tableData[index].remove();
		}
		tableData = [];
	}

	myTableDiv.setArrayData = function (array, options) {

		options = options || {};

		this.arrayData = array;
		myTableDiv.reset();
		for (var index in this.arrayData) {

			var data = {};
			var item = this.arrayData[index];
			if (options.fields) {

				for (var field in item) {

					if (_.indexOf(options.fields, field) >= 0)
						data[field] = item[field];

				}

			} else {

				data = item;

			}

			myTableDiv.addRow(data);

		}

		var self = this;
		Object.observe(this.arrayData, function (changes) {

			myTableDiv.setArrayData(self.arrayData, options);
			
		});

	}

	myTableDiv.reloadArrayData = function() {


	}

	myTableDiv.getRowArrayData = function (index) {

		var ret = null;
		
		if (this.arrayData) {

			if (index < this.arrayData.length) {
				ret = this.arrayData[index];
			}

		}

		return ret;
	}

	return myTableDiv;
}
