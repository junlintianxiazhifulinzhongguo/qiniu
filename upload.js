const glob=require('glob')
const { uploadToken,directTransmission }=require('./qiniu')
glob.sync("static/**/**.{css,js,png,ttf,gif}").forEach(function(file){
    console.log(file)
    directTransmission(uploadToken,file,file)      
})
