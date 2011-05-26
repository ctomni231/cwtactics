MeowObject = function()
{
    var data = {}

    var sealed = null

    var extendAble = null

    this.get = function( varName )
    {
        return data[ varName ]
    }

    this.set = function( varName , value )
    {
        if( sealed != null )
            throw "MeowObjectSealed"
        else if( data[ varName ] === 'undefined' && extendable != null )
            throw "MeowObjectShapeFixed"
        else
            data[ varName ] = value
    }

    this.seal = function( key )
    {
        sealed = key
    }

    this.fix = function( key )
    {
        extendAble = key
    }

    this.unseal = function( key )
    {
        if( sealed === key )
            sealed = null
    }

    this.unfix = function( key )
    {
        if( extendAble === key )
            extendAble = null
    }
}