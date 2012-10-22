var fs = require('fs');
var util = require('util');
var easyimg = require('easyimage');

var DIR_OUT = "jsBin/cwtwc_pics";
var DIR_IN = "image/";
var SRC, DST;

// HP
SRC = DIR_IN+"arrow.png";

easyimg.crop({
  src: SRC, dst: DIR_OUT+"/ARROW_T_N.png" ,
  cropwidth:16,cropheight:16, x: 0, y: 0, gravity:'NorthWest'
},function(e){
  if( e ) throw e;

  easyimg.crop({
    src: SRC, dst: DIR_OUT+"/ARROW_L_NS.png" ,
    cropwidth:16,cropheight:16, x: 16*1, y: 0, gravity:'NorthWest'
  },function(e){
    if( e ) throw e;

    easyimg.crop({
      src: SRC, dst: DIR_OUT+"/ARROW_E_ES.png" ,
      cropwidth:16,cropheight:16, x: 16*2, y: 0, gravity:'NorthWest'
    },function(e){
      if( e ) throw e;

      easyimg.exec("convert -rotate 90 "+DIR_OUT+"/ARROW_T_N.png "+
        DIR_OUT+"/ARROW_T_E.png ",
        function(err, image) {
        if (err) throw err;

          easyimg.exec("convert -rotate 180 "+DIR_OUT+"/ARROW_T_N.png "+
            DIR_OUT+"/ARROW_T_S.png ",
            function(err, image) {
              if (err) throw err;

              easyimg.exec("convert -rotate 270 "+DIR_OUT+"/ARROW_T_N.png "+
                DIR_OUT+"/ARROW_T_W.png ",
                function(err, image) {
                  if (err) throw err;




                  easyimg.exec("convert -rotate 90 "+DIR_OUT+"/ARROW_L_NS.png "+
                    DIR_OUT+"/ARROW_L_EW.png ",
                    function(err, image) {
                      if (err) throw err;




                      easyimg.exec("convert -rotate 90 "+DIR_OUT+"/ARROW_E_ES.png "+
                        DIR_OUT+"/ARROW_E_SW.png ",
                        function(err, image) {
                          if (err) throw err;

                          easyimg.exec("convert -rotate 180 "+DIR_OUT+"/ARROW_E_ES.png "+
                            DIR_OUT+"/ARROW_E_WN.png ",
                            function(err, image) {
                              if (err) throw err;

                              easyimg.exec("convert -rotate 270 "+DIR_OUT+"/ARROW_E_ES.png "+
                                DIR_OUT+"/ARROW_E_NE.png ",
                                function(err, image) {
                                  if (err) throw err;

                                  resizeAllPics();
                                });
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
    var width = 32;
    var height = 32;

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
    "ARROW_T_N.png","ARROW_T_E.png","ARROW_T_S.png","ARROW_T_W.png",
    "ARROW_L_NS.png","ARROW_L_EW.png",
    "ARROW_E_ES.png","ARROW_E_SW.png","ARROW_E_WN.png","ARROW_E_NE.png"
  ];

  resize( files2 );
};