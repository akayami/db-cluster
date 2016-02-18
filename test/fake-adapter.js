"use strict";

class Connection {

	constructor(raw) {
		this.connection = raw;
	}

	query(sql, options, cb) {
		if(!cb) {
			cb = options;
			options = {};
		}
		this.connection.query(sql, options, cb)
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
};

module.exports = {
	getPool: function(driver, object) {
		return new Pool(driver, object);
	}
}
