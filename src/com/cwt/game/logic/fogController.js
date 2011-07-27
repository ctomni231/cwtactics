(function(){
    
    var MAX_MAP_WIDTH  = 100;
    var MAX_MAP_HEIGHT = 100;
    var MAX_VISION     = 15;

    var _MARKER = -1;

    var time = ( new Date() ).getTime();
    
    // private variables
    var visionMap = new Array( MAX_MAP_WIDTH * MAX_MAP_HEIGHT );
    
    var visionBlockMap = new Array( MAX_VISION );
    var visionBlockMapPointer = 0;
    
    var visionObjects = [];
   
    var visionData;
    {
        var d = MAX_VISION+MAX_VISION+1;
        var n = d*d;
        var numT = ((n-1)/2) +1;
        visionData = new Array( numT );
    }
    var visionX = 0;
    var visionY = 0;
    var visionV = 0;
    
    
    var clearVisionObjects = function(){
        
        for( var i = 0, e = visionObjects.length; i < e; i++ ){
            
            // chache the array with a marker rather than resizing it
            visionObjects[i] = _MARKER;
        }
    };
    
    var toArrayPos = function(x,y){
        return x+(y*MAX_MAP_WIDTH);
    };
    
    var toCardPos = function(x,y){
        
        // get a clean position in releation to the source of
        // the vision matrix position
        x = x-visionX;
        y = y-visionY;
        
        var mP = x+(y*(visionV+visionV+1)); // get correct position in matrix
        
        var rel = visionV-y; // is the y above/under/or on the vision 
                             // objects center line
                     
        // reduce unexisting tiles from the matrix 
        // with the "gaus'sche summenformel" [ (n(n+1))/2 ]
        // here on both side in one term [ n(n+1) ]
        var gSum = ( visionV*(visionV+1) );
        if( rel === 0 ){
            
            // y is the center line itself
            mP = mP - gSum;
        }
        else if( rel > 0 ){
            
            // y is above the center line
            mP = mP - gSum + (rel*(rel+1)) - rel;
        }
        else{
            
            // y is under the center line
            rel = -rel;
            mP = mP - gSum - (rel*(rel+1)) + rel;
        }
        
        return mP;
    }
    
    var calcVisionLine = function(x1,y1,x2,y2){
       
        // clear
        var onShadow = false;
        
        // Define differences and error check
        var dx = x2 - x1;
        var dy = y2 - y1;
        if( dx < 0 ) dx = -dx;
        if( dy < 0 ) dy = -dy;
        var sx = (x1 < x2) ? 1 : -1;
        var sy = (y1 < y2) ? 1 : -1;
        var err = dx - dy;
        
        // Main loop
        while (!((x1 == x2) && (y1 == y2))) {
            
            var e2 = err << 1;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
          
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
            
            // if shadow, put rest into shadow
            
            // check blocker / shadow
            
        }
    }
        
    var processFog = function( player ){
        
        // get real units
        
            // test data
            visionObjects[0] = toArrayPos( 3 , 3 );
            visionObjects[1] = 3;
            
            visionObjects[2] = toArrayPos( 31 , 3 );
            visionObjects[3] = 5;
            
            visionObjects[4] = toArrayPos( 63 , 23 );
            visionObjects[5] = 2;
            
            visionObjects[6] = toArrayPos( 23 , 53 );
            visionObjects[7] = 6;
            
            visionObjects[8] = toArrayPos( 13 , 73 );
            visionObjects[9] = 12;
        
        for( var i = 0, e = visionObjects.length; i < e; i+=2 ){
            
            
            visionV = visionObjects[i+1];
        }
    }
     
})();