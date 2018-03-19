var express = require('express');
var router = express.Router();
var util = require("util");
var fs = require("fs");
var multer = require('multer');
var u = multer({ dest: './uploads/' });


var exec = require('child_process');

router.get('/', function(req, res) {
    res.render("uploadPage", {title: "I love files!"});
});

router.post("/upload", u.single('myFile') , function(req, res, next){
    //console.log(util.inspect(req.file));
    if (req.file) {
        console.log(util.inspect(req.file));
        if (req.file.size === 0) {
            return next(new Error("Hey, first would you select a file?"));
        }
        fs.exists(req.file.path, function(exists) {
            if(exists) {

                res.set('Content-Type', 'text/html');



                res.write("Got your file!");

                // Now execute some command to transform the file

                fun(req.file.filename,res);


            } else {
                res.end("Well, there is no magic for those who don’t believe in it!");
            }
        });
    }
});



function findCentroid(pts, nPts) {
    var off = pts[0];
    var twicearea = 0;
    var x = 0;
    var y = 0;
    var p1,p2;
    var f;
    for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
        p1 = pts[i];
        p2 = pts[j];
        f = (p1.lat - off.lat) * (p2.lng - off.lng) - (p2.lat - off.lat) * (p1.lng - off.lng);
        twicearea += f;
        x += (p1.lat + p2.lat - 2 * off.lat) * f;
        y += (p1.lng + p2.lng - 2 * off.lng) * f;
    }
    f = twicearea * 3;
    return {
        X: x / f + off.lat,
        Y: y / f + off.lng
    };
}


var fun =function(fileName,res){
    console.log("fun() start");
    exec.exec("/Users/shahed/dev/quirc/quirc/inspect  /Users/shahed/src/Node/ProcessQR/uploads/"+fileName , function(err, data) {
        //console.log(err)
        console.log(JSON.stringify(data.toString()));


        var qrs = JSON.parse(data.toString());


        console.log("Object is "+qrs.QR.qrcodes.length);

        for(var i =0; i<qrs.QR.qrcodes.length;i++) {

            var point = findCentroid(qrs.QR.qrcodes[i].corners,4)

           res.write("<li>Center is "+ Math.round(point.X) + " " + Math.round(point.Y) + " "+qrs.QR.qrcodes[i].payload +"</li>");

        }
        res.end("-----");

    });
}




module.exports = router;