"use strict";

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
			cb(null, client);
		}.bind(this))
	}
}

module.exports = {
	getPool: function(driver, object) {
		return new Pool(driver, object);
	}
}
