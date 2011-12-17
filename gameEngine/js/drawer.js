define(["cwt/map"], function( map ){
  
  var _canvas = document.getElementById("canvasTile");
  var _ctx = _canvas.getContext("2d");
  var _canvasObj = document.getElementById("canvasObj");
  var _ctxObj = _canvasObj.getContext("2d");
  
  var _tileImg = new Image(16*16,8*32);
  _tileImg.src = "js/mod/default/graphic/img2.png";
  
  var _unitImg = new Image(12*32,1*32);
  _unitImg.src = "js/mod/default/graphic/img.png";
  
  var fps = 0;

// The higher this value, the less the FPS will be affected by quick changes
// Setting this to 1 will show you the FPS of the last sampled frame only
  var fpsFilter = 50;
  
  var _fps;
  var _afps = 0;
  var _lfps;
  var _step = 0;
  var _hfps;
  
  var _mX = 16;
  var _mY = 8;
  
  var _mapData = map.getData()
  var _mapW = map.width();
  var _mapH = map.height();
  var _drawn = false;
  
  var _maxI = 2;
  var _stepA = 0;
  var _stepDelay = 250;
  
  var _unitData = [];
  for( var i = 0, e=50*2; i<e; i++ )
  {
    _unitData[i] = 200+i;
  }
  
  // TEST DRAW
  function drawTileFromImgPos( index,cv,tX,tY )
  {
    var _iX = index%_mX;
    var _iY = (index-_iX)/_mX;
    
    cv.drawImage( _tileImg, _iX*16, _iY*32, 16, 32, tX*32, tY*32-32, 32, 64);
  }
  
  // TEST DRAW
  function drawUnit( cv, index )
  {
    var _iX = index%_mapW;
    var _iY = (index-_iX)/_mapW;
    
    cv.clearRect( _iX*32, _iY*32, 32,32 );
    cv.drawImage( _unitImg, _stepA*32 , 0 , 32, 32, _iX*32-16, _iY*32-16 , 64,64);
  }
  
  var fpsOut = document.getElementById('fps');
  setInterval(function(){
    fpsOut.innerHTML = fps.toFixed(1) + "fps";
  }, 1000); 
  
  return {
    
    draw: function( delay )
    {
      _stepDelay -= delay;
      
      //draw unit
      if( _stepDelay <= 0 )
      {
        _stepA++;
        
        for( var i = 0, e=_unitData.length; i<e; i++ )
        {
          drawUnit( _ctxObj, _unitData[i] );
        }
        
        _stepDelay = 250;
        
        if(_stepA>=_maxI) _stepA=0;
      }
    
      var _in = 0;
      // DRAW MAP
      if( !_drawn )
      for( var iX = 0; iX<_mapW; iX++ )
      {
        for( var iY = 0; iY<_mapH; iY++ )
        {
          drawTileFromImgPos(_mapData[_in], _ctx, iX, iY);
          
          _in++;
        }
      }
      
      var thisFrameFPS = 1000 / delay;
      fps += (thisFrameFPS - fps) / fpsFilter;
      
      _drawn = true;
    }
  }
})