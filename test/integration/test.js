module.exports = function(dbCluster, config) {
	
	var cluster = dbCluster(config);

	describe('DB-Cluster Module', function() {
		it('needs to create cluster', function(done) {
			try {
				var cluster = dbCluster(config);
				done();
			} catch(e) {
				done(e);
			}
		});
		it('needs to get connection', function(done) {
			try {
				var cluster = dbCluster(config);
				cluster.master(function(err, conn) {
					if(err) {
						done(err);
					} else {
						done();
					}
				});
			} catch(e) {
				done(e);
			}
		});
		it('Needs to run a query', function(done) {
			try {
				var cluster = dbCluster(config);
				cluster.master(function(err, conn) {
					conn.query('SELECT 1 as count', function(err, result) {
						if(err) {
							conn.release();
							done(err)
						} else {
							conn.release();
							done();
						}
					})
				});
			} catch(e) {
				done(e);
			}
		});
	})
}
