var fs = require('fs');
var util = require('util');
var easyimg = require('easyimage');

var DIR_OUT = "jsBin/cwtwc_pics";
var DIR_IN = "image/";
var SRC, DST;

// HP
SRC = DIR_IN+"HPNumbers.png";

easyimg.crop({
  src: SRC, dst: DIR_OUT+"/HP_1.png" ,
  cropwidth:8,cropheight:8, x: 0, y: 0, gravity:'NorthWest'
},function(e){
  if( e ) throw e;

  easyimg.crop({
    src: SRC, dst: DIR_OUT+"/HP_2.png" ,
    cropwidth:8,cropheight:8, x: 8*1, y: 0, gravity:'NorthWest'
  },function(e){
    if( e ) throw e;

    easyimg.crop({
      src: SRC, dst: DIR_OUT+"/HP_3.png" ,
      cropwidth:8,cropheight:8, x: 8*2, y: 0, gravity:'NorthWest'
    },function(e){
      if( e ) throw e;

      easyimg.crop({
        src: SRC, dst: DIR_OUT+"/HP_4.png" ,
        cropwidth:8,cropheight:8, x: 8*3, y: 0, gravity:'NorthWest'
      },function(e){
        if( e ) throw e;

        easyimg.crop({
          src: SRC, dst: DIR_OUT+"/HP_5.png" ,
          cropwidth:8,cropheight:8, x: 8*4, y: 0, gravity:'NorthWest'
        },function(e){
          if( e ) throw e;

          easyimg.crop({
            src: SRC, dst: DIR_OUT+"/HP_6.png" ,
            cropwidth:8,cropheight:8, x: 8*5, y: 0, gravity:'NorthWest'
          },function(e){
            if( e ) throw e;

            easyimg.crop({
              src: SRC, dst: DIR_OUT+"/HP_7.png" ,
              cropwidth:8,cropheight:8, x: 8*6, y: 0, gravity:'NorthWest'
            },function(e){
              if( e ) throw e;

              easyimg.crop({
                src: SRC, dst: DIR_OUT+"/HP_8.png" ,
                cropwidth:8,cropheight:8, x: 8*7, y: 0, gravity:'NorthWest'
              },function(e){
                if( e ) throw e;

                easyimg.crop({
                  src: SRC, dst: DIR_OUT+"/HP_9.png" ,
                  cropwidth:8,cropheight:8, x: 8*8, y: 0, gravity:'NorthWest'
                },function(e){
                  if( e ) throw e;

                  // resizeAllPics();
                  copyFocusFiles();
                });
              });
            });
          });
        });
      });
    });
  });
});

function resizeAllPics(){
  function resize( left ){
    var fName = left.pop();

    var width = 16;
    var height = 16;

    easyimg.resize({
        src: DIR_OUT+"/"+fName,
        dst: DIR_OUT+"/"+fName ,
        width: width, height:height
      },
      function(err, image) {
        if (err) throw err;
        console.log("Resized "+fName);

        if( left.length > 0 ) resize( left );
        else{
        }
      }
    );
  }

  function resize2( left ){
    var fName = left.pop();

    var width = 7*32;
    var height = 32;

    easyimg.resize({
        src: DIR_OUT+"/"+fName,
        dst: DIR_OUT+"/"+fName ,
        width: width, height:height
      },
      function(err, image) {
        if (err) throw err;
        console.log("Resized "+fName);

        if( left.length > 0 ) resize2( left );
      }
    );
  }

  var files2 = [
    "HP_1.png","HP_2.png","HP_3.png",
    "HP_4.png","HP_5.png","HP_6.png",
    "HP_7.png","HP_8.png","HP_9.png",
  ];

  resize( files2 );
}

function copy(src, dst, cb) {
  function copy(err) {
    var is
      , os
      ;

    if (!err) {
      return cb(new Error("File " + dst + " exists."));
    }

    fs.stat(src, function (err) {
      if (err) {
        return cb(err);
      }
      is = fs.createReadStream(src);
      os = fs.createWriteStream(dst);
      util.pump(is, os, cb);
    });
  }

  fs.stat(dst, copy);
};

function copyFocusFiles(){
  //TODO remove old
  copy( DIR_IN+"unitatk.png", DIR_OUT+"/ATK_FOC.png", function(){
    copy( DIR_IN+"unitmove.png", DIR_OUT+"/MOVE_FOC.png", function(){
      resizeAllPics();
    });
  });
}