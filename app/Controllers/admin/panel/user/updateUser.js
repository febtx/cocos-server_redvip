
const Users    = require('../../../../Models/Users');
const UserInfo = require('../../../../Models/UserInfo');

const get_info = require('./get_info');

module.exports = function(client, data){
	if (!!data && !!data.id) {
		var id = data.id;
		var pass = null;
		var error = null;
		var update = data.data.users;
		if (void 0 !== data.data.pass) {
			pass = data.data.pass;
			if (pass.length > 32 || pass.length < 6) {
				error = 'Mật khẩu từ 6 - 32 kí tự...';
			}
		}
		if (!!error) {
			client.red({notice:{title:'ĐỔI MẬT KHẨU', text:error}});
			return void 0;
		}else{
			UserInfo.findOne({'id': id}, function(err, check) {
				if (check) {
					!!pass && Users.findOneAndUpdate({'_id': id}, {$set:{'local.password':Helper.generateHash(pass)}}, function(err, cart){});
					UserInfo.findOneAndUpdate({'id': id}, {$set:update}, function(err, cart){
						get_info(client, id);
						client.red({notice:{title:'NGƯỜI DÙNG', text:'Thay đổi Thành Công...'}});
					});
				}else{
					client.red({notice:{title:'NGƯỜI DÙNG', text:'Người dùng không tồn tại...'}});
				}
			})
		}
	}
}
