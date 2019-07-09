const User = require('../Models/Users');
const UserInfo = require('../Models/UserInfo');

const Image = require('jimp');
const fs    = require('fs');

const upload = (client, data)=>{
	let guess = data.match(/^data:image\/(png|jpeg);base64,/)[1];
	let ext = "";
	switch(guess) {
		case "png"  : ext = ".png"; break;
		case "jpeg" : ext = ".jpg"; break;
		default     : ext = ".bin"; break;
	}
	if (guess == 'png' || guess == 'jpeg') {
		UserInfo.findOne({id: client.UID}, 'avatar', async (err, d)=>{
			if (d !== null) {
				if (d.avatar.length !== 0) {
					fs.stat(__dirname+'/../../public/images/users/avatars/' + d.avatar, function (err, stats) {
					   	if (err) return;

					   	fs.unlink(__dirname+'/../../public/images/users/avatars/' + d.avatar,function(err){
					        if(err) return;
					   	});  
					});
				}
			}
		});
		let filename = new Date().getTime()+randomString(10)+ext;
		let savedFilename = "/images/users/avatars/"+filename;
		fs.writeFile(__dirname+"/../../public"+savedFilename, getBase64Image(data), 'base64', function(err) {
			if (err) {
				console.log(err);
				return;
			}else{

				Image.read(__dirname+"/../../public"+savedFilename, (err, img) => {
					if (err) throw err;
					let w = img.bitmap.width;
					let h = img.bitmap.height;

					let x;
					let y;

					let T = w;
					if (w > h) {
						T = h;
						x = (w-T)/2;
						y = 0;
					}else{
						x = 0;
						y = (h-T)/2;
					}

					img.crop(x, y, T, T)
						.resize(240, 240)
						.write(__dirname+"/../../public"+savedFilename);

			  		UserInfo.findOne({id: client.UID}, 'avatar', async (err, d)=>{
						if (d !== null) {
							d.avatar = filename;
						  	d.save(function (err, updatedTank) {
						    	if (err) return handleError(err);
						    	client.emit("data", {user:{
						    		avatar:filename
						    	}});
						  	});
						}
					});
				});
				console.log("Send photo success!");
			}
		});
	}
};


function randomString(length)
{
	let text = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
	for( let i=0; i < length; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length)); 
	return text;
}
function getBase64Image(imgData) {
	return imgData.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
}



module.exports.upload = upload;