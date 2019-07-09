let userInfo = new UserInfo({
					id:     user._id,
					exp:    0,
					gold:   0,
					xu:     10000,
					ketSat: 0,
					lastDate: new Date(),
					regDate:  new Date(),
				});
				userInfo.save((err)=>{
					if (err) callback(err);
				});