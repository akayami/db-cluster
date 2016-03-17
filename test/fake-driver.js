"use strict";

module.exports = {
	connect: function(config, cb) {
		var client = {
			release: function(cb) {
				if (cb) {
					cb();
				}
			},
			query: function(sql, options, cb) {
				cb(null, {
					rows: 'Fake-Result',
					header: 'header',
					length: 1,
					insertId: 1
				})
			}
		}
		cb(null, client);
	}
}
