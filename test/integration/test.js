module.exports = function(cluster, config) {

	//var cluster = dbCluster(config);

	describe('DB-Cluster Module', function() {

		it('needs to get connection', function(done) {
			try {
				//				var cluster = dbCluster(config);
				cluster.master(function(err, conn) {
					if (err) {
						done(err);
					} else {
						done();
					}
				});
			} catch (e) {
				done(e);
			}
		});
		it('Needs to run a query', function(done) {
			try {
				//var cluster = dbCluster(config);
				cluster.master(function(err, conn) {
					conn.query('SELECT 1 as count', function(err, result) {
						if (err) {
							conn.release();
							done(err)
						} else {
							conn.release();
							done();
						}
					})
				});
			} catch (e) {
				done(e);
			}
		});
		it('Needs to return a valid select result', function(done) {
			try {
				//var cluster = dbCluster(config);
				cluster.master(function(err, conn) {
					conn.query('SELECT 1 as count', function(err, result) {
						if (err) {
							conn.release();
							done(err)
						} else {
							conn.release();
							if (result.count() != 1) {
								done(new Error('Wrong result count'))
							} else {
								done();
							}
						}
					})
				});
			} catch (e) {
				done(e);
			}
		});

		it('Needs to return a valid insert result', function(done) {
			try {
				//var cluster = dbCluster(config);
				cluster.master(function(err, conn) {
					conn.insert('test', {name: 'test'}, function(err, result) {
						if (err) {
							conn.release();
							done(err)
						} else {
							conn.release();
							if (result.count() != 1) {
								done(new Error('Wrong result count'))
							} else {
								if (result.insertId() != 1) {
									done(new Error('Wrong result count'))
								} else {
									done();
								}
							}
						}
					})
				});
			} catch (e) {
				done(e);
			}
		});

		it('Needs to return a valid update result', function(done) {
			try {
				//var cluster = dbCluster(config);
				cluster.master(function(err, conn) {
					conn.query(`INSERT INTO ?? (name) VALUES (?)`, ['test', 'test'], function(err, result) {
						if (err) {
							return done(err);
						}
						conn.query(`UPDATE ?? SET name=?`, ['test', 'test1'], function(err, result) {
							if (err) {
								conn.release();
								done(err)
							} else {
								conn.release();
								if (result.count() != 1) {
									done(new Error('Wrong result count'))
								} else {
									done();
								}
							}
						})
					})
				});
			} catch (e) {
				done(e);
			}
		});
	})
}
