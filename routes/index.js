var express = require('express');
var router = express.Router();
const Canvas = require('canvas');
const fs = require('fs');
const Image = Canvas.Image;
const canvas = new Canvas();
const ctx = canvas.getContext('2d');
const svg2img = require('svg2img');
const svgToImg = require("svg-to-img");


/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendfile('./views/index.html'); 
});

router.post('/api/graph/crop', function (req, res, next) {

  var dataUrl_svgImg = req.body.dataUrl;
  var locationInf = JSON.parse(req.body.locationInf);
  console.log(JSON.stringify(req.body));
  // var img = new Image;
  // img.onload = function() {
  //   var locationInf = {"x":197,"y":0,"x2":496,"y2":203.32,"w":299,"h":203.32};
  //   ctx.drawImage(img, locationInf.x, locationInf.y, locationInf.w, locationInf.h, 0, 0, locationInf.w, locationInf.h);
  //   var dataUrl_canvas = canvas.toDataURL();
  //   var base64Data = dataUrl_canvas.replace(/^data:image\/png;base64,/, "");
  //   var cropperImgUrl = 'out.png';
  //   fs.writeFileSync(cropperImgUrl, base64Data, 'base64', function(err) {
  //     console.log(err);
  //   });
  //   console.log('req:' + JSON.stringify(req.body));
  //   console.log('**************url:' + svg_dataUrl);
  //   res.send({
  //     imgUrl: cropperImgUrl
  //   });
  // };
  // img.src = dataUrl_svgImg;
  var svgImgName = "public/tmp/svg.jpeg";
  (async() => {
    await svgToImg.from(dataUrl_svgImg).toJpeg({
      path: svgImgName
    });

  })();

    var img = new Image;
    img.src = fs.readFileSync(svgImgName);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, locationInf.x, locationInf.y, locationInf.w, locationInf.h, 0, 0, locationInf.w, locationInf.h);
    var dataUrl_canvas = canvas.toDataURL();
    var base64Data = dataUrl_canvas.replace(/^data:image\/png;base64,/, "");
    var cropperImgUrl = 'public/tmp/outer.png';
    fs.writeFileSync(cropperImgUrl, base64Data, 'base64', function(err) {
      console.log(err);
    });
    res.send({
      imgUrl: 'tmp/outer.png'
    });

  // svg2img(dataUrl_svgImg, function(error, buffer) {
  //     var svgImgName = 'svg.png';
  //     fs.writeFileSync(svgImgName, buffer);
  //     var img = new Image;
  //     img.src = fs.readFileSync(svgImgName);
  //     var locationInf = {"x":197,"y":0,"x2":496,"y2":203.32,"w":299,"h":203.32};
  //     ctx.drawImage(img, locationInf.x, locationInf.y, locationInf.w, locationInf.h, 0, 0, locationInf.w, locationInf.h);
  //     var dataUrl_canvas = canvas.toDataURL();
  //     var base64Data = dataUrl_canvas.replace(/^data:image\/png;base64,/, "");
  //     var cropperImgUrl = 'out.png';
  //     fs.writeFileSync(cropperImgUrl, base64Data, 'base64', function(err) {
  //       console.log(err);
  //     });
  //     console.log('req:' + JSON.stringify(req.body));
  //     console.log('**************url:' + svg_dataUrl);
  //     res.send({
  //       imgUrl: cropperImgUrl
  //     });
  // });
});

module.exports = router;
