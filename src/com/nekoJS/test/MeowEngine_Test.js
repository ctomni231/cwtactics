(function(){

    var isTrue = meowEngine.assert.isTrue;
    var chk = meowEngine.checks;

    $testCase({
       
       setUp : function( log ){
           log.info( "Starting MeowEngine framework test" );
       },

       test_StateMachine : function( log ){

         var tmp = 0;
         
         var stM = meowEngine.StateMachine.create({
            initial : "s1",
            events : [
                {name:"a", from:"s1", to:"s2"},
                {name:"b", from:"s2", to:"s3"},
                {name:"c", from:["s3","s2"], to:"s1"},
            ]
         });

         stM.onTransition = function(){
           tmp++;
         };

         stM.onEvent = function(a){
           tmp++;
           if( chk.isNumber(a) ){
               tmp += a;
           }
         };

         isTrue( stM.getState() === 's1' );

         meowEngine.assert.fails(function(){
             stM.b() 
         }, "should fail");
         
         stM.a();
         isTrue( tmp == 2 );
         isTrue( stM.getState() === 's2' );

         stM.c(3);
         isTrue( tmp == 7 );
         isTrue( stM.getState() === 's1' );
       },

       tearDown : function( log ){
           log.info( "Stopping MeowEngine framework test" );
       }

    });

})();