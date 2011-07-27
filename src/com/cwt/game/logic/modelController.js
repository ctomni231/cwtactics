(function(){

    /*
     * weather controller
     */

    var activeWeather = null;
    var weatherMap = new meowEngine.RandomSet();
    var leftDays = 0;

    var decreaseWeatherDays = function(){

        leftDays--;
        if( leftDays <= 0 ){

            // choose new random weather
            var weather;
            do{
                weather = weatherMap.random();
            }
            while( activeWeather == weather );
            activeWeather = weather;

            leftDays = parseInt( 4 /* PLAYER NUM HERE */ * Math.random() , 10 );
        }
    }
    
})();