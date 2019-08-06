
module.exports = function(io){
	// Phát sóng tới tất cả người dùng và khách
	io.broadcast = function(data, noBroadcast = null){
		this.clients.forEach(function(client){
			if (void 0 === client.admin && noBroadcast != client) {
				client.red(data);
			}
		});
	};
	// Phát sóng tới tất cả  khách
	io.sendAllClient = function(data){
		this.clients.forEach(function(client){
			if (void 0 === client.admin && !client.auth) {
				client.red(data);
			}
		});
	};
	// Phát sóng tới tất cả người dùng
	io.sendAllUser = function(data, noBroadcast = null){
		Promise.all(Object.values(this.users).map(function(users){
			Promise.all(users.map(function(client){
				if (noBroadcast != client) {
					client.red(data);
				}
			}));
		}));
	};
};
