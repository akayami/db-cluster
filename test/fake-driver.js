"use strict";

module.exports = {
	connect: function(config, cb) {
		var client = {
			release: function(cb) {
				if(cb) {
					cb();
				}
			},
			query: function(sql, options, cb) {
				cb(null, 'Fake-Result')
			}
		}
		cb(null, client);
	}
}
