const qiniu =require("qiniu")
const AK = 'PpHTy9TCpoY0MBbYzFJdAI-H2aX5aWMjxp9h7Kx1'
const SK = 'YeBOp0ggDtcjjeoDB8AfoSB7oGwcpSzFEjtxUI3R'
const bucket = 'ceshi'
const mac = new qiniu.auth.digest.Mac(AK, SK)
const options = {
    scope: bucket,
    expires: 7200
  };
const putPolicy = new qiniu.rs.PutPolicy(options);

//token
const uploadToken=putPolicy.uploadToken(mac);

//断点续传
const breakpointRenewal=(uploadToken,localFile,key = null)=>{
    var config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z2;
    
    
    //let localFile = "qiniu.mp3";
    let resumeUploader = new qiniu.resume_up.ResumeUploader(config);
    let putExtra = new qiniu.resume_up.PutExtra();
    // 扩展参数
    // putExtra.params = {
    //   "x:name": "",
    //   "x:age": 27,
    // }
    // putExtra.fname = 'testfile.mp4';
    
    // 如果指定了断点记录文件，那么下次会从指定的该文件尝试读取上次上传的进度，以实现断点续传
    putExtra.resumeRecordFile = 'progress.log';
    //let key = null;
    // 文件分片上传
    resumeUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
      respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
    
      if (respInfo.statusCode == 200) {
        console.log(respBody);
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
      }
    });
}

//文件直传
const directTransmission=(uploadToken,localFile,key = null)=>{
 // var localFile = "/Users/jemy/Documents/qiniu.mp4";
 var config = new qiniu.conf.Config();
 // 空间对应的机房
 config.zone = qiniu.zone.Zone_z2;
  var formUploader = new qiniu.form_up.FormUploader(config);
  var putExtra = new qiniu.form_up.PutExtra();
  //var key='test.mp4';
  // 文件上传
  formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
    respBody, respInfo) {
    if (respErr) {
      //throw respErr;
      console.log(localFile)
      console.log(respErr)
    }

    if (respInfo.statusCode == 200) {
      console.log(respBody);
    } else {
      console.log(respInfo.statusCode);
      console.log(respBody);
    }
  });

}
module.exports={
  uploadToken,
  breakpointRenewal,
  directTransmission
}
//&& cd /usr/share/nginx/shangxian-1/production/current/dist && cp -a static /qiniu/static 
