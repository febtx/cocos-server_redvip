const sendInfo = ()=>{
	UserInfo.findOne({ id: socket.UID }, 'name exp phone gold xu ketSat lastDate regDate', function (err, info) {
		if (err) return;
		socket.emit('data', {
			user: info
		});
	});
}

export { sendInfo };