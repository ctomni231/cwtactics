neko.define("logic/weather", ["assert","checks","data/database"],
                     function( assert , check,   db ){

    var _firstPlayer = null;
    var currentWeather = null;
    var leftTicks = 0;

    function setWeather( weather, ticks ){

        assert.ok( weather instanceof WeatherSheet );
        assert.ok( check.isNumber( ticks ) && ticks > 0 );

        currentWeather  = weather;
        leftTicks       = ticks;
    }

    function randomWeather(){

        
    }

    // module API
    return{

        setWeather      : setWeather,
        randomWeather   : randomWeather,
        tick            : function(){

            leftTicks--;
            if( leftTicks <= 0 ){
                randomWeather();
            }
        },

        active : function(){return currentWeather;}
    }
});