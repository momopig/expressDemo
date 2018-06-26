var express = require('express');
var Sync = require('sync');
var router = express.Router();
const Canvas = require('canvas');
const fs = require('fs');
const Image = Canvas.Image;
const canvas = new Canvas();
const ctx = canvas.getContext('2d');
const svgToImg = require("svg-to-img");


/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendfile('./views/index.html'); 
});

router.post('/api/graph/crop', function (req, res, next) {

  var dataUrl_svgImg = req.body.dataUrl;

  // var locationInf = {"x":197,"y":0,"x2":496,"y2":203.32,"w":299,"h":203.32};
  var locationInf = JSON.parse(req.body.locationInf);
  var userId = '';
  var uniqueTag = userId +(new Date().valueOf());
  var svgImgName = "public/tmp/svg" + uniqueTag + ".jpeg";

  new Promise((resolve, reject)=>{
    svgToImg.from(dataUrl_svgImg).toJpeg({
      path: svgImgName
    })
    setTimeout(()=>{
      resolve()
    }, 1000)
  }).then(() => {
    var img = new Image;
    img.src = fs.readFileSync(svgImgName);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, locationInf.x, locationInf.y, locationInf.w, locationInf.h, 0, 0, locationInf.w, locationInf.h);
    var dataUrl_canvas = canvas.toDataURL();
    var base64Data = dataUrl_canvas.replace(/^data:image\/png;base64,/, "");
    var cropperImgUrl = 'public/tmp/output' + uniqueTag + '.png';
    fs.writeFileSync(cropperImgUrl, base64Data, 'base64', function(err) {
      console.log(err);
    });
    res.send({
      imgUrl: cropperImgUrl.replace('public/', '')
    });

    // delele tmp file after 1 min
    setTimeout(function() {
      var dropFileds = [svgImgName, cropperImgUrl];
      dropFileds.forEach((item) => {
        fs.unlink(item, () => {
          console.log('delete file ' + cropperImgUrl + ' after 1 min.');
        })
      })

    }, 1000 * 60)
  })
});

module.exports = router;
