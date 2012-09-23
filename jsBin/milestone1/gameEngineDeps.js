(function(b){var a={VERSION:"2.2.0",Result:{SUCCEEDED:1,NOTRANSITION:2,CANCELLED:3,ASYNC:4},Error:{INVALID_TRANSITION:100,PENDING_TRANSITION:200,INVALID_CALLBACK:300},WILDCARD:"*",ASYNC:"async",create:function(g,h){var j=(typeof g.initial=="string")?{state:g.initial}:g.initial;var f=h||g.target||{};var l=g.events||[];var i=g.callbacks||{};var d={};var k=function(m){var p=(m.from instanceof Array)?m.from:(m.from?[m.from]:[a.WILDCARD]);d[m.name]=d[m.name]||{};for(var o=0;o<p.length;o++){d[m.name][p[o]]=m.to||p[o]}};if(j){j.event=j.event||"startup";k({name:j.event,from:"none",to:j.state})}for(var e=0;e<l.length;e++){k(l[e])}for(var c in d){if(d.hasOwnProperty(c)){f[c]=a.buildEvent(c,d[c])}}for(var c in i){if(i.hasOwnProperty(c)){f[c]=i[c]}}f.current="none";f.is=function(m){return this.current==m};f.can=function(m){return !this.transition&&(d[m].hasOwnProperty(this.current)||d[m].hasOwnProperty(a.WILDCARD))};f.cannot=function(m){return !this.can(m)};f.error=g.error||function(o,s,r,n,m,q,p){throw p||q};if(j&&!j.defer){f[j.event]()}return f},doCallback:function(h,f,d,j,i,c){if(f){try{return f.apply(h,[d,j,i].concat(c))}catch(g){return h.error(d,j,i,c,a.Error.INVALID_CALLBACK,"an exception occurred in a caller-provided callback function",g)}}},beforeEvent:function(e,d,g,f,c){return a.doCallback(e,e["onbefore"+d],d,g,f,c)},afterEvent:function(e,d,g,f,c){return a.doCallback(e,e["onafter"+d]||e["on"+d],d,g,f,c)},leaveState:function(e,d,g,f,c){return a.doCallback(e,e["onleave"+g],d,g,f,c)},enterState:function(e,d,g,f,c){return a.doCallback(e,e["onenter"+f]||e["on"+f],d,g,f,c)},changeState:function(e,d,g,f,c){return a.doCallback(e,e.onchangestate,d,g,f,c)},buildEvent:function(c,d){return function(){var i=this.current;var h=d[i]||d[a.WILDCARD]||i;var f=Array.prototype.slice.call(arguments);if(this.transition){return this.error(c,i,h,f,a.Error.PENDING_TRANSITION,"event "+c+" inappropriate because previous transition did not complete")}if(this.cannot(c)){return this.error(c,i,h,f,a.Error.INVALID_TRANSITION,"event "+c+" inappropriate in current state "+this.current)}if(false===a.beforeEvent(this,c,i,h,f)){return a.CANCELLED}if(i===h){a.afterEvent(this,c,i,h,f);return a.NOTRANSITION}var g=this;this.transition=function(){g.transition=null;g.current=h;a.enterState(g,c,i,h,f);a.changeState(g,c,i,h,f);a.afterEvent(g,c,i,h,f)};this.transition.cancel=function(){g.transition=null;a.afterEvent(g,c,i,h,f)};var e=a.leaveState(this,c,i,h,f);if(false===e){this.transition=null;return a.CANCELLED}else{if("async"===e){return a.ASYNC}else{if(this.transition){this.transition()}return a.SUCCEEDED}}}}};if("function"===typeof define){define(function(c){return a})}else{b.StateMachine=a}}(this));
(function(){var p={},n=function(a,g,h){var f=function(b,f,a){var c=[],j=function(b,i){var j=c.length+1;c.push(function(){return f(b,i,function(b){var f=c[j];return!b&&f?f():!b&&!f?a():a(b)})})};if(l(b)&&!o(b))for(var i=0,g=b.length;i<g;i++)j(i,b[i]);else if(k(b)&&!o(b))for(i in b)b.hasOwnProperty(i)&&j(i,b[i]);else return a();return c[0]()};return"undefined"===typeof h?function(b,f){if(l(b)&&!o(b))for(var a=0,c=b.length;a<c;a++)f.apply(b,[a,b[a]]);if(k(b)&&!o(b))for(var j in b)b.hasOwnProperty(j)&&
f.apply(b,[j,b[j]])}.apply(this,arguments):f.apply(this,arguments)},A=function(a,g,h){return Array.prototype.filter.apply(a,[g,h||this])},l=function(a){return"[object Array]"===Object.prototype.toString.call(a)},B=function(a){return"boolean"===typeof a},s=function(a){return"undefined"!==typeof a},o=function(a){if(q(a))return!1;if(null===a)return!0;if(l(a)||"string"===typeof a)return 0===a.length;if(k(a))for(var g in a)if(hasOwnProperty.call(a,g))return!1;return!0},w=function(a,g){if(l(a,g))return a.length!==
g.length?!1:Array.prototype.every.apply(a,[function(b,f){return g[f]===b}]);if(k(a,g)){var h=Object.keys(a),f=Object.keys(g);if(!w(h,f))return!1;for(key in a)if(!g[key]||a[key]!==g[key])return!1;return!0}return!1},t=function(a){return"function"===typeof a},x=function(a){return q(a)&&0===a%1},C=function(a){return null===a},q=function(a){return"number"===typeof a},k=function(a){return"[object Object]"===Object.prototype.toString.call(a)},m=function(a){return"string"===typeof a},u=function(a){return"undefined"===
typeof a},y=function(a,g){for(var h in g)g.hasOwnProperty(h)&&!a.hasOwnProperty(h)&&(a[h]=g[h]);return a},z=function(a,g){for(var h=[],f=0,b=a.length;f<b;f++){var d=a[f][g];-1===h.indexOf(d)&&h.push(d)}return h},D=function(){return!0};(function(){var a=function(f){var b=this,d={singleError:!0,messages:h,cache:!1};n(d,function(a,c){b[a]=k(c)&&f[a]?y(f[a],d[a]):k(c)&&!f[a]?y({},d[a]):s(f[a])?f[a]:d[a]});this.errors=new g(this)};a.prototype.attributes={};a.prototype.addAttribute=function(f,b){return a.prototype.attributes[f]=
b};a.prototype.addAttributeConstructor=function(f,b){return a.prototype.attributes[f]=b()};a.prototype.addAttribute("additionalProperties",function(f,b,d,a,c){var j=this;if(!0===d)return c();var i=Object.keys(b),i=A(i,function(b){return!a.properties[b]});if(o(i))return c();if(!1===d)return i.forEach(function(a){this.addError({property:this.joinPath(f,a),propertyValue:b[a]})},this),c();if(k(d))return n(i,function(a,c,e){return j.validateSchema(b[c],d,f+c,e)},c)});a.prototype.addAttribute("divisibleBy",
function(f,b,a,e,c){if(0===a)throw Error("The value of this attribute should not be 0.");q(b)&&0!==b%a&&this.addError();return c()});a.prototype.addAttribute("enum",function(f,b,a,e,c){-1===a.indexOf(b)&&this.addError();return c()});a.prototype.addAttribute("except",function(f,b,a,e,c){-1!==a.indexOf(b)&&this.addError();return c()});a.prototype.addAttributeConstructor("format",function(){var f={"date-time":{type:"string",pattern:/^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-[0-9]{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/},
date:function(b){return m(b)?b.match(/^\d{4}-(?:0[0-9]{1}|1[0-2]{1})-[0-9]{2}$/):k(b)?"[object Date]"===Object.prototype.toString.call(b):!1},time:{type:"string",pattern:/^\d{2}:\d{2}:\d{2}$/},"utc-milisec":{type:"number"},regex:function(b){return b&&b.test&&b.exec},color:{type:"string"},style:{type:"string"},phone:{type:"number"},uri:{type:"string",pattern:/^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|cat|coop|int|pro|tel|xxx|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2})?)|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/},
email:{type:"string",pattern:/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/},"ip-address":{type:"string",pattern:/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/},ipv6:{type:"string",pattern:/(?:(?:[a-f\d]{1,4}:)*(?:[a-f\d]{1,4}|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(?:(?:[a-f\d]{1,4}:)*[a-f\d]{1,4})?::(?:(?:[a-f\d]{1,4}:)*(?:[a-f\d]{1,4}|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))?)/},
"host-name":{type:"string"},alpha:{required:!0,type:"string",pattern:/^[a-zA-Z]+$/},alphanumeric:{required:!0,type:["string","number"],pattern:/^[a-zA-Z0-9]+$/},decimal:function(b){return!q(b)?!1:(b+"").match(/^[0-9]+(\.[0-9]{1,2})?$/)},percentage:{required:!0,type:["string","number"],pattern:/^-?[0-9]{0,2}(\.[0-9]{1,2})?$|^-?(100)(\.[0]{1,2})?$/,minimum:-100,maximum:100},port:{required:!0,type:["string","number"],pattern:/\:\d+/}};n({url:"uri",ip:"ip-address",ipv4:"ip-address",host:"host-name",hostName:"host-name"},
function(b,a){f[b]=f[a]});return function(b,a,e,c,j){if(k(e))return this.validateProperty(b,a,e,j);if(m(e)&&!Object.prototype.hasOwnProperty.apply(f,[e]))throw Error("The format \u2018"+e+"\u2019 is not supported.");if(m(e)){e=f[e];if(t(e))return e(a)||this.addError(),j();if(k(e))return this.validateProperty(b,a,e,j)}}});a.prototype.addAttribute("length",function(f,b,a,e,c){m(b)&&b.length!==a&&this.addError();return c()});a.prototype.addAttribute("maximum",function(f,b,a,e,c){q(b)&&(e.exclusiveMaximum&&
b>=a||b>a)&&this.addError();return c()});a.prototype.addAttribute("maxItems",function(f,b,a,e,c){l(b)&&b.length>a&&this.addError();return c()});a.prototype.addAttribute("maxLength",function(f,b,a,e,c){m(b)&&b.length>a&&this.addError();return c()});a.prototype.addAttribute("minimum",function(f,b,a,e,c){q(b)&&(e.exclusiveMinimum&&b<=a||b<a)&&this.addError();return c()});a.prototype.addAttribute("minItems",function(f,b,a,e,c){l(b)&&b.length<a&&this.addError();return c()});a.prototype.addAttribute("minLength",
function(f,b,a,e,c){m(b)&&b.length<a&&this.addError();return c()});a.prototype.addAttribute("pattern",function(f,b,a,e,c){m(b)&&!b.match(a)&&this.addError();return c()});(function(){a.prototype.addAttribute("patternProperties",function(f,b,a,e,c){var j=this;if(o(a))return c();var i={},g=Object.keys(a);n(b,function(b){n(g,function(f,c){b.match(RegExp(c))&&(i[b]=a[c])})});if(o(i))return c();n(i,function(a,c,d){return j.validateSchema(b[a],c,j.joinPath(f,a),d)},c)})})();a.prototype.addAttribute("required",
function(a,b,d,e,c){d&&(a=u(b),b=(m(b)||l(b)||k(b))&&o(b),(a||b)&&this.addError());return c()});a.prototype.addAttributeConstructor("type",function(){var a={string:m,number:q,"function":t,"boolean":B,object:k,array:l,integer:x,"int":x,"null":C,any:D};return function(b,d,e,c,j){if(l(e))e.some(function(b){if(!Object.prototype.hasOwnProperty.apply(a,[b]))throw Error("Type \u2018"+e+"\u2019 is not supported.");return a[b](d)})||this.errors.addError();else{if(!Object.prototype.hasOwnProperty.apply(a,[e]))throw Error("Type \u2018"+
e+"\u2019 is not supported.");a[e](d)||this.addError()}return j()}});(function(){a.prototype.addAttribute("uniqueItems",function(a,b,d,e,c){var j=this;n(b,function(c,d){m(d)&&b.indexOf(d)<c&&j.addError();(k(d)||l(d))&&b.forEach(function(b,e){e!==c&&w(d,b)&&j.addError({property:j.joinPath(a,e)})})});return c()})})();var g=function(a){this.length=0;this.errorMessages=a.messages};g.prototype.renderErrorMessage=function(a){var b=this.errorMessages[a.attributeName];return b&&t(b)?b(a.property,a.propertyValue,
a.attributeValue):b&&m(b)?(["property","propertyValue","attributeValue"].forEach(function(d){b=b.replace(RegExp("{{"+d+"}}","g"),a[d])}),b=b.replace(/{{validator}}/g,a.attributeValue),b.replace(/\s+/g," ")):a.message};g.prototype.push=function(a){this[this.length]={property:a.property,propertyValue:a.propertyValue,attributeName:a.attributeName,attributeValue:a.attributeValue,message:this.renderErrorMessage(a),validator:a.attributeName,validatorName:a.attributeName,validatorValue:a.attributeValue};
this.length+=1};g.prototype.getProperties=function(){return z(this,"property")};g.prototype.getMessages=function(){return z(this,"message")};var h={required:function(a){return"The \u2018"+a+"\u2019 property is required."},minLength:function(a,b,d){return["The "+a+" property must be at least "+d+" characters.","The length of the property is "+b.length+"."].join(" ")},maxLength:function(a,b,d){return["The "+a+" property must not exceed "+d+" characters.","The length of the property is "+b.length+"."].join(" ")},
length:function(a,b,d){return["The "+a+" property must be exactly "+d+" characters.","The length of the property is "+b.length+"."].join(" ")},format:function(a,b,d){return["The \u2018"+a+"\u2019 property must be a/an \u2018"+d+"\u2019.","The current value of the property is \u2018"+b+"\u2019"].join(" ")},type:function(a,b,d){return["The \u2018"+a+"\u2019 property must be a/an \u2018"+d+"\u2019.","The type of the property is \u2018"+typeof b+"\u2019"].join(" ")},except:function(){},minimum:function(a,
b,d){return["The minimum value of the \u2018"+a+"\u2019 must be "+d+".","The current value of the property is \u2018"+b+"\u2019"].join(" ")},maximum:function(a,b,d){return["The maximum value of the \u2018"+a+"\u2019 must be "+d+".","The current value of the property is \u2018"+b+"\u2019."].join(" ")},pattern:function(a,b,d){return"The \u2018"+a+"\u2019 does not match the \u2018"+d+"\u2019 pattern."},maxItems:function(a,b,d){return["The \u2018"+a+"\u2019 property must not contain more than \u2018"+
d+"\u2019 items.","Currently it contains \u2018"+b.items+"\u2019 items."].join(" ")},minItems:function(a,b,d){return["The \u2018"+a+"\u2019 property must contain at least \u2018"+d+"\u2019 items.","Currently it contains \u2018"+b.items+"\u2019 items."].join(" ")},divisibleBy:function(a,b,d){return"The \u2018"+a+"\u2019 is not divisible by \u2018"+d+"\u2019."},uniqueItems:function(a){return"All items in the \u2018"+a+"\u2019 property must be unique."},"enum":function(a,b,d){return"Value of the \u2018"+
a+"\u2019 must be "+d.join(" or ")+"."}};a.prototype.getProperty=function(a,b){return a.match(/([a-zA-Z0-9\s]+)/g).reduce(function(a,b){return a&&s(a[b])?a[b]:void 0},b)};a.prototype.joinPath=function(a,b){a=a||"";b+="";return b.match(/^[a-zA-Z]+$/)?a?a+"."+b:b:b.match(/\d+/)?a+"["+b+"]":a+'["'+b+'"]'};a.prototype.validate=function(a,b,d){var e=this;this.instance=a;this.schema=b;var c=function(){return 0!==e.errors.length?d(e.errors):d()};if(-1!=="string,number,function,boolean,integer,int,null".split(",").indexOf(b.type))return this.validateProperty(void 0,
a,b,c);if(-1!==["object","array"].indexOf(b.type)){if(m(a))try{a=JSON.parse(a)}catch(j){}return this.validateSchema(a,b,"",c)}if("any"===b.type||!b.type){if(m(a))try{return a=JSON.parse(a),this.validateSchema(a,b,"",c)}catch(i){}return k(a)||l(a)?this.validateSchema(a,b,"",c):this.validateProperty(void 0,a,b,c)}};a.prototype.validateItems=function(a,b,d,e){var c=this;return l(b.items)?u(b.additionalItems)||!0===b.additionalItems?n(b.items,function(b,e,g){return c.validateSchema(a[b],e,c.joinPath(d,
b),g)},e):n(a,function(a,f,e){if(b.items[a]||k(b.additionalItems))return c.validateSchema(f,b.items[a],c.joinPath(d,a),e);if(!1===b.additionalItems)return c.errors.push({property:c.joinPath(d,a),propertyValue:f,attributeName:"additionalItems",attributeValue:!1}),e()},e):k(b.items)&&a&&!o(a)?n(a,function(e,i,g){return c.validateSchema(a[e],b.items,c.joinPath(d,e),g)},e):e()};a.prototype.validateProperties=function(a,b,d,e){var c=this;return n(b.properties,function(e,i,g){var h="object"===i.type&&i.properties,
k="array"===i.type,m=c.getProperty(e,a),v=c.joinPath(d,e);return h||k?c.validateSchema(m,b.properties[e],v,g):c.validateProperty(v,m,i,g)},e)};a.prototype.validateProperty=function(a,b,d,e){var c=this,g={};"validateItems,validateProperties,validateSchema,validateProperty,getProperty,attributes,errors,joinPath".split(",").forEach(function(a){g[a]=this[a]},c);return!0!==d.required&&u(b)?e():n(c.attributes,function(e,h,l){var n=c.errors.length;g.addError=function(g){return k(g)?c.errors.push({property:g.property||
a,propertyValue:g.propertyValue||b,attributeName:g.attributeName||e,attributeValue:g.attributeValue||d[e],message:g.message||void 0}):c.errors.push({property:a,propertyValue:b,attributeName:e,attributeValue:d[e],message:g})};var o=function(a){return!0===a||m(a)?(g.addError(a),l(!0)):c.errors.length>n&&c.singleError?l(!0):l()};return s(d[e])?h.apply(g,[a,b,d[e],d,o]):l()},e)};a.prototype.validateSchema=function(a,b,d,e){var c=this;return c.validateProperty(d,a,b,function(){return b.properties?c.validateProperties(a,
b,d,e):b.items?c.validateItems(a,b,d,e):e()})};p.json=function(){return{validate:function(f,b,d,e){"function"===typeof d&&(e=d,d={});return(new a(d)).validate(f,b,e)},addAttribute:function(f,b){return a.prototype.addAttribute.apply(a,arguments)},addAttributeConstructor:function(f,b){return a.prototype.addAttributeConstructor.apply(a,arguments)}}}()})();var r=function(a){if(!Object.prototype.hasOwnProperty.apply(p,[a]))throw Error("The \u2018"+a+"\u2019 engine is not supported. Please use a different one.");
return p[a]};r.validate=function(a,g,h,f){var b=p.json;return b.validate.apply(b,arguments)};r.addValidator=function(a,g){var h=p.json;return h.addAttribute.apply(h,arguments)};r.addAttribute=function(a,g){var h=p.json;return h.addAttribute.apply(h,arguments)};r.addAttributeConstructor=function(a,g){var h=p.json;return h.addAttributeConstructor.apply(h,arguments)};"undefined"!==typeof module&&module.exports?module.exports=r:"undefined"!==typeof define?define(function(){return r}):this.amanda=r})();
// javascript-astar
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Includes Binary Heap (with modifications) from Marijn Haverbeke. 
// http://eloquentjavascript.net/appendix2.html


var GraphNodeType = {
  OPEN: 1,
  WALL: 0
};

// Creates a Graph class used in the astar search algorithm.
function Graph(grid) {
  var nodes = [];

  for (var x = 0; x < grid.length; x++) {
    nodes[x] = [];

    for (var y = 0, row = grid[x]; y < row.length; y++) {
      nodes[x][y] = new GraphNode(x, y, row[y]);
    }
  }

  this.input = grid;
  this.nodes = nodes;
}

Graph.prototype.toString = function() {
  var graphString = "\n";
  var nodes = this.nodes;
  var rowDebug, row, y, l;
  for (var x = 0, len = nodes.length; x < len; x++) {
    rowDebug = "";
    row = nodes[x];
    for (y = 0, l = row.length; y < l; y++) {
      rowDebug += row[y].type + " ";
    }
    graphString = graphString + rowDebug + "\n";
  }
  return graphString;
};

function GraphNode(x,y,type) {
  this.data = { };
  this.x = x;
  this.y = y;
  this.pos = {
    x: x,
    y: y
  };
  this.type = type;
}

GraphNode.prototype.toString = function() {
  return "[" + this.x + " " + this.y + "]";
};

GraphNode.prototype.isWall = function() {
  return this.type == GraphNodeType.WALL;
};


function BinaryHeap(scoreFunction){
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);

    // Allow it to sink down.
    this.sinkDown(this.content.length - 1);
  },
  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it bubble up.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }
    return result;
  },
  remove: function(node) {
    var i = this.content.indexOf(node);

    // When it is found, the process seen in 'pop' is repeated
    // to fill up the hole.
    var end = this.content.pop();

    if (i !== this.content.length - 1) {
      this.content[i] = end;

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(i);
      }
      else {
        this.bubbleUp(i);
      }
    }
  },
  size: function() {
    return this.content.length;
  },
  rescoreElement: function(node) {
    this.sinkDown(this.content.indexOf(node));
  },
  sinkDown: function(n) {
    // Fetch the element that has to be sunk.
    var element = this.content[n];

    // When at 0, an element can not sink any further.
    while (n > 0) {

      // Compute the parent element's index, and fetch it.
      var parentN = ((n + 1) >> 1) - 1,
        parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }

      // Found a parent that is less, no need to sink any further.
      else {
        break;
      }
    }
  },
  bubbleUp: function(n) {
    // Look up the target element and its score.
    var length = this.content.length,
      element = this.content[n],
      elemScore = this.scoreFunction(element);

    while(true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) << 1, child1N = child2N - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
          child1Score = this.scoreFunction(child1);

        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore)
          swap = child1N;
      }

      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
          child2Score = this.scoreFunction(child2);
        if (child2Score < (swap === null ? elemScore : child1Score)) {
          swap = child2N;
        }
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }

      // Otherwise, we are done.
      else {
        break;
      }
    }
  }
};
// javascript-astar
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Implements the astar search algorithm in javascript using a binary heap.

var astar = {
  init: function(grid) {
    for(var x = 0, xl = grid.length; x < xl; x++) {
      for(var y = 0, yl = grid[x].length; y < yl; y++) {
        var node = grid[x][y];
        node.f = 0;
        node.g = 0;
        node.h = 0;
        node.cost = node.type;
        node.visited = false;
        node.closed = false;
        node.parent = null;
      }
    }
  },
  heap: function() {
    return new BinaryHeap(function(node) {
      return node.f;
    });
  },
  search: function(grid, start, end, diagonal, heuristic) {
    astar.init(grid);
    heuristic = heuristic || astar.manhattan;
    diagonal = !!diagonal;

    var openHeap = astar.heap();

    openHeap.push(start);

    while(openHeap.size() > 0) {

      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      var currentNode = openHeap.pop();

      // End case -- result has been found, return the traced path.
      if(currentNode === end) {
        var curr = currentNode;
        var ret = [];
        while(curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }
        return ret.reverse();
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.closed = true;

      // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
      var neighbors = astar.neighbors(grid, currentNode, diagonal);

      for(var i=0, il = neighbors.length; i < il; i++) {
        var neighbor = neighbors[i];

        if(neighbor.closed || neighbor.isWall()) {
          // Not a valid node to process, skip to next neighbor.
          continue;
        }

        // The g score is the shortest distance from start to current node.
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
        var gScore = currentNode.g + neighbor.cost;
        var beenVisited = neighbor.visited;

        if(!beenVisited || gScore < neighbor.g) {

          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || heuristic(neighbor.pos, end.pos);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;

          if (!beenVisited) {
            // Pushing to heap will put it in proper place based on the 'f' value.
            openHeap.push(neighbor);
          }
          else {
            // Already seen the node, but since it has been rescored we need to reorder it in the heap
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }

    // No result was found - empty array signifies failure to find path.
    return [];
  },
  manhattan: function(pos0, pos1) {
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

    var d1 = Math.abs (pos1.x - pos0.x);
    var d2 = Math.abs (pos1.y - pos0.y);
    return d1 + d2;
  },
  neighbors: function(grid, node, diagonals) {
    var ret = [];
    var x = node.x;
    var y = node.y;

    // West
    if(grid[x-1] && grid[x-1][y]) {
      ret.push(grid[x-1][y]);
    }

    // East
    if(grid[x+1] && grid[x+1][y]) {
      ret.push(grid[x+1][y]);
    }

    // South
    if(grid[x] && grid[x][y-1]) {
      ret.push(grid[x][y-1]);
    }

    // North
    if(grid[x] && grid[x][y+1]) {
      ret.push(grid[x][y+1]);
    }

    if (diagonals) {

      // Southwest
      if(grid[x-1] && grid[x-1][y-1]) {
        ret.push(grid[x-1][y-1]);
      }

      // Southeast
      if(grid[x+1] && grid[x+1][y-1]) {
        ret.push(grid[x+1][y-1]);
      }

      // Northwest
      if(grid[x-1] && grid[x-1][y+1]) {
        ret.push(grid[x-1][y+1]);
      }

      // Northeast
      if(grid[x+1] && grid[x+1][y+1]) {
        ret.push(grid[x+1][y+1]);
      }

    }

    return ret;
  }
};

