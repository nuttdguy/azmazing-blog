var express = require('express');
var router = express.Router();
var multer = require('multer');
var Upload = require('s3-uploader')
var upload = multer({ dest: 'uploads/' })
require('dotenv')

  // UPLOADING TO AWS S3
  var client = new Upload(process.env.S3_BUCKET, {
    aws: {
      path: 'posts/coverImg/',
      region: process.env.S3_REGION,
      acl: 'public-read',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    cleanup: {
      versions: true,
      original: true
    },
    versions: [{
      maxWidth: 320,
      aspect: '1.618:1',
      suffix: '-thumbnail'
    },{
      maxWidth: 1000,
      aspect: '2.414:1', //silver ratio
      suffix: '-desktop'
    },{
      maxWidth: 320,
      aspect: '2.414:1', //silver ratio
      suffix: '-mobile'
    },{
      maxWidth: 100,
      aspect: '1:1',
      suffix: '-square'
    }]
  });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/posts', upload.single('coverImg'), function(req, res, next) {
  // IN CREATE ROUTE AFTER SAVE
  if (req.file) {
    client.upload(req.file.path, {}, function (err, versions, meta) {
      if (err) { return res.status(400).send({ err: err }) };

      versions.forEach(function(image) {
        // console.log(image.width, image.height, image.url);
        // 1024 760 https://my-bucket.s3.amazonaws.com/path/110ec58a-a0f2-4ac4-8393-c866d813b8d1.jpg

        var urlArray = image.url.split('-');
        urlArray.pop();
        var url = urlArray.join('-');
        post.imgUrl = url;
        post.save();
      });

      res.send({ post: post });
    });
  } else {
    res.send({ post: post });
  }
});




module.exports = router;
