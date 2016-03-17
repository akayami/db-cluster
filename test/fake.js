var dbCluster = require('../index.js');
var config = {
	adapter: require('./fake-adapter'),
	driver: require('./fake-driver'),
	global: {
		host: 'localhost',
		user: 'root',
		password: '',
		database: "test"
	},
	pools: {
		master: {
			config: {
				user: 'root'
			},
			nodes: [{
				host: 'localhost'
			}]
		},
		slave: {
			config: {
				user: 'root',
				health: function(poolObject) {
					poolObject.health = {};
					poolObject.health.initialize = setInterval(function() {
						var pool = this.pool;
						pool.getConnection(function(err, conn) {
							conn.query('select (FLOOR(1 + RAND() * 100)) as number', function(err, res) {
								conn.release();
								if (res[0].number % 2 == 0) {
									poolObject.paused = true;
								} else {
									poolObject.paused = false;
								}
							});
						})
					}.bind({
						pool: poolObject.pool
					}), 500);

					poolObject.health.shutdown = function(cb) {
						clearInterval(this.scope);
						cb();
					}.bind({
						scope: poolObject.health.shutdown
					})
				}
			},
			nodes: [{
				host: 'localhost'
			}, {
				host: 'localhost'
			}]
		}
	}
}

var cluster = dbCluster(config);

describe('Fake DB', function() {
	require('./integration/test')(cluster, config);
})
