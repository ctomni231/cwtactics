/**
 *
 * IMAGE BUILD SCRIPT FOR THE WEB CLIENT. EVERY IMAGE FROM THE IMAGE DIRECTORY
 * WILL BE RESIZED, CROPPED AND COLORED AND SAVED AS SINGLE UNITS. THIS PREVENTS
 * RUNTIME OVERHEAD FOR MOBILE DEVICES.
 *
 * Req.
 *  nodejs 0.6
 *  image magick for your os
 *  node easyimage
 */

var fs = require('fs');
var util = require('util');
var easyimg = require('easyimage');

var DIR__OUT = "jsBin/cwtwc_pics";
var DIR_UNITS = "image/units";
var DIR_PROPS = "image/properties";
var DIR_TERR = "image/terrain";


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

// DELETE OLD
var files

  // DELETE OLD
files = fs.readdirSync( DIR__OUT );
for( var i=0,e=files.length; i<e; i++ ){
  console.log("DELETE "+files[i]);
  try{
    fs.unlinkSync( DIR__OUT+"/"+files[i] );
  }
  catch(e){ console.log(e) }
}

var tileLenSprite = 3;
var tileSizeX = 32;

var el = 4;

// TARGET FILES
var imgColorReplacementMap = {

  /** @constant */
  // "#381818","#980038","#E00008","#F82800","#F85800","#F89870","#F8C880"
  RED:    [ 56,24,24,
    152,0,56,
    224,0,8,
    248,40,0,
    248,88,0,
    248,152,112,
    248,200,128,
    255,239,95 ],

  /** @constant */
  // "#182818","#088048","#08A830","#10D028","#28F028","#88F880","#C8F8C0"
  GREEN:  [ 24,40,24,
    8,128,72,
    8,168,48,
    16,208,40,
    40,240,40,
    136,248,128,
    200,248,192,
    255,239,95 ],

  BLACK_MASK:[
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0,
    0,0,0
  ],

  /** @constant */
  // "#181840","#2820C0","#0068E8","#0098F0","#40B8F0","#68E0F8","#B8F0F8"
  BLUE:   [ 24,24,64,
    40,32,192,
    0,104,232,
    0,152,240,
    64,184,240,
    104,224,248,
    184,240,248,
    255,239,95 ]
};


/**
 * Color maps for different target color shemas.
 */
var imgColorReplacementMapProperty = {

  GRAY:[
    120,104,120,
    152,136,200,
    192,192,200,
    240,232,208,
    248,248,240
  ],

  RED:[
    255,255,0,
    184,64,120,
    224,80,56,
    248,208,136,
    248,248,248
  ],

  BLUE:[
    255,255,0,
    104,72,224,
    120,112,248,
    136,208,248,
    184,248,248
  ],

  GREEN:[
    255,255,0,
    64,160,104,
    80,200,88,
    128,232,120,
    168,248,168
  ]
}

function _buildColorFilterString( fColor, tColor ){

  var data = [];
  // -fill 'rgb("+16+","+208+","+40+")' -opaque 'rgb("+224+","+0+","+8+")'
  for( var i=0,e=fColor.length; i<e; i+=3){
    data.push("-fill 'rgb(");
    data.push( tColor[i] );
    data.push(",");
    data.push( tColor[i+1] );
    data.push(",");
    data.push( tColor[i+2] );
    data.push(")' -opaque 'rgb(");
    data.push( fColor[i] );
    data.push(",");
    data.push( fColor[i+1] );
    data.push(",");
    data.push( fColor[i+2] );
    data.push(")'");

    if( i < e-1 ) data.push(" \ ");
  }

  var res = data.join("");
  console.log("result is --> "+res);

  return res;
};

function buildColorFilterString( from, to ){
  var fColor = imgColorReplacementMap[from];
  var tColor = imgColorReplacementMap[to];

  return _buildColorFilterString( fColor, tColor );
};

function buildColorFilterStringProperty( from, to ){
  var fColor = imgColorReplacementMapProperty[from];
  var tColor = imgColorReplacementMapProperty[to];

  return _buildColorFilterString( fColor, tColor );
};

function doIt( left ){

  var colMap;
  var fName = left.pop();
  console.log("DOING "+fName );
  easyimg.crop({

    src: DIR__OUT+"/"+fName,
    dst: DIR__OUT+"/IDLE_"+fName ,
    cropwidth:tileSizeX*tileLenSprite,
    cropheight:tileSizeX,
    gravity:'NorthWest',
    x: 0*tileLenSprite*tileSizeX,
    y: 0
  }, function( err, image ){
    if (err) throw err;
    console.log("Finished IDLE" );

    easyimg.crop({
      src: DIR__OUT+"/"+fName,
      dst: DIR__OUT+"/UP_"+fName ,
      cropwidth:tileSizeX*tileLenSprite,
      cropheight:tileSizeX,
      gravity:'West',
      x: 1*tileLenSprite*tileSizeX,
      y: 0
    }, function( err, image ){
      if (err) throw err;
      console.log("Finished UP" );

      easyimg.crop({
        src: DIR__OUT+"/"+fName,
        dst: DIR__OUT+"/DOWN_"+fName ,
        cropwidth:tileSizeX*tileLenSprite,
        cropheight:tileSizeX,
        gravity:'West',
        x: 2*tileLenSprite*tileSizeX,
        y: 0
      }, function( err, image ){
        if (err) throw err;
        console.log("Finished IDLE" );

        easyimg.crop({
          src: DIR__OUT+"/"+fName,
          dst: DIR__OUT+"/LEFT_"+fName ,
          cropwidth:tileSizeX*tileLenSprite,
          cropheight:tileSizeX,
          gravity:'West',
          x: 3*tileLenSprite*tileSizeX,
          y: 0
        }, function( err, image ){
          if (err) throw err;
          console.log("Finished LEFT" );

          easyimg.exec("convert "+DIR__OUT+"/LEFT_"+fName+" -flop "+DIR__OUT+"/RIGHT_"+fName , function(err, image) {
            if (err) throw err;
            console.log("Finished RIGHT" );

            easyimg.exec("convert "+DIR__OUT+"/IDLE_"+fName+" -flop "+DIR__OUT+"/IDLE_R_"+fName , function(err, image) {
              if (err) throw err;
              console.log("Finished IDLE INVERTED" );


            // RED ---> GREEN
            colMap = buildColorFilterString("RED","GREEN");
            easyimg.exec("convert "+DIR__OUT+"/RIGHT_"+fName+" "+colMap+" "+DIR__OUT+"/GREEN_RIGHT_"+fName ,function(err, image) {
              if (err) throw err;
              console.log("Finished COLOR GREEN RIGHT" );

              easyimg.exec("convert "+DIR__OUT+"/LEFT_"+fName+" "+colMap+" "+DIR__OUT+"/GREEN_LEFT_"+fName ,function(err, image) {
                if (err) throw err;
                console.log("Finished COLOR GREEN LEFT" );

                easyimg.exec("convert "+DIR__OUT+"/UP_"+fName+" "+colMap+" "+DIR__OUT+"/GREEN_UP_"+fName ,function(err, image) {
                  if (err) throw err;
                  console.log("Finished COLOR GREEN UP" );

                  easyimg.exec("convert "+DIR__OUT+"/DOWN_"+fName+" "+colMap+" "+DIR__OUT+"/GREEN_DOWN_"+fName ,function(err, image) {
                    if (err) throw err;
                    console.log("Finished COLOR GREEN DOWN" );

                    easyimg.exec("convert "+DIR__OUT+"/IDLE_"+fName+" "+colMap+" "+DIR__OUT+"/GREEN_IDLE_"+fName ,function(err, image) {
                      if (err) throw err;
                      console.log("Finished COLOR GREEN IDLE" );

                      easyimg.exec("convert "+DIR__OUT+"/IDLE_R_"+fName+" "+colMap+" "+DIR__OUT+"/GREEN_IDLE_R_"+fName ,function(err, image) {
                        if (err) throw err;
                        console.log("Finished COLOR GREEN IDLE INVERTED" );

                    // RED --> BLUE
                    colMap = buildColorFilterString("RED","BLUE");
                    easyimg.exec("convert "+DIR__OUT+"/RIGHT_"+fName+" "+colMap+" "+DIR__OUT+"/BLUE_RIGHT_"+fName ,function(err, image) {
                      if (err) throw err;
                      console.log("Finished COLOR BLUE RIGHT" );

                      easyimg.exec("convert "+DIR__OUT+"/LEFT_"+fName+" "+colMap+" "+DIR__OUT+"/BLUE_LEFT_"+fName ,function(err, image) {
                        if (err) throw err;
                        console.log("Finished COLOR BLUE LEFT" );

                        easyimg.exec("convert "+DIR__OUT+"/UP_"+fName+" "+colMap+" "+DIR__OUT+"/BLUE_UP_"+fName ,function(err, image) {
                          if (err) throw err;
                          console.log("Finished COLOR BLUE UP" );

                          easyimg.exec("convert "+DIR__OUT+"/DOWN_"+fName+" "+colMap+" "+DIR__OUT+"/BLUE_DOWN_"+fName ,function(err, image) {
                            if (err) throw err;
                            console.log("Finished COLOR BLUE DOWN" );

                            easyimg.exec("convert "+DIR__OUT+"/IDLE_"+fName+" "+colMap+" "+DIR__OUT+"/BLUE_IDLE_"+fName ,function(err, image) {
                              if (err) throw err;
                              console.log("Finished COLOR BLUE IDLE" );

                              easyimg.exec("convert "+DIR__OUT+"/IDLE_R_"+fName+" "+colMap+" "+DIR__OUT+"/BLUE_IDLE_R_"+fName ,function(err, image) {
                                if (err) throw err;
                                console.log("Finished COLOR BLUE IDLE INVERTED" );

                              // BLACK MASK
                              // RED --> BLUE
                              colMap = buildColorFilterString("RED","BLACK_MASK");
                              easyimg.exec("convert "+DIR__OUT+"/RIGHT_"+fName+" "+colMap+" "+DIR__OUT+"/BLACK_MASK_RIGHT_"+fName ,function(err, image) {
                                if (err) throw err;
                                console.log("Finished COLOR BLACK RIGHT" );

                                easyimg.exec("convert "+DIR__OUT+"/LEFT_"+fName+" "+colMap+" "+DIR__OUT+"/BLACK_MASK_LEFT_"+fName ,function(err, image) {
                                  if (err) throw err;
                                  console.log("Finished COLOR BLACK LEFT" );

                                  easyimg.exec("convert "+DIR__OUT+"/UP_"+fName+" "+colMap+" "+DIR__OUT+"/BLACK_MASK_UP_"+fName ,function(err, image) {
                                    if (err) throw err;
                                    console.log("Finished COLOR BLACK UP" );

                                    easyimg.exec("convert "+DIR__OUT+"/DOWN_"+fName+" "+colMap+" "+DIR__OUT+"/BLACK_MASK_DOWN_"+fName ,function(err, image) {
                                      if (err) throw err;
                                      console.log("Finished COLOR BLACK DOWN" );

                                      easyimg.exec("convert "+DIR__OUT+"/IDLE_"+fName+" "+colMap+" "+DIR__OUT+"/BLACK_MASK_IDLE_"+fName ,function(err, image) {
                                        if (err) throw err;
                                        console.log("Finished COLOR BLACK IDLE" );

                                        easyimg.exec("convert "+DIR__OUT+"/IDLE_R_"+fName+" "+colMap+" "+DIR__OUT+"/BLACK_MASK_IDLE_R_"+fName ,function(err, image) {
                                          if (err) throw err;
                                          console.log("Finished COLOR BLACK IDLE INVERTED" );


                                        // RENAME PLAIN TO RED
                                        fs.renameSync(DIR__OUT+"/IDLE_"+fName, DIR__OUT+"/RED_IDLE_"+fName);
                                        fs.renameSync(DIR__OUT+"/IDLE_R_"+fName, DIR__OUT+"/RED_IDLE_R_"+fName);
                                        fs.renameSync(DIR__OUT+"/LEFT_"+fName, DIR__OUT+"/RED_LEFT_"+fName);
                                        fs.renameSync(DIR__OUT+"/RIGHT_"+fName, DIR__OUT+"/RED_RIGHT_"+fName);
                                        fs.renameSync(DIR__OUT+"/UP_"+fName, DIR__OUT+"/RED_UP_"+fName);
                                        fs.renameSync(DIR__OUT+"/DOWN_"+fName, DIR__OUT+"/RED_DOWN_"+fName);

                                        // REMOVE BASE IMAGE
                                        fs.unlinkSync( DIR__OUT+"/"+fName );

                                        if( left.length > 0 ) doIt( left );
                                        else copyIntoOutProperty( fs.readdirSync( DIR_PROPS ) );
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
        });
      });
    });
  });
}

function doItProperties( left ){

  var colMap;
  var fName = left.pop();
  console.log("DOING "+fName );

  colMap = buildColorFilterStringProperty("RED","GRAY");
  easyimg.exec("convert "+DIR__OUT+"/"+fName+" "+colMap+" "+DIR__OUT+"/PROP_GRAY_"+fName ,function(err, image) {
    if (err) throw err;
    console.log("Finished COLOR GRAY" );

    colMap = buildColorFilterStringProperty("RED","GREEN");
    easyimg.exec("convert "+DIR__OUT+"/"+fName+" "+colMap+" "+DIR__OUT+"/PROP_GREEN_"+fName ,function(err, image) {
      if (err) throw err;
      console.log("Finished COLOR GREEN" );

      colMap = buildColorFilterStringProperty("RED","BLUE");
      easyimg.exec("convert "+DIR__OUT+"/"+fName+" "+colMap+" "+DIR__OUT+"/PROP_BLUE_"+fName ,function(err, image) {
        if (err) throw err;
        console.log("Finished COLOR BLUE" );

          fs.renameSync(DIR__OUT+"/"+fName, DIR__OUT+"/PROP_RED_"+fName);

          if( left.length > 0 ) doItProperties( left );
          else resizeAllPics();
      });
    });
  });
};

function resizeAllPics(){
  function resize( left ){
    var fName = left.pop();

    var width = 96*2;
    var height = 32*2;
    if( fName.substr(0,5) === "PROP_" ){
      var width = 64*2;
      var height = 32*2;
    }

    easyimg.resize({
        src: DIR__OUT+"/"+fName,
        dst: DIR__OUT+"/"+fName ,
        width: width, height:height
      },
      function(err, image) {
        if (err) throw err;
        console.log("Resized "+fName);

        if( left.length > 0 ) resize( left );
      }
    );
  }

  var files2 = fs.readdirSync( DIR__OUT );
  resize( files2 );
}

function copyIntoOut( left ){
  var fName = left.pop();
  copy(
    DIR_UNITS+"/"+fName,
    DIR__OUT+"/"+fName ,
    function( e ){
      if( e ) console.log( fName+" failed to move ");
      console.log( fName+" moved to target ");

      if( left.length > 0 ) copyIntoOut( left );
      else doIt( fs.readdirSync( DIR_UNITS ) );
    }
  );
}

function copyIntoOutProperty( left ){
  var fName = left.pop();
  copy(
    DIR_PROPS+"/"+fName,
    DIR__OUT+"/"+fName ,
    function( e ){
      if( e ) console.log( fName+" failed to move ");
      console.log( fName+" moved to target ");

      if( left.length > 0 ) copyIntoOutProperty( left );
      else doItProperties( fs.readdirSync( DIR_PROPS ) );
    }
  );
}


function copyIntoOutTerrain( left ){
  var fName = left.pop();
  copy(
    DIR_TERR+"/"+fName,
    DIR__OUT+"/"+fName ,
    function( e ){
      if( e ) console.log( fName+" failed to move ");
      console.log( fName+" moved to target ");

      if( left.length > 0 ) copyIntoOutTerrain( left );
      else copyIntoOut( fs.readdirSync( DIR_UNITS ) );
    }
  );
}

copyIntoOutTerrain( fs.readdirSync( DIR_TERR ) );
