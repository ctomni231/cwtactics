###
	ToDo: - use native JSON if possible, else use a neko json ( add json2JS )
###
neko.define "nekoJSON", ( require, exports ) ->
	
	if not ( JSON?.stringify? and JSON.parse? )
		throw new Error "nekoJSON; JSON property is missing, but needed"

	exports.VERSION   = 1.0
	
	exports.stringify = JSON.stringify
	exports.parse     = JSON.parse