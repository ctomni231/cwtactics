var fs = require('fs');
var util = require('util');
var easyimg = require('easyimage');

var DIR_OUT = "jsBin/cwtwc_pics";
var DIR_IN = "image/";
var SRC;

// HP
SRC = DIR_IN+"UnitIcons.png";

easyimg.crop({
  src: SRC, dst: DIR_OUT+"/UNIT_STAT_HEART.png" ,
  cropwidth:8,cropheight:8, x: 8*0, y: 0, gravity:'NorthWest'
},function(e){
  if( e ) throw e;

  easyimg.crop({
    src: SRC, dst: DIR_OUT+"/UNIT_STAT_AMMO.png" ,
    cropwidth:8,cropheight:8, x: 8*1, y: 0, gravity:'NorthWest'
  },function(e){
    if( e ) throw e;

    easyimg.crop({
      src: SRC, dst: DIR_OUT+"/UNIT_STAT_FUEL.png" ,
      cropwidth:8,cropheight:8, x: 8*2, y: 0, gravity:'NorthWest'
    },function(e){
      if( e ) throw e;

      easyimg.crop({
        src: SRC, dst: DIR_OUT+"/UNIT_STAT_???.png" ,
        cropwidth:8,cropheight:8, x: 8*3, y: 0, gravity:'NorthWest'
      },function(e){
        if( e ) throw e;

        easyimg.crop({
          src: SRC, dst: DIR_OUT+"/UNIT_STAT_CAPTURE.png" ,
          cropwidth:8,cropheight:8, x: 8*4, y: 0, gravity:'NorthWest'
        },function(e){
          if( e ) throw e;

          easyimg.crop({
            src: SRC, dst: DIR_OUT+"/UNIT_STAT_LOADS.png" ,
            cropwidth:8,cropheight:8, x: 8*5, y: 0, gravity:'NorthWest'
          },function(e){
            if( e ) throw e;

            easyimg.crop({
              src: SRC, dst: DIR_OUT+"/UNIT_STAT_???2.png" ,
              cropwidth:8,cropheight:8, x: 8*6, y: 0, gravity:'NorthWest'
            },function(e){
              if( e ) throw e;

              easyimg.crop({
                src: SRC, dst: DIR_OUT+"/UNIT_STAT_LOADEDUNKNWOWN.png" ,
                cropwidth:8,cropheight:8, x: 8*7, y: 0, gravity:'NorthWest'
              },function(e){
                if( e ) throw e;

                resizeAllPics();
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

  var files2 = [
    "UNIT_STAT_HEART.png","UNIT_STAT_AMMO.png","UNIT_STAT_FUEL.png",
    "UNIT_STAT_CAPTURE.png","UNIT_STAT_LOADS.png","/UNIT_STAT_LOADEDUNKNWOWN.png"
  ];

  resize( files2 );
};