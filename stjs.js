function exception(t){return t}function isEnum(t){return null!=t&&t.constructor==stjs.enumEntry}function setAssertHandler(t){stjsAssertHandler=t}function assertArgEquals(t,e,r,n){expepectedValue!=n&&stjsAssertHandler&&stjsAssertHandler(t,e,"Wrong argument. Expected: "+r+", got:"+n)}function assertArgNotNull(t,e,r){null==r&&stjsAssertHandler&&stjsAssertHandler(t,e,"Wrong argument. Null value")}function assertArgTrue(t,e,r){!r&&stjsAssertHandler&&stjsAssertHandler(t,e,"Wrong argument. Condition is false")}function assertStateEquals(t,e,r,n){expepectedValue!=n&&stjsAssertHandler&&stjsAssertHandler(t,e,"Wrong state. Expected: "+r+", got:"+n)}function assertStateNotNull(t,e,r){null==r&&stjsAssertHandler&&stjsAssertHandler("Wrong state. Null value")}function assertStateTrue(t,e,r){!r&&stjsAssertHandler&&stjsAssertHandler(t,e,"Wrong state. Condition is false")}var NOT_IMPLEMENTED=function(){throw"This method is not implemented in Javascript."}
if(JavalikeEquals=function(t){return null==t?!1:t.valueOf?this.valueOf()===t.valueOf():this===t},String.prototype.equals||(String.prototype.equals=JavalikeEquals),String.prototype.getBytes||(String.prototype.getBytes=NOT_IMPLEMENTED),String.prototype.getChars||(String.prototype.getChars=NOT_IMPLEMENTED),String.prototype.contentEquals||(String.prototype.contentEquals=NOT_IMPLEMENTED),String.prototype.startsWith||(String.prototype.startsWith=function(t,e){var r=null!=e?e:0
return this.substring(r,r+t.length)==t}),String.prototype.endsWith||(String.prototype.endsWith=function(t){return null==t?!1:this.length<t.length?!1:this.substring(this.length-t.length,this.length)==t}),!String.prototype.trim){var trimLeft=/^\s+/,trimRight=/\s+$/
String.prototype.trim=function(){return this.replace(trimLeft,"").replace(trimRight,"")}}String.prototype.matches||(String.prototype.matches=function(t){return null!=this.match("^"+t+"$")}),String.prototype.compareTo||(String.prototype.compareTo=function(t){return null==t?1:t>this?-1:this==t?0:1}),String.prototype.compareToIgnoreCase||(String.prototype.compareToIgnoreCase=function(t){return null==t?1:this.toLowerCase().compareTo(t.toLowerCase())}),String.prototype.equalsIgnoreCase||(String.prototype.equalsIgnoreCase=function(t){return null==t?!1:this.toLowerCase()===t.toLowerCase()}),String.prototype.codePointAt||(String.prototype.codePointAt=String.prototype.charCodeAt),String.prototype.codePointBefore||(String.prototype.codePointBefore=NOT_IMPLEMENTED),String.prototype.codePointCount||(String.prototype.codePointCount=NOT_IMPLEMENTED),String.prototype.replaceAll||(String.prototype.replaceAll=function(t,e){return this.replace(RegExp(t,"g"),e)}),String.prototype.replaceFirst||(String.prototype.replaceFirst=function(t,e){return this.replace(RegExp(t),e)}),String.prototype.regionMatches||(String.prototype.regionMatches=function(t,e,r,n,s){if(4==arguments.length&&(s=arguments[3],n=arguments[2],r=arguments[1],e=arguments[0],t=!1),0>e||0>n||null==r||e+s>this.length||n+s>r.length)return!1
var o=this.substring(e,e+s),u=r.substring(n,n+s)
return t?o.equalsIgnoreCase(u):o===u}),String.valueOf=function(t){return new String(t)}
var Byte=Number,Double=Number,Float=Number,Integer=Number,Long=Number,Short=Number
Number.prototype.intValue||(Number.prototype.intValue=function(){return parseInt(this)}),Number.prototype.shortValue||(Number.prototype.shortValue=function(){return parseInt(this)}),Number.prototype.longValue||(Number.prototype.longValue=function(){return parseInt(this)}),Number.prototype.byteValue||(Number.prototype.byteValue=function(){return parseInt(this)}),Number.prototype.floatValue||(Number.prototype.floatValue=function(){return parseFloat(this)}),Number.prototype.doubleValue||(Number.prototype.doubleValue=function(){return parseFloat(this)}),Number.parseInt||(Number.parseInt=parseInt),Number.parseShort||(Number.parseShort=parseInt),Number.parseLong||(Number.parseLong=parseInt),Number.parseByte||(Number.parseByte=parseInt),Number.parseDouble||(Number.parseDouble=parseFloat),Number.parseFloat||(Number.parseFloat=parseFloat),Number.isNaN||(Number.isNaN=isNaN),Number.prototype.isNaN||(Number.prototype.isNaN=isNaN),Number.prototype.equals||(Number.prototype.equals=JavalikeEquals),Number.valueOf=function(t){return new Number(t).valueOf()},Boolean.prototype.equals||(Boolean.prototype.equals=JavalikeEquals),Boolean.valueOf=function(t){return new Boolean(t).valueOf()}
var stjs={}
stjs.global=this,stjs.skipCopy={prototype:!0,constructor:!0,$typeDescription:!0,$inherit:!0},stjs.ns=function(t){for(var e=t.split("."),r=stjs.global,n=0;n<e.length;++n){var s=e[n]
r=r[s]=r[s]||{}}return r},stjs.copyProps=function(t,e){for(key in t)stjs.skipCopy[key]||(e[key]=t[key])
return e},stjs.copyInexistentProps=function(t,e){for(key in t)stjs.skipCopy[key]||e[key]||(e[key]=t[key])
return e},stjs.extend=function(t,e,r,n,s){if("object"!=typeof s)return stjs.extend12.apply(this,arguments)
t.$inherit=[]
var o
if(null!=e){var u=function(){}
u.prototype=e.prototype,t.prototype=new u,stjs.copyProps(e,t),stjs.copyProps(e.$typeDescription,s),t.$inherit.push(e)}for(o=0;o<r.length;++o)stjs.copyProps(r[o],t),stjs.copyInexistentProps(r[o].prototype,t.prototype),t.$inherit.push(r[o])
return t.prototype.constructor=t,null!=n&&n(t,t.prototype),t.$typeDescription=s,null!=e||t.prototype.equals||(t.prototype.equals=JavalikeEquals),t},stjs.extend12=function(t,e){var r,n=function(){}
for(n.prototype=e.prototype,t.prototype=new n,r=1;r<arguments.length;++r)stjs.copyProps(arguments[r],t)
return t.prototype.constructor=t,null==e&&(t.prototype.equals=JavalikeEquals),t},stjs.isInstanceOf=function(t,e){if(t===e)return!0
if(!t.$inherit)return!1
for(var r in t.$inherit)if(stjs.isInstanceOf(t.$inherit[r],e))return!0
return!1},stjs.enumEntry=function(t,e){this._name=e,this._ordinal=t},stjs.enumEntry.prototype.name=function(){return this._name},stjs.enumEntry.prototype.ordinal=function(){return this._ordinal},stjs.enumEntry.prototype.toString=function(){return this._name},stjs.enumEntry.prototype.equals=JavalikeEquals,stjs.enumeration=function(){var t,e={}
for(e._values=[],t=0;t<arguments.length;++t)e[arguments[t]]=new stjs.enumEntry(t,arguments[t]),e._values[t]=e[arguments[t]]
return e.values=function(){return this._values},e.valueOf=function(t){return this[t]},e},stjs.mainCallDisabled=!1,stjs.exception=function(t){return t},stjs.isEnum=function(t){return null!=t&&t.constructor==stjs.enumEntry},stjs.trunc=function(t){return null==t?null:0|t},stjs.converters={Date:function(t){var e=/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)$/.exec(t)
return e?new Date(+e[1],+e[2]-1,+e[3],+e[4],+e[5],+e[6]):null},Enum:function(s,type){return eval(type.arguments[0])[s]}},stjs.parseJSON=function(){function unescapeOne(t,e,r){return e?escapes[e]:String.fromCharCode(parseInt(r,16))}function constr(name,param){var c=constructors[name]
return c||(constructors[name]=c=eval(name)),new c(param)}function convert(t,e){if(!t)return e
var r=stjs.converters[t.name||t]
return r?r(e,t):constr(t,e)}function builder(t){return t?"function"==typeof t?new t:t.name?"Map"==t.name?{}:"Array"==t.name?[]:constr(t.name):constr(t):{}}function nextMatch(t){var e=jsonToken.exec(t)
return null!=e?e[0]:null}var number="(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)",oneChar='(?:[^\\0-\\x08\\x0a-\\x1f"\\\\]|\\\\(?:["/\\\\bfnrt]|u[0-9A-Fa-f]{4}))',string='(?:"'+oneChar+'*")',jsonToken=RegExp("(?:false|true|null|[\\{\\}\\[\\]]|"+number+"|"+string+")","g"),escapeSequence=RegExp("\\\\(?:([^u])|u(.{4}))","g"),escapes={'"':'"',"/":"/","\\":"\\",b:"\b",f:"\f",n:"\n",r:"\r",t:"	"},constructors={},EMPTY_STRING=new String(""),SLASH="\\",firstTokenCtors={"{":Object,"[":Array},hop=Object.hasOwnProperty
return function(t,e){var r,n=nextMatch(t),s=!1
"{"===n?r=builder(e,null):"["===n?r=[]:(r=[],s=!0)
var o,u=[r],a=[e]
for(n=nextMatch(t);null!=n;n=nextMatch(t)){var i
switch(n.charCodeAt(0)){default:i=u[0],i[o||i.length]=+n,o=void 0
break
case 34:if(n=n.substring(1,n.length-1),-1!==n.indexOf(SLASH)&&(n=n.replace(escapeSequence,unescapeOne)),i=u[0],!o){if(!(i instanceof Array)){o=n||EMPTY_STRING,a[0]=i.constructor.$typeDescription?i.constructor.$typeDescription[o]:a[1].arguments[1]
break}o=i.length}i[o]=convert(a[0],n),o=void 0
break
case 91:i=u[0],u.unshift(i[o||i.length]=[]),a.unshift(a[0].arguments[0]),o=void 0
break
case 93:u.shift(),a.shift()
break
case 102:i=u[0],i[o||i.length]=!1,o=void 0
break
case 110:i=u[0],i[o||i.length]=null,o=void 0
break
case 116:i=u[0],i[o||i.length]=!0,o=void 0
break
case 123:i=u[0],u.unshift(i[o||i.length]=builder(a[0])),a.unshift(null),o=void 0
break
case 125:u.shift(),a.shift()}}if(s){if(1!==u.length)throw Error()
r=r[0]}else if(u.length)throw Error()
return r}}()
var stjsAssertHandler=function(t,e,r){throw r+" at "+t},Throwable=function(t,e){"string"==typeof t?(this.detailMessage=t,this.message=t,this.cause=e):this.cause=t}
stjs.extend(Throwable,Error,[],function(t,e){e.detailMessage=null,e.cause=null,e.getMessage=function(){return this.detailMessage},e.getLocalizedMessage=function(){return this.getMessage()},e.getCause=function(){return this.cause==this?null:this.cause},e.toString=function(){var t="Exception",e=this.getLocalizedMessage()
return null!=e?t+": "+e:t},e.getStackTrace=function(){return this.stack},e.printStackTrace=function(){console.error(this.getStackTrace())}},{})
var Exception=function(t,e){Throwable.call(this,t,e)}
stjs.extend(Exception,Throwable,[],function(){},{})
var RuntimeException=function(t,e){Exception.call(this,t,e)}
stjs.extend(RuntimeException,Exception,[],function(){},{})
