module.exports = {
	connect: function(config, cb) {
		var client = {
			release: function() {

			},
			query: function(sql, cb) {
				cb(null, 'Fake-Result')
			}
		}
		cb(null, client);
	}
}
