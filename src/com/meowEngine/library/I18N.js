neko.define("I18N", ["nekoJSON"], function( JSON ){

    var languages = ["de","en_US","en_GB","fr"];

    var language = null;
    var initialized = false;
    var stringDatabase = {};

    function initialize( language ){

        if( initialized === true ){
            throw new Error("Language module I18N is already initialized");
        }

        initialized = true;
    }

    function isInitialized(){
        return initialized;
    }

    function get( ID ){
        return stringDatabase[ID];
    }

    // module API
    return{

        VERSION : 0.5,

        isInitialized : isInitialized,
        initialize : initialize,

        get : get
    }
});