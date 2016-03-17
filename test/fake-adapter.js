"use strict";

var engine = 'fake';

class Result {

	constructor(raw) {
		this.raw = raw;
		this.header = this.raw.header;
		this.insertId = (this.raw && this.raw.insertId ? this.raw.insertId : null);
		this.length = (this.raw && this.raw.length ? this.raw.length : null);
	}

	count() {
		return (this.raw.affectedRows ? this.raw.affectedRows : this.raw.length);
	}

	rows() {
		return this.raw.rows;
	}

	fields() {
		return this.header;
	}
}

class Connection {

	constructor(raw) {
		this.connection = raw;
		this.engine = engine;
	}

	init(cb) {
		cb();
	}

	insert(table, data, options, cb) {
		if(!cb) {
			cb = options;
			options = {};
		}
		var fields = Object.keys(data);
		var values = [];
		var dataArray = [table];
		for (var f = 0; f < fields.length; f++) {
			dataArray.push(fields[f]);
		}
		var fieldPh = [];
		var valuePh = [];
		fields.forEach(function(field) {
			fieldPh.push('??');
			valuePh.push('?')
			dataArray.push(data[field]);
		});
		// Big assumption - Assumes single autoincrement field named id
		//console.log(this.pkmap);
		if(this.map && this.map[table]) {
			dataArray.push(this.map[table]);
			this.query('INSERT INTO ?? (' + fieldPh.join(', ') + ') values (' + valuePh.join(', ') + ') RETURNING ??', dataArray, {pkColumnName: this.map[table]}, cb);
		} else {
			this.query('INSERT INTO ?? (' + fieldPh.join(', ') + ') values (' + valuePh.join(', ') + ')', dataArray, cb);
		}
	};

	update(table, data, condition, cond_params, cb) {
		var fields = Object.keys(data);
		var values = [];
		var dataArray = [table];
		var fieldPh = [];
		fields.forEach(function(field, f) {
			fieldPh.push('??=?');
			dataArray.push(fields[f]);
			dataArray.push(data[field]);
		});
		cond_params.forEach(function(param) {
			dataArray.push(param);
		})
		this.query('UPDATE ?? SET ' + fieldPh.join(', ') + ' WHERE ' + condition, dataArray, cb);
	};	

	query(sql, options, cb) {
		if(!cb) {
			cb = options;
			options = {};
		}
		if(typeof(sql) != 'string') {
			throw new Error('SQL parameter must be a string');
		}
		this.connection.query(sql, options, function(err, result) {
			if(err) {
				err.sql = this.sql;
			}
			cb(err, new Result(result))
		})
	}

	release(cb) {
		this.connection.release(cb);
	}
};

class Pool {

	constructor(driver, config) {
		this.driver = driver;
		this.config = config;
	}

	getConnection(cb) {
		this.driver.connect(this.config, function(err, client, done) {
			if(err) {
				cb(err);
			}
			var client = new Connection(client);
			cb(null, client);
		}.bind(this))
	}

	end(cb) {
		cb();
	}
};

module.exports = {
	getPool: function(driver, object) {
		return new Pool(driver, object);
	}
}
