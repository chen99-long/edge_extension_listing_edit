const fs = require('fs');
const path = require('path');

function mkdir(pathname, callback) {
	pathname = path.isAbsolute(pathname) ? pathname : path.join(__dirname, pathname);
	pathname = path.relative(__dirname, pathname);

	const floders = pathname.split(path.sep);

	let pre = ''; // 最终用来拼合的路径
	floders.forEach((floder) => {
		try {
			// 没有异常，文件已经创建，提示用户该文件已经创建
			const _stat = fs.statSync(path.join(__dirname, pre, floder));
			const hasMkdir = _stat && _stat.isDirectory();
			if (hasMkdir) {
				callback; // && callback(`文件${floder}已经存在，不能重复创建，请重新创建！`)
			}
		} catch (err) {
			// 抛出异常，文件不存在则创建文件
			try {
				// 避免父文件还没有创建的时候，先创建子文件所出现的意外 bug，这里选择同步创建文件
				fs.mkdirSync(path.join(__dirname, pre, floder));
				callback && callback(null);
			} catch (error) {
				callback && callback(error);
			}
		}
		pre = path.join(pre, floder); // 路径拼合
	});


  //生成文件
    // 写入文件
    let message = `{
    "extName": {"message": "TikFast - Free Video Downloader" },
    "extDes":{"message":"Video Downloader is a powerful tool capable of batch downloading videos without watermarks from some popular video platforms."}
}`;
  //文件名
  fs.writeFile(`${pathname}/messages.json`,message,'utf8',function(error){
      if(error){
          console.log(error);
      }
      console.log('写⼊成功');
  })
}

//调用
//*********文件夹名字***************
const fileUrl = [
  'am', 'ar', 'bg', 'bn', 'ca', 'cs', 'da', 'de', 'el', 'en', 'en_GB', 'en_US', 
  'es', 'es_419', 'et', 'fi','fa', 'fil', 'fr', 'gu', 'he', 'hi', 'hr', 'hu', 'id', 
  'it', 'ja', 'kn', 'ko', 'lt','lv', 'ml', 'mr', 'nl', 'or', 'pl', 'pt', 'pt_BR', 
  'pt_PT', 'ro', 'ru', 'sk', 'sl', 'sr', 'sv', 'sw', 'ta', 'te', 'th', 'tr', 
  'uk', 'vi', 'zh_CN', 'zh_TW'
];

fileUrl.forEach((item) => {
  // 动态创建文件夹
  //路径
  mkdir('./public/_locales/' + item, (err) => {
    console.log(err);
  });
})

