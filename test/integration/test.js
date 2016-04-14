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
							//console.log(result.rows);
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
					conn.insert('test', {
						name: 'test'
					}, function(err, result) {
						if (err) {
							conn.release();
							done(err)
						} else {
							conn.release();
							if (result.count() != 1) {
								done(new Error('Wrong result count'))
							} else {
								if (result.insertId != 1) {
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

		it('Needs to support nested table select', function(done) {
			cluster.master(function(err, conn) {
				conn.query(`INSERT INTO ?? (name) VALUES (?)`, ['test', 'value'], function(err, result) {
					if (err) {
						return done(err);
					}
					conn.query(`INSERT INTO ?? (name) VALUES (?)`, ['test', 'value'], function(err, result) {
						if (err) {
							return done(err);
						}
						conn.query('select * from ?? t1 inner join test t2 on t2.name=t1.name', ['test'], function(err, result) {
							if(result.count() == 4 || conn.engine == 'fake') { // Issue with fake engine always returning same count
								done();
							} else {
								done(new Error('Wrong Count'));
							}
						})
					})
				})
			})
		});

		it('On INSERT needs to skip a field if set to undefined', function(done) {
			cluster.master(function(err, conn) {
				conn.insert('test', {name: 'name', someval: null}, function(err, result) {
					if (err) {
						return done(err);
					}
					conn.query('select * from ??', ['test'], function(err, result) {
						if(err) {
							return done(err);
						}
						if(result.rows()[0].someval == null) {
							done();
						} else {
							return done(new Error('Wrong value returned:' + result.rows()[0].name))
						}
					})
				})
			})
		});

		it('On UPDATE needs to set field to null if undefined', function(done) {
			cluster.master(function(err, conn) {
				conn.insert('test', {name: 'name', someval: 'test'}, function(err, result) {
					if (err) {
						return done(err);
					}
					conn.update('test', {someval: null}, 'id=?', [result.insertId], function(err, result) {
						if(err) {
							return done(err);
						}
						conn.query('select * from ??', ['test'], function(err, result) {
							if(err) {
								return done(err);
							}
							if(result.rows()[0].someval == null) {
								done();
							} else {
								return done(new Error('Wrong value returned:' + result.rows()[0].name))
							}
						})
					})
				})
			})
		});
	})
}
