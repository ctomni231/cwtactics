neko.define("properties",function(){

    var propData = {};
    var propAttr = {};

    var _RW = -2;
    var _R = -3;

    /**
     * Checks the existence of a given property.
     * 
     * @function
     * @param {String} key key of the property
     * @return true, if exists, else false
     */
    function hasProperty( key ){

        if( !isString(key) ){
            throw "hasProperty, key has to be a string";
        }

        return typeof propData[key] !== 'undefined';
    }

    /**
     * Deletes a property from property storage. Throws exception, if the
     * property has a non remove-able status.
     *
     * @function
     * @memberOf meowEngine#
     * @param {String} key key of the property
     */
    function deleteProperty( key ){

        if( !isString(key) || !inList(key,propData) ){
            throw "deleteProperty, key has to be a string and registered in "+
            "property manager";
        }

        var e = propAttr[key];
        if( e === _R || e === _RW ){
            throw "property is not removable!";
        }

        delete propData[key];
        delete propAttr[key];
    }

    /**
     * Sets a property in the property manager of meow.
     * 
     * @function
     * @param {String} key key of the property
     * @param value value that will be saved in the property
     * @param {meow.CONST.NOTREMOVEABLE|meotypew.CONST.READONLY} attr constant
     *		  for controlling the of the property (optional)
     */
    function setProperty( key, value, attr ){

        if( !isString(key) ){
            throw "setProperty, key has to be a string";
        }

        var e = propAttr[key];
        if( e === _R ){
            throw "property is read only!";
        }

        propData[key] = value;

        if( attr === _RW || attr === _R ){
            if( typeof propAttr[key] === 'undefined' ){
                propAttr[key] = attr;
            }
            else{
                throw "attributes of this property is already set";
            }
        }
    }

    /**
     * Returns the value of a property.
     *
     * @function
     * @param {String} key key of the property
     * @return value of the property
     */
    function getProperty( key ){
        return propData[ key ];
    }

    return {
        
        VERSION : 0.6, 
        // TODO: add configuratable attributes etc.
        //       maybe a bitwise data grid for different attributes

        CONSTANT : _R,  // indicates R access
        VALUE    : _RW, // indicates RW access
        
        hasProperty : hasProperty,

        setProperty : setProperty,
        
        getProperty : getProperty,

        deleteProperty : deleteProperty
    }
});