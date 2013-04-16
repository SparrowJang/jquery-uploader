
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/files'));
//app.use(express.static(__dirname + '/uploads'))
app.use(express.bodyParser({ keepExtensions: true, uploadDir: 'uploads' }));


app.post('/upload',function( req, res ){

  var id = req.body.id,
      fileName =  req.files.file && req.files.file.name? req.files.file.name:"";

      res.send({success:true,id:id,fileName:fileName});
});

app.listen(3000);


