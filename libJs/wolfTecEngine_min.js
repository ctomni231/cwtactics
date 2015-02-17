stjs.ns("wolfTec"),wolfTec.BeanFactory=function(e){this.namespace=e,this.initBeans(),this.solveDependencies()},stjs.extend(wolfTec.BeanFactory,null,[],function(e,t){t.beans=null,t.namespace=null,t.factories=null,t.getBean=function(e){var t=this.beans[e]
return void 0==t&&stjs.exception("Unknown bean name"),t},t.getBeanOfType=function(e){var t=null,n=Object.keys(this.beans)
for(var i in n)if(n.hasOwnProperty(i)&&beans[i]instanceof e)return this.beans[i]
return null==t&&stjs.exception("Unknown bean type"),null},t.getBeansOfInterface=function(){var e,t=[],n=Object.keys(this.beans)
for(var i in n)n.hasOwnProperty(i)&&-1!==beans[i].constructor.$inherit.indexOf(e)&&t.push(beans[i])
return t},t.initBeans=function(){this.beans={}
var e=Object.keys(cwt)
for(var t in e)e.hasOwnProperty(t)&&t.endsWith("Bean")&&(this.beans[t]=new window[this.namespace][t])},t.solveDependencies=function(){var e=Object.keys(this.beans)
for(var t in e)if(e.hasOwnProperty(t)){var n=this.beans[t],i=Object.keys(n)
for(var s in i)if(i.hasOwnProperty(s)){var a=n.constructor.$typeDescription.hasOwnProperty(s)
if(a){var o=n.constructor.$typeDescription[s]
"Logger"==o?n[s]=LogJS.get({name:t,enabled:isDebugEnabled}):o.endsWith("Bean")&&(o=o.substring(o.lastIndexOf(".")+1),n[s]=new this.beans[o])}}}}},{beans:{name:"Map",arguments:[null,"Object"]},factories:{name:"Array",arguments:["wolfTec.FactoryBean"]}},{}),stjs.ns("wolfTec"),wolfTec.EngineOptions=function(){},stjs.extend(wolfTec.EngineOptions,null,[],function(e,t){t.debug=!1,t.namespace=null,t.animationTickTime=0,t.networkMessageBufferSize=0,t.tileSize=0,t.STORAGE_PARAMETER_CACHED_CONTENT=null,t.STORAGE_PARAMETER_MAP_PREFIX=null,t.STORAGE_PARAMETER_IMAGE_PREFIX=null,t.STORAGE_PARAMETER_SAVEGAME_PREFIX=null,t.STORAGE_PARAMETER_INPUT_MAPPING=null,t.STORAGE_PARAMETER_AUDIO_VOLUME=null,t.STORAGE_PARAMETER_APPLICATION_CONFIG=null},{},{}),stjs.ns("wolfTec"),wolfTec.StringKey=function(){},stjs.extend(wolfTec.StringKey,null,[],function(e,t){t.minLength=function(){},t.maxLength=function(){},t.not=function(){}},{},{}),stjs.ns("wolfTec"),wolfTec.CursorHandler=function(){},stjs.extend(wolfTec.CursorHandler,null,[],function(e,t){t.moveCursor=function(){}},{},{}),stjs.ns("wolfTec"),wolfTec.LayerGroup=function(){},stjs.extend(wolfTec.LayerGroup,null,[],function(e,t){t.renderState=function(){}},{},{}),stjs.ns("wolfTec"),wolfTec.Globals=function(){},stjs.extend(wolfTec.Globals,null,[],function(e){e.INACTIVE_ID=-1,e.STORAGE_PARAMETER_CACHED_CONTENT="cwt_gameContent_cached",e.STORAGE_PARAMETER_MAP_PREFIX="cwt_map_",e.STORAGE_PARAMETER_IMAGE_PREFIX="cwt_image_",e.STORAGE_PARAMETER_SAVEGAME_PREFIX="cwt_savegame_",e.STORAGE_PARAMETER_INPUT_MAPPING="cwt_input_mapping",e.STORAGE_PARAMETER_AUDIO_VOLUME="cwt_aduio_volume",e.STORAGE_PARAMETER_APPLICATION_CONFIG="cwt_app_config"},{},{}),stjs.ns("wolfTec"),wolfTec.CircularBuffer=function(e){0>=e&&stjs.exception("size cannot be 0 or lower"),this.index=0,this.size=0,this.data=[],this.maxSize=e},stjs.extend(wolfTec.CircularBuffer,null,[],function(e,t){e.DEFAULT_SIZE=32,t.index=0,t.size=0,t.data=null,t.maxSize=0,t.getSize=function(){return this.size},t.isEmpty=function(){return 0==this.size},t.isFull=function(){return this.size==this.maxSize},t.get=function(e){return(0>e||e>=this.size)&&stjs.exception("illegal index"),this.data[(this.index+e)%this.maxSize]},t.popFirst=function(){0==this.size&&stjs.exception("buffer is empty")
var e=this.data[this.index]
return this.data[this.index]=null,this.size--,this.index++,this.index==this.maxSize&&(this.index=0),e},t.popLast=function(){0==this.size&&stjs.exception("buffer is empty")
var e=(this.index+this.size-1)%this.maxSize,t=this.data[e]
return this.data[e]=null,this.size--,t},t.push=function(e){this.size==this.maxSize&&stjs.exception("buffer is full"),this.data[(this.index+this.size)%this.maxSize]=e,this.size++},t.pushInFront=function(e){this.size==this.maxSize&&stjs.exception("buffer is full")
var t=this.index-1
0>t&&(t=this.maxSize-1),this.data[t]=e,this.index=t,this.size++},t.clear=function(){this.index=0,this.size=0
for(var e=0,t=this.data.length;t>e;e++)this.data[e]=null},e.copyBuffer=function(e,t){t.maxSize!=e.maxSize&&stjs.exception("same size required"),t.clear()
for(var n=0,i=e.size;i>n;n++)t.push(e.get(n))}},{data:{name:"Array",arguments:["T"]}},{}),stjs.ns("wolfTec"),wolfTec.InputBackend=function(){},stjs.extend(wolfTec.InputBackend,null,[],function(e,t){t.update=function(){},t.enable=function(){},t.disable=function(){}},{},{}),stjs.ns("wolfTec"),wolfTec.InputMappable=function(){},stjs.extend(wolfTec.InputMappable,null,[],function(e,t){t.getInputMapping=function(){},t.getInputMappingName=function(){},t.setInputMapping=function(){}},{},{}),stjs.ns("wolfTec"),wolfTec.InputTypeKey=stjs.enumeration("UP","DOWN","LEFT","RIGHT","A","B","HOVER","GENERIC_INPUT"),stjs.ns("wolfTec"),wolfTec.StateMachineBean=function(){this.states={}},stjs.extend(wolfTec.StateMachineBean,null,[],function(e,t){t.log=null,t.jsUtil=null,t.input=null,t.action=null,t.network=null,t.states=null,t.activeState=null,t.getActiveState=function(){return null},t.started=!1,t.addState=function(e,t){this.states.hasOwnProperty(e)&&stjs.exception("StateAlreadyRegistered"),this.states[e]=t},t.timestamp=0,t.stopLoop=!1,t.gameLoop=null,t.init=function(){this.gameLoop=stjs.bind(this,function(){var e=stjs.trunc((new Date).getTime()),t=e-this.timestamp
this.timestamp=e,this.update(t),this.stopLoop?this.stopLoop=!1:this.jsUtil.evalJs("requestAnimationFrame(this.gameLoop)")})},t.update=function(e){if(this.activeState.isAnimationState()&&(this.activeState.update(e,null),this.activeState.render(e)),this.network.hasMessages())return void this.action.invokeAction(this.network.grabMessage())
var t=this.input.grabCommand()
this.activeState.update(e,t),this.activeState.render(e),null!=t&&this.input.releaseAction(t)},t.changeState=function(e){null!=this.activeState&&(this.log.info("leaving step "+this.jsUtil.getBeanName(this.activeState)),this.activeState.exit()),this.setState(e,!0)},t.setState=function(e,t){this.activeState=this.states[e],this.log.info("enter step "+e),t&&this.activeState.enter()},t.startGameloop=function(){this.started&&stjs.exception("Already started"),this.started=!0,this.log.info("Starting state machine"),this.timestamp=stjs.trunc((new Date).getTime()),requestAnimationFrame(this.gameLoop)},t.stopGameloop=function(){this.stopLoop=!0}},{log:"wolfTec.Logger",jsUtil:"wolfTec.JsUtil",input:"wolfTec.InputBean",action:"wolfTec.ActionHandler",network:"wolfTec.NetworkBean",states:{name:"Map",arguments:[null,"wolfTec.State"]},activeState:"wolfTec.State",gameLoop:"Callback0"},{}),stjs.ns("wolfTec"),wolfTec.ActionHandler=function(){},stjs.extend(wolfTec.ActionHandler,null,[],function(e,t){t.invokeAction=function(){}},{},{}),stjs.ns("wolfTec"),wolfTec.JsUtil=function(){},stjs.extend(wolfTec.JsUtil,null,[],function(constructor,prototype){prototype.getPropertyValue=function(){return this.evalJs("object[property]")},prototype.getBeanName=function(){var e=this.evalJs("object['$cwt$beanName']")
return this.evalJs("typeof name == 'string'")?e:(stjs.exception("object seems not to be a bean"),null)},prototype.evalJs=function(code){return eval(code)}},{},{}),stjs.ns("wolfTec"),wolfTec.BrowserHelperBean=function(){},stjs.extend(wolfTec.BrowserHelperBean,null,[],function(e,t){t.convertCanvasToBase64=function(e){return Base64Helper.canvasToBase64(e)},t.convertBase64ToImage=function(){return Base64Helper.base64ToImage(image)},t.getUrlParameter=function(e){var t=getURLQueryParams(document.location.search)[e]
return void 0!==t?t:null},t.doHttpRequest=function(e){var t=new XMLHttpRequest
t.onreadystatechange=function(){if(4==t.readyState)if(4==t.readyState&&200==t.status)if(e.json){var n=null
try{n=JSON.parse(t.responseText)}catch(i){e.error(i)}e.success(n)}else e.success(t.responseText)
else e.error(t.statusText)},t.open("get",e.path+"?_wtEngRnd="+parseInt(1e4*Math.random(),10),!0),t.send()},t.executeSeries=function(e,t){R.series(e,t)},t.objectKeys=function(e){return Object.keys(e)},t.createDomElement=function(e){return document.createElement(e)}},{},{}),stjs.ns("wolfTec"),wolfTec.Injected=function(){},stjs.extend(wolfTec.Injected,null,[],function(e,t){t.nullable=function(){}},{},{}),stjs.ns("wolfTec"),wolfTec.ImageManipulationBean=function(){},stjs.extend(wolfTec.ImageManipulationBean,null,[],function(e,t){t.browser=null,t.getImageData=function(e){var t=this.browser.createDomElement("canvas"),n=t.getContext("2d"),i=e.width,s=e.height
return t.width=i,t.height=s,n.drawImage(e,0,0),n.getImageData(0,0,i,s).data},t.replaceColors=function(e,t,n,i,s){var a=this.browser.createDomElement("canvas"),o=a.getContext("2d"),l=e.width,c=e.height
a.width=l,a.height=c,o.drawImage(e,0,0)
for(var r=o.getImageData(0,0,l,c),u=4*i*n,h=4*s*n,f=0;f<r.height;f++)for(var d=0;d<r.width;d++)for(var T=4*f*r.width+4*d,g=r.data[T],p=r.data[T+1],m=r.data[T+2],w=0,b=4*n;b>w;w+=4){var E=t.data[u+w],y=t.data[u+w+1],I=t.data[u+w+2]
if(E==g&&y==p&&I==m){var S=h+w,A=t.data[S],v=t.data[S+1],x=t.data[S+2]
r.data[T]=A,r.data[T+1]=v,r.data[T+2]=x}}return o.putImageData(r,0,0),a},t.convertImageToBlackMask=function(e){var t=this.browser.createDomElement("canvas"),n=t.getContext("2d"),i=e.width,s=e.height
t.width=i,t.height=s,n.drawImage(e,0,0)
for(var a=n.getImageData(0,0,i,s),o=0;o<a.height;o++)for(var l=0;l<a.width;l++){var c=4*o*a.width+4*l,r=a.data[c+3]
r>0&&(a.data[c]=0,a.data[c+1]=0,a.data[c+2]=0)}return n.putImageData(a,0,0),t},t.flipImage=function(e,t,n){var i=t?-1:1,s=n?-1:1,a=t?-1*e.width:0,o=n?-1*e.height:0,l=this.browser.createDomElement("canvas"),c=l.getContext("2d")
return l.height=e.height,l.width=e.width,c.save(),c.scale(i,s),c.drawImage(e,a,o,e.width,e.height),c.restore(),l},t.cropImage=function(e,t,n,i,s){var a=this.browser.createDomElement("canvas"),o=a.getContext("2d")
return a.width=i,a.height=s,o.drawImage(e,t,n,i,s,0,0,i,s),a},t.cropAndRotate=function(e,t,n,i,s){var a=this.browser.createDomElement("canvas"),o=a.getContext("2d"),l=stjs.trunc(i/2)
return a.height=i,a.width=i,o.save(),o.translate(l,l),o.rotate(s*Math.PI/180),o.translate(-l,-l),o.drawImage(e,t,n,i,i,0,0,i,i),o.restore(),a},t.scaleImageWithScale2x=function(e){var t,n,i,s,a,o,l,c,r,u,h,f,d,T,g,p,m,w,b,E,y,I,S,A,v,x,j,_,k=e.width,L=e.height,C=this.browser.createDomElement("canvas"),B=C.getContext("2d")
C.width=k,C.height=L,B.drawImage(e,0,0)
var N=B.getImageData(0,0,k,L),M=this.browser.createDomElement("canvas"),O=M.getContext("2d")
M.width=2*k,M.height=2*L
for(var R=O.getImageData(0,0,2*k,2*L),F=0;F<N.height;F++)for(var D=0;D<N.width;D++)p=4*F*N.width+4*D,t=N.data[p],n=N.data[p+1],i=N.data[p+2],D>0?(p=4*F*N.width+4*(D-1),d=N.data[p],T=N.data[p+1],g=N.data[p+2]):(d=t,T=n,g=i),F>0?(p=4*(F-1)*N.width+4*D,s=N.data[p],a=N.data[p+1],o=N.data[p+2]):(s=t,a=n,o=i),D<N.height-1?(p=4*(F+1)*N.width+4*D,l=N.data[p],c=N.data[p+1],r=N.data[p+2]):(l=t,c=n,r=i),D<N.width-1?(p=4*F*N.width+4*(D+1),u=N.data[p],h=N.data[p+1],f=N.data[p+2]):(u=t,h=n,f=i),m=t,w=n,b=i,E=t,y=n,I=i,S=t,A=n,v=i,x=t,j=n,_=i,s==l&&a==c&&o==r||d==u&&T==h&&g==f||(s==d&&a==T&&o==g&&(m=d,w=T,b=g),s==u&&a==h&&o==f&&(E=u,y=h,I=f),d==l&&T==c&&g==r&&(S=d,A=T,v=g),l==u&&c==h&&r==f&&(x=u,j=h,_=f)),p=2*F*4*R.width+2*D*4,R.data[p+0]=m,R.data[p+1]=w,R.data[p+2]=b,R.data[p+4]=E,R.data[p+5]=y,R.data[p+6]=I,p=4*(2*F+1)*R.width+2*D*4,R.data[p+0]=S,R.data[p+1]=A,R.data[p+2]=v,R.data[p+4]=x,R.data[p+5]=j,R.data[p+6]=_
return O.putImageData(R,0,0),C=null,M}},{browser:"wolfTec.BrowserHelperBean"},{}),stjs.ns("wolfTec"),wolfTec.StorageBean=function(){},stjs.extend(wolfTec.StorageBean,null,[],function(e,t){e.IOS7_WEBSQL_BUGFIX_SIZE=4,e.DEFAULT_DB_SIZE=50,t.get=function(e,t){localForage.getItem(e,t)},t.set=function(e,t,n){var i=function(i,s){null!=s?localForage.setItem(e,t,n):n(i,null)}
localForage.setItem(e,t,i)},t.keys=function(e){localForage.keys(e)},t.clear=function(e){localForage.clear(e)},t.remove=function(e,t){localForage.removeItem(e,t)}},{},{}),function(){var e={}
e.name="CWT_DATABASE",e.size=1024*wolfTec.StorageBean.DEFAULT_DB_SIZE*1024,localForage.config(e)}(),stjs.ns("wolfTec"),wolfTec.UiField=function(e,t,n,i,s,a,o,l){this.x=e,this.y=t,this.width=n,this.height=i,this.fsize=a,this.style=o,this.inFocus=!1,this.action=l,this.inactive=!1,this.key=s,this.text=s,"/\\n/".split("\n")},stjs.extend(wolfTec.UiField,null,[],function(e,t){e.STYLE_NONE=-1,e.STYLE_NORMAL=0,e.STYLE_S=1,e.STYLE_N=2,e.STYLE_W=3,e.STYLE_E=4,e.STYLE_NE=5,e.STYLE_NW=6,e.STYLE_ES=7,e.STYLE_SW=8,e.STYLE_EW=13,e.STYLE_NS=14,e.STYLE_ESW=9,e.STYLE_NEW=10,e.STYLE_NSW=11,e.STYLE_NES=12,t.x=0,t.y=0,t.width=0,t.height=0,t.text=null,t.action=null,t.inactive=!1,t.inFocus=!1,t.fsize=0,t.style=0,t.key=null,t.isInactive=function(){return this.inactive},t.isPositionInElement=function(e,t){return e>=this.x&&e<this.x+this.width&&t>=this.y&&t<this.y+this.height},t.callAction=function(){null!=this.action&&this.action()},t.erase=function(e){e.clearRect(this.x,this.y,this.width,this.height)},t.draw=function(e){if(this.style!=wolfTec.UiField.STYLE_NONE){switch(e.fillStyle=this.inFocus?"rgb(220,220,220)":"white",e.fillRect(this.x,this.y,this.width,this.height),e.fillStyle="rgb(60,60,60)",this.style){case wolfTec.UiField.STYLE_NORMAL:e.fillRect(this.x+1,this.y+1,this.width-2,this.height-2),e.fillStyle=this.inFocus?"rgb(220,220,220)":"white",e.fillRect(this.x+3,this.y+3,this.width-6,this.height-6)
break
case wolfTec.UiField.STYLE_N:e.fillRect(this.x,this.y+1,this.width,2)
break
case wolfTec.UiField.STYLE_E:e.fillRect(this.x+this.width-3,this.y,2,this.height)
break
case wolfTec.UiField.STYLE_S:e.fillRect(this.x,this.y+this.height-3,this.width,2)
break
case wolfTec.UiField.STYLE_W:e.fillRect(this.x+1,this.y,2,this.height)
break
case wolfTec.UiField.STYLE_NE:e.fillRect(this.x,this.y+1,this.width-1,2),e.fillRect(this.x+this.width-3,this.y+1,2,this.height-1)
break
case wolfTec.UiField.STYLE_NW:e.fillRect(this.x+1,this.y+1,this.width,2),e.fillRect(this.x+1,this.y+1,2,this.height-1)
break
case wolfTec.UiField.STYLE_ES:e.fillRect(this.x+this.width-3,this.y,2,this.height-1),e.fillRect(this.x,this.y+this.height-3,this.width-1,2)
break
case wolfTec.UiField.STYLE_SW:e.fillRect(this.x+1,this.y+this.height-3,this.width-1,2),e.fillRect(this.x+1,this.y,2,this.height-1)
break
case wolfTec.UiField.STYLE_EW:e.fillRect(this.x+this.width-3,this.y,2,this.height),e.fillRect(this.x+1,this.y,2,this.height)
break
case wolfTec.UiField.STYLE_NS:e.fillRect(this.x,this.y+1,this.width,2),e.fillRect(this.x,this.y+this.height-3,this.width,2)
break
case wolfTec.UiField.STYLE_ESW:e.fillRect(this.x+this.width-3,this.y,2,this.height-1),e.fillRect(this.x+1,this.y+this.height-3,this.width-2,2),e.fillRect(this.x+1,this.y,2,this.height-1)
break
case wolfTec.UiField.STYLE_NEW:e.fillRect(this.x+1,this.y+1,this.width-2,2),e.fillRect(this.x+this.width-3,this.y+1,2,this.height-1),e.fillRect(this.x+1,this.y+1,2,this.height-1)
break
case wolfTec.UiField.STYLE_NSW:e.fillRect(this.x+1,this.y+1,this.width-1,2),e.fillRect(this.x+1,this.y+this.height-3,this.width-1,2),e.fillRect(this.x+1,this.y+1,2,this.height-2)
break
case wolfTec.UiField.STYLE_NES:e.fillRect(this.x,this.y+1,this.width-1,2),e.fillRect(this.x+this.width-3,this.y+1,2,this.height-2),e.fillRect(this.x,this.y+this.height-3,this.width-1,2)}if(e.fillStyle="black",null!=this.text&&this.text.length>0){var t=e.measureText(this.text)
e.fillText(this.text,this.x+stjs.trunc(this.width/2)-stjs.trunc(t.width/2),this.y+stjs.trunc(this.height/2)+stjs.trunc(this.fsize/2),this.width)}}}},{action:"Callback0"},{}),stjs.ns("wolfTec"),wolfTec.StorageEntry=function(){},stjs.extend(wolfTec.StorageEntry,null,[],function(e,t){t.key=null,t.value=null},{},{}),stjs.ns("wolfTec"),wolfTec.FactoryBean=function(){},stjs.extend(wolfTec.FactoryBean,null,[],function(e,t){t.create=function(){}},{},{}),stjs.ns("wolfTec"),wolfTec.ValidateKey=function(){},stjs.extend(wolfTec.ValidateKey,null,[],function(e,t){t.minLength=function(){},t.maxLength=function(){}},{},{}),stjs.ns("wolfTec"),wolfTec.InputBackendType=stjs.enumeration("KEYBOARD","GAMEPAD","TOUCH","MOUSE"),stjs.ns("wolfTec"),wolfTec.InjectedMapByInterface=function(){},stjs.extend(wolfTec.InjectedMapByInterface,null,[],null,{},{}),stjs.ns("wolfTec"),wolfTec.AssetItem=function(e,t,n){this.path=e,this.name=t,this.type=n},stjs.extend(wolfTec.AssetItem,null,[],function(e,t){t.path=null,t.name=null,t.type=null},{type:{name:"Enum",arguments:["wolfTec.AssetType"]}},{}),stjs.ns("wolfTec"),wolfTec.AssetType=stjs.enumeration("MAPS","IMAGES","MUSIC","SFX","MODIFICATION","LANGUAGE"),stjs.ns("wolfTec"),wolfTec.StringValue=function(){},stjs.extend(wolfTec.StringValue,null,[],function(e,t){t.minLength=function(){},t.maxLength=function(){},t.not=function(){}},{},{}),stjs.ns("wolfTec"),wolfTec.AudioChannel=stjs.enumeration("CHANNEL_SFX","CHANNEL_BG"),stjs.ns("wolfTec"),wolfTec.Bean=function(){},stjs.extend(wolfTec.Bean,null,[],null,{},{}),stjs.ns("wolfTec"),wolfTec.NetworkMessage=function(){},stjs.extend(wolfTec.NetworkMessage,null,[],function(e,t){t.actionId=0,t.parameters=null},{parameters:{name:"Array",arguments:[null]}},{}),stjs.ns("wolfTec"),wolfTec.AssetLoader=function(){},stjs.extend(wolfTec.AssetLoader,null,[],function(e,t){t.loadAsset=function(){},t.grabAsset=function(){}},{},{}),stjs.ns("wolfTec"),wolfTec.ExternalRequestOptions=function(){},stjs.extend(wolfTec.ExternalRequestOptions,null,[],function(e,t){t.path=null,t.type=null,t.json=!1,t.success=null,t.error=null},{success:{name:"Callback1",arguments:["Object"]},error:{name:"Callback1",arguments:["Object"]}},{}),stjs.ns("wolfTec"),wolfTec.DataObjectValidator=function(){},stjs.extend(wolfTec.DataObjectValidator,null,[],function(e,t){t.validateDataObject=function(){return null}},{},{}),stjs.ns("wolfTec"),wolfTec.AnimationManagerBean=function(){},stjs.extend(wolfTec.AnimationManagerBean,null,[],function(e,t){t.curTime=0,t.layers=null,t.options=null,t.layerStates=null,t.init=function(){this.curTime=0},t.update=function(e){if(this.curTime+=e,this.curTime>this.options.animationTickTime){this.curTime=0
for(var t=0;t<this.layers.length;t++){var n=this.layers[t],i=this.layerStates[t]
i+1<n.getSubStates()?i+=1:i=0,this.layerStates[t]=i,n.isDoubleStepAnimated()?i%2==0&&n.renderState(stjs.trunc(i/2)):n.renderState(i)}}}},{layers:{name:"Array",arguments:["wolfTec.AnimatedLayer"]},options:"wolfTec.EngineOptions",layerStates:{name:"Array",arguments:[null]}},{}),stjs.ns("wolfTec"),wolfTec.MenuRenderer=function(){},stjs.extend(wolfTec.MenuRenderer,null,[],function(e,t){t.renderButton=function(){},t.renderCheckbox=function(){},t.renderField=function(){},t.renderCustomField=function(){}},{},{}),stjs.ns("wolfTec"),wolfTec.PostInitialization=function(){},stjs.extend(wolfTec.PostInitialization,null,[],null,{},{}),stjs.ns("wolfTec"),wolfTec.Direction=stjs.enumeration("UP","DOWN","LEFT","RIGHT"),stjs.ns("wolfTec"),wolfTec.MemoryTools=function(){},stjs.extend(wolfTec.MemoryTools,null,[],function(e,t){t.memoryProfilingEnabled=!1,t.init=function(){this.memoryProfilingEnabled=performance&&performance.memory},t.getHeapSizeLimit=function(){return this.memoryProfilingEnabled?performance.memory.jsHeapSizeLimit:-1},t.getTotalHeapSize=function(){return this.memoryProfilingEnabled?performance.memory.totalJSHeapSize:-1},t.getUsedHeapSize=function(){return this.memoryProfilingEnabled?performance.memory.usedJSHeapSize:-1}},{},{}),stjs.ns("wolfTec"),wolfTec.Sprite=function(e){for(var t=null;e>0;)this.images.push(t),e--},stjs.extend(wolfTec.Sprite,null,[],function(e,t){t.images=null,t.graphic=null,t.spriteHeight=0,t.spriteWidth=0,t.offsetX=0,t.offsetY=0,t.height=0,t.width=0,t.isOverlaySprite=function(){return!1},t.getNumberOfImages=function(){return this.images.length},t.setImage=function(e,t){0>e&&e>=this.images.length&&stjs.exception("IllegalIndex"),this.images[e]=t},t.getImage=function(e){return this.images[e]}},{images:{name:"Array",arguments:["Canvas"]},graphic:"Canvas"},{}),stjs.ns("wolfTec"),wolfTec.Pagination=function(e,t,n){this.page=0,this.list=e
var i=null
for(this.entries=[];t>0;)this.entries.push(i),t--
this.updateFn=n},stjs.extend(wolfTec.Pagination,null,[],function(e,t){t.page=0,t.list=null,t.entries=null,t.updateFn=null,t.selectPage=function(e){var t=this.entries.length
if(!(0>e||e*t>=this.list.length)){this.page=e,e*=t
for(var n=0;t>n;n++)this.entries[n]=e+n>=this.list.length?null:this.list[e+n]
null!=this.updateFn&&this.updateFn()}}},{list:{name:"Array",arguments:["Object"]},entries:{name:"Array",arguments:["Object"]},updateFn:"Callback0"},{}),stjs.ns("wolfTec"),wolfTec.InjectedListByInterface=function(){},stjs.extend(wolfTec.InjectedListByInterface,null,[],null,{},{}),stjs.ns("wolfTec"),wolfTec.ConvertUtility=function(){},stjs.extend(wolfTec.ConvertUtility,null,[],function(e,t){t.strToInt=function(e){return parseInt(e,10)},t.floatToInt=function(e){return parseInt(e,10)}},{},{}),stjs.ns("wolfTec"),wolfTec.ListUtil=function(){},stjs.extend(wolfTec.ListUtil,null,[],function(e,t){t.selectRandom=function(e,t){var n=e.length;(0==n||1==n&&e[0]==t)&&stjs.exception("IllegalArguments")
var i=parseInt(Math.random()*n,10),s=e[i]
return s==t&&(s=e[n-1>i?i+1:i-1]),s}},{},{}),stjs.ns("wolfTec"),wolfTec.InjectedByFactory=function(){},stjs.extend(wolfTec.InjectedByFactory,null,[],null,{},{}),stjs.ns("wolfTec"),wolfTec.IntValue=function(){},stjs.extend(wolfTec.IntValue,null,[],function(e,t){t.max=function(){},t.min=function(){},t.not=function(){}},{},{}),stjs.ns("wolfTec"),wolfTec.ScreenManagerBean=function(){},stjs.extend(wolfTec.ScreenManagerBean,null,[],function(e,t){t.MENU_ENTRY_HEIGHT=0,t.MENU_ENTRY_WIDTH=0,t.options=null,t.layers=null,t.height=0,t.width=0,t.offsetX=0,t.offsetY=0,t.scale=0,t.init=function(){this.MENU_ENTRY_HEIGHT=2*this.options.tileSize,this.MENU_ENTRY_WIDTH=10*this.options.tileSize},t.setCameraPosition=function(){},t.shiftCameraPosition=function(){}},{options:"wolfTec.EngineOptions",layers:{name:"Array",arguments:["wolfTec.Camera"]}},{}),stjs.ns("wolfTec"),wolfTec.Engine=function(e){this.options=e,this.beanFactory=new wolfTec.BeanFactory(null)},stjs.extend(wolfTec.Engine,null,[],function(e,t){t.beanFactory=null,t.options=null},{beanFactory:"wolfTec.BeanFactory",options:"wolfTec.EngineOptions"},{}),stjs.ns("wolfTec"),wolfTec.AnimatedLayer=function(){},stjs.extend(wolfTec.AnimatedLayer,null,[wolfTec.LayerGroup],function(e,t){t.getSubStates=function(){},t.isDoubleStepAnimated=function(){return!1}},{},{}),stjs.ns("wolfTec"),wolfTec.Camera=function(){},stjs.extend(wolfTec.Camera,null,[wolfTec.LayerGroup],function(e,t){t.cv=null,t.ctx=null,t.w=0,t.h=0,t.contexts=null,t.layers=null,t.getZIndex=function(){},t.getLayerCanvasId=function(){},t.onScreenShift=function(){},t.onFullScreenRender=function(){},t.onSetScreenPosition=function(){},t.initialize=function(e,t,n,i){if(this.cv=window.document.getElementById(e),this.cv.width=n,this.cv.height=i,this.ctx=this.cv.getContext("2d"),this.w=n,this.h=i,t>0){this.contexts=[],this.layers=[]
for(var s=0;t>s;){var a=window.document.createElement("canvas")
a.width=n,a.height=i,this.contexts[s]=a.getContext("2d"),this.layers[s]=a,s++}}},t.renderState=function(e){var t=this.getContext(wolfTec.Globals.INACTIVE_ID)
t.clearRect(0,0,this.w,this.h),t.drawImage(this.getLayer(e),0,0,this.w,this.h)},t.getLayer=function(e){return e==wolfTec.Globals.INACTIVE_ID?this.cv:this.layers[e]},t.clear=function(e){this.getContext(e).clearRect(0,0,this.w,this.h)},t.clearAll=function(){for(var e=this.layers.length-1;e>=0;)this.clear(e),e--
this.clear(wolfTec.Globals.INACTIVE_ID)},t.getContext=function(e){return e==wolfTec.Globals.INACTIVE_ID?this.ctx:this.contexts[e]},t.renderSprite=function(){}},{cv:"Canvas",ctx:"CanvasRenderingContext2D",contexts:{name:"Array",arguments:["CanvasRenderingContext2D"]},layers:{name:"Array",arguments:["Canvas"]}},{}),stjs.ns("wolfTec"),wolfTec.InputBean=function(){},stjs.extend(wolfTec.InputBean,null,[],function(e,t){t.log=null,t.stack=null,t.buffer=null,t.blocked=!1,t.genericInput=!1,t.pushAction=function(e,t,n){if(!this.blocked&&!this.buffer.isEmpty()){this.log.info("adding input data "+e+", "+t+", "+n)
var i=this.buffer.popFirst()
i.d1=t,i.d2=n,i.key=e,this.stack.push(i)}},t.hasCommands=function(){return!this.stack.isEmpty()},t.grabCommand=function(){return this.stack.isEmpty()?null:this.stack.popFirst()},t.dropBufferedCommands=function(){for(;!this.stack.isEmpty();)this.releaseAction(this.stack.popLast())},t.codeToChar=function(e){if(e==wolfTec.Globals.INACTIVE_ID)return""
var t=String.fromCharCode(e)
switch(e){case 6:t="Mac"
break
case 8:t="Backspace"
break
case 9:t="Tab"
break
case 13:t="Enter"
break
case 16:t="Shift"
break
case 17:t="CTRL"
break
case 18:t="ALT"
break
case 19:t="Pause/Break"
break
case 20:t="Caps Lock"
break
case 27:t="ESC"
break
case 32:t="Space"
break
case 33:t="Page Up"
break
case 34:t="Page Down"
break
case 35:t="End"
break
case 36:t="Home"
break
case 37:t="Arrow Left"
break
case 38:t="Arrow Up"
break
case 39:t="Arrow Right"
break
case 40:t="Arrow Down"
break
case 43:t="Plus"
break
case 45:t="Insert"
break
case 46:t="Delete"
break
case 91:t="Left Window Key"
break
case 92:t="Right Window Key"
break
case 93:t="Select Key"
break
case 96:t="Numpad 0"
break
case 97:t="Numpad 1"
break
case 98:t="Numpad 2"
break
case 99:t="Numpad 3"
break
case 100:t="Numpad 4"
break
case 101:t="Numpad 5"
break
case 102:t="Numpad 6"
break
case 103:t="Numpad 7"
break
case 104:t="Numpad 8"
break
case 105:t="Numpad 9"
break
case 106:t="*"
break
case 107:t="+"
break
case 109:t="-"
break
case 110:t=";"
break
case 111:t="/"
break
case 112:t="F1"
break
case 113:t="F2"
break
case 114:t="F3"
break
case 115:t="F4"
break
case 116:t="F5"
break
case 117:t="F6"
break
case 118:t="F7"
break
case 119:t="F8"
break
case 120:t="F9"
break
case 121:t="F10"
break
case 122:t="F11"
break
case 123:t="F12"
break
case 144:t="Num Lock"
break
case 145:t="Scroll Lock"
break
case 186:t=";"
break
case 187:t="="
break
case 188:t=","
break
case 189:t="-"
break
case 190:t="."
break
case 191:t="/"
break
case 192:t="`"
break
case 219:t="["
break
case 220:t="\\"
break
case 221:t="]"
break
case 222:t="'"}return t},t.releaseAction=function(e){this.buffer.push(e)}},{log:"wolfTec.Logger",stack:{name:"wolfTec.CircularBuffer",arguments:["wolfTec.InputData"]},buffer:{name:"wolfTec.CircularBuffer",arguments:["wolfTec.InputData"]}},{}),stjs.ns("wolfTec"),wolfTec.InputMappingManagerBean=function(){},stjs.extend(wolfTec.InputMappingManagerBean,null,[],function(e,t){t.log=null,t.storage=null,t.browser=null,t.mappables=null,t.saveConfig=function(e){for(var t={},n=0;n<this.mappables.length;n++)t[this.mappables[n].getInputMappingName()]=this.mappables[n].getInputMapping()
this.storage.set(wolfTec.Globals.STORAGE_PARAMETER_INPUT_MAPPING,t,stjs.bind(this,function(t,n){null!=n?this.log.error("SavingInputMappingError"):(this.log.info("Successfully saved user input mappings"),e())}))},t.loadConfig=function(e){this.storage.get(wolfTec.Globals.STORAGE_PARAMETER_INPUT_MAPPING,stjs.bind(this,function(t){if(null!=t.value)for(var n=t.value,i=this.browser.objectKeys(n),s=0;s<i.length;s++)for(var a=i[s],o=0;o<this.mappables.length;o++)if(this.mappables[o].getInputMappingName()==a){this.mappables[o].setInputMapping(n[a])
break}this.log.info("Successfully load user input mappings"),e()}))}},{log:"wolfTec.Logger",storage:"wolfTec.StorageBean",browser:"wolfTec.BrowserHelperBean",mappables:{name:"Array",arguments:["wolfTec.InputMappable"]}},{}),stjs.ns("wolfTec"),wolfTec.ConnectedTile=function(e,t){this.desc=e,this.connection=t},stjs.extend(wolfTec.ConnectedTile,null,[],function(e,t){t.desc=null,t.connection=null,t.grabShortKey=function(e){return this.desc.hasOwnProperty(e)?this.desc[e]:""},t.getVariant=function(e,t,n,i,s,a,o,l){e=this.grabShortKey(e),t=this.grabShortKey(t),n=this.grabShortKey(n),i=this.grabShortKey(i),s=this.grabShortKey(s),a=this.grabShortKey(a),o=this.grabShortKey(o),l=this.grabShortKey(l)
for(var c=0,r=this.connection.length;r>c;c++){var u=this.connection[c]
if(5==u.length){if(""!=u[1]&&u[1]!=e)continue
if(""!=u[2]&&u[2]!=t)continue
if(""!=u[3]&&u[3]!=n)continue
if(""!=u[4]&&u[4]!=i)continue}else{if(""!=u[1]&&u[1]!=e)continue
if(""!=u[2]&&u[2]!=s)continue
if(""!=u[3]&&u[3]!=t)continue
if(""!=u[4]&&u[4]!=a)continue
if(""!=u[5]&&u[5]!=n)continue
if(""!=u[6]&&u[6]!=o)continue
if(""!=u[7]&&u[7]!=i)continue
if(""!=u[8]&&u[8]!=l)continue}return Integer.parseInt(""+u[0])}return wolfTec.Globals.INACTIVE_ID}},{desc:{name:"Map",arguments:[null,null]},connection:{name:"Array",arguments:[{name:"Array",arguments:[null]}]}},{}),stjs.ns("wolfTec"),wolfTec.MoveableMatrix=function(e){this.data=[]
for(var t=0;e>t;t++){this.data.push([])
for(var n=0;e>n;n++)this.data[t][n]=wolfTec.Globals.INACTIVE_ID}},stjs.extend(wolfTec.MoveableMatrix,null,[],function(e,t){t.sideLen=0,t.centerX=0,t.centerY=0,t.defaultValue=0,t.data=null,t.getCenterX=function(){return this.centerX},t.getCenterY=function(){return this.centerY},t.setCenter=function(e,t,n){this.centerX=Math.max(0,e-(this.sideLen-1)),this.centerY=Math.max(0,t-(this.sideLen-1)),this.defaultValue=n
for(var i=0;i<this.sideLen;i++)for(var s=0;s<this.sideLen;s++)this.data[i][s]=n},t.getValue=function(e,t){return e-=this.centerX,t-=this.centerY,0>e||0>t||e>=this.sideLen||t>=this.sideLen?this.defaultValue:this.data[e][t]},t.setValue=function(e,t,n){e-=this.centerX,t-=this.centerY,0>e||0>t||e>=this.sideLen||t>=this.sideLen?stjs.exception("IndexOutOfBounds"):this.data[e][t]=n},t.reset=function(){this.setCenter(0,0,this.defaultValue)},t.setAllValuesTo=function(e,t){for(var n=0;n<this.sideLen;n++)for(var i=0;i<this.sideLen;i++)this.data[n][i]!=t&&(this.data[n][i]=e)},t.onAllValidPositions=function(e,t,n,i){for(var s=0;s<this.sideLen;s++)for(var a=0;a<this.sideLen;a++){var o=this.data[s][a]
o>=e&&t>=o&&n(s,a,o,i)}},t.nextRandomPosition=function(e,t,n){for(var i=parseInt(Math.random()*this.sideLen,10),s=0;s<this.sideLen;s++)for(var a=0;a<this.sideLen;a++)if(this.data[s][a]>=n&&(i--,0>i))return e(s,a,t),!0
return!1},t.nextValidPosition=function(e,t,n,i,s,a){e-=this.centerX,t-=this.centerY,(0>e||0>t||e>=this.sideLen||t>=this.sideLen)&&(i?(e=this.sideLen-1,t=this.sideLen-1):(e=0,t=0))
var o=i?-1:1
for(t+=o;i?e>=0:e<this.sideLen;e+=o){for(;i?t>=0:t<this.sideLen;t+=o)if(this.data[e][t]>=n)return void s(e,t,a)
t=i?this.sideLen-1:0}},t.hasActiveNeighbour=function(e,t){return e-=this.centerX,t-=this.centerY,(0>e||0>t||e>=this.sideLen||t>=this.sideLen)&&stjs.exception("IndexOutOfBounds"),e>0&&this.data[e-1][t]>0||t>0&&this.data[e][t-1]>0||e<this.sideLen-1&&this.data[e+1][t]>0||t<this.sideLen-1&&this.data[e][t+1]>0}},{data:{name:"Array",arguments:[{name:"Array",arguments:[null]}]}},{}),stjs.ns("wolfTec"),wolfTec.NetworkBean=function(){},stjs.extend(wolfTec.NetworkBean,null,[],function(e,t){e.log=null,t.buffer=null,t.gameId=-1,t.clientId=-1,t.connect=function(){wolfTec.NetworkBean.log.error("NotImplementedYetException")},t.disconnect=function(){wolfTec.NetworkBean.log.error("NotImplementedYetException")},t.isConnected=function(){return this.gameId!=wolfTec.Globals.INACTIVE_ID},t.isGameHost=function(){return this.gameId==wolfTec.Globals.INACTIVE_ID||this.clientId!=wolfTec.Globals.INACTIVE_ID},t.grabMessage=function(){return wolfTec.NetworkBean.log.error("NotImplementedYetException"),null},t.sendMessage=function(){wolfTec.NetworkBean.log.error("NotImplementedYetException")},t.hasMessages=function(){return wolfTec.NetworkBean.log.error("NotImplementedYetException"),!1}},{log:"wolfTec.Logger",buffer:{name:"wolfTec.CircularBuffer",arguments:["wolfTec.NetworkMessage"]}},{}),stjs.ns("wolfTec"),wolfTec.InputData=function(){},stjs.extend(wolfTec.InputData,null,[],function(e,t){t.key=null,t.d1=0,t.d2=0,t.reset=function(){this.key=null,this.d1=wolfTec.Globals.INACTIVE_ID,this.d2=wolfTec.Globals.INACTIVE_ID}},{key:{name:"Enum",arguments:["wolfTec.InputTypeKey"]}},{}),stjs.ns("wolfTec"),wolfTec.TouchInputBean=function(){},stjs.extend(wolfTec.TouchInputBean,null,[wolfTec.InputBackend],function(e,t){e.EVENT_TOUCH_START="touchstart",e.EVENT_TOUCH_MOVE="touchmove",e.EVENT_TOUCH_END="touchend",t.log=null,t.input=null,t.finger1_startX=0,t.finger1_startY=0,t.finger1_endX=0,t.finger1_endY=0,t.finger2_startX=0,t.finger2_startY=0,t.finger2_endX=0,t.finger2_endY=0,t.drag_inDrag=0,t.drag_timeDifference=0,t.pinchDistance_start=0,t.pinchDistance_end=0,t.timestamp=0,t.touchStartHandler=null,t.touchMoveHandler=null,t.touchEndHandler=null,t.init=function(){this.touchStartHandler=stjs.bind(this,function(e){if(e.preventDefault(),this.finger1_startX=e.touches[0].clientX,this.finger1_startY=e.touches[0].clientY,this.finger1_endX=this.finger1_startX,this.finger1_endY=this.finger1_startY,this.drag_inDrag=0,2===e.touches.length){this.finger2_startX=e.touches[1].clientX,this.finger2_startY=e.touches[1].clientY,this.finger2_endX=this.finger2_startX,this.finger2_endY=this.finger2_startY
var t=stjs.trunc(Math.abs(this.finger1_startX-this.finger2_startX)),n=stjs.trunc(Math.abs(this.finger1_startY-this.finger2_startY))
this.pinchDistance_start=stjs.trunc(Math.sqrt(t*t+n*n))}else this.finger2_startX=-1
this.timestamp=e.timeStamp}),this.touchMoveHandler=stjs.bind(this,function(e){if(e.preventDefault(),this.finger1_endX=e.touches[0].clientX,this.finger1_endY=e.touches[0].clientY,2==e.touches.length){this.finger2_endX=e.touches[1].clientX,this.finger2_endY=e.touches[1].clientY
var t=stjs.trunc(Math.abs(this.finger1_startX-this.finger2_startX)),n=stjs.trunc(Math.abs(this.finger1_startY-this.finger2_startY))
this.pinchDistance_end=stjs.trunc(Math.sqrt(t*t+n*n))}else this.finger2_startX=-1
var t=stjs.trunc(Math.abs(this.finger1_startX-this.finger1_endX)),n=stjs.trunc(Math.abs(this.finger1_startY-this.finger1_endY)),i=stjs.trunc(Math.sqrt(t*t+n*n)),s=stjs.trunc(e.timeStamp)-this.timestamp
i>16&&s>300&&(this.drag_inDrag=1,this.drag_timeDifference>75?(this.drag_timeDifference=0,this.finger1_startX=this.finger1_endX,this.finger1_startY=this.finger1_endY):this.drag_timeDifference=this.drag_timeDifference+s)}),this.touchEndHandler=stjs.bind(this,function(e){e.preventDefault()
{var t=stjs.trunc(Math.abs(this.finger1_startX-this.finger1_endX)),n=stjs.trunc(Math.abs(this.finger1_startY-this.finger1_endY))
stjs.trunc(Math.sqrt(t*t+n*n)),stjs.trunc(e.timeStamp)-this.timestamp}-1!=this.finger2_startX&&Math.abs(this.pinchDistance_end-this.pinchDistance_start)<=32})},t.enable=function(){this.log.info("disable touch input"),document.addEventListener(EVENT_TOUCH_START,this.touchStartHandler,!1),document.addEventListener(EVENT_TOUCH_MOVE,this.touchMoveHandler,!1),document.addEventListener(EVENT_TOUCH_END,this.touchEndHandler,!1)},t.disable=function(){this.log.info("enable touch input"),document.removeEventListener(EVENT_TOUCH_START,this.touchStartHandler,!1),document.removeEventListener(EVENT_TOUCH_MOVE,this.touchMoveHandler,!1),document.removeEventListener(EVENT_TOUCH_END,this.touchEndHandler,!1)}},{log:"wolfTec.Logger",input:"wolfTec.InputBean",touchStartHandler:{name:"Callback1",arguments:["Object"]},touchMoveHandler:{name:"Callback1",arguments:["Object"]},touchEndHandler:{name:"Callback1",arguments:["Object"]}},{}),stjs.ns("wolfTec"),wolfTec.GamePadInputBean=function(){},stjs.extend(wolfTec.GamePadInputBean,null,[wolfTec.InputBackend,wolfTec.InputMappable],function(e,t){t.vendorAPI=!1,t.log=null,t.input=null,t.mapping=null,t.enabled=!1,t.prevTimestamps=null,t.init=function(){this.mapping={},this.mapping[wolfTec.InputTypeKey.A.name()]=0,this.mapping[wolfTec.InputTypeKey.B.name()]=1,this.vendorAPI=void 0===navigator.getGamepads},t.getInputMapping=function(){return this.mapping},t.getInputMappingName=function(){return"gamepad"},t.setInputMapping=function(e){this.mapping=e},t.update=function(){if(this.enabled)for(var e=vendorAPI?navigator.webkitGetGamepads():navigator.getGamepads(),t=0,n=4;n>t;t++){var i=e[t]
if(null!=i){var s=prevTimestamps[t]==i.timestamp
s||(this.prevTimestamps[t]=i.timestamp,this.input.genericInput?this.handleGenericInput(i):this.handleInput(i))}}},t.handleGenericInput=function(e){for(var t=e.elements,n=0;13>n;n++)if(1==t[n])return void this.input.pushAction(wolfTec.InputTypeKey.GENERIC_INPUT,n,wolfTec.Globals.INACTIVE_ID)},t.handleInput=function(e){var t=null,n=e.buttons,i=e.axes
1==n[this.mapping.A]?t=wolfTec.InputTypeKey.A:1==n[this.mapping.B]?t=wolfTec.InputTypeKey.B:i[1]<-.5?t=wolfTec.InputTypeKey.UP:i[1]>.5?t=wolfTec.InputTypeKey.DOWN:i[0]<-.5?t=wolfTec.InputTypeKey.LEFT:i[0]>.5&&(t=wolfTec.InputTypeKey.RIGHT),null!=t&&this.input.pushAction(t,wolfTec.Globals.INACTIVE_ID,wolfTec.Globals.INACTIVE_ID)},t.enable=function(){this.log.info("enable gamepad input"),this.enabled=!0},t.disable=function(){this.log.info("disable gamepad input"),this.enabled=!1},t.saveConfig=function(){},t.loadConfig=function(){}},{log:"wolfTec.Logger",input:"wolfTec.InputBean",mapping:{name:"Map",arguments:[null,null]},prevTimestamps:{name:"Array",arguments:[null]}},{}),stjs.ns("wolfTec"),wolfTec.MouseInputBean=function(){},stjs.extend(wolfTec.MouseInputBean,null,[wolfTec.InputBackend],function(e,t){t.log=null,t.input=null,t.mouseUpEvent=null,t.mouseMoveEvent=null,t.init=function(){this.mouseUpEvent=stjs.bind(this,function(e){null==e&&(e=window.event)
var t=null
switch(e.which){case 1:t=wolfTec.InputTypeKey.A
break
case 3:t=wolfTec.InputTypeKey.B}return null!=t?(this.input.pushAction(t,wolfTec.Globals.INACTIVE_ID,wolfTec.Globals.INACTIVE_ID),!0):!1}),this.mouseMoveEvent=function(e){null==e&&(e=window.event)
var t,n
return"number"===e.offsetX?(t=e.offsetX,n=e.offsetY):(t=e.layerX,n=e.layerY),!0}},t.enable=function(){this.log.info("disable mouse input"),targetElement.onmousemove=this.mouseMoveEvent,targetElement.onmouseup=this.mouseUpEvent},t.disable=function(){this.log.info("disable mouse input"),targetElement.onmousemove=null,targetElement.onmouseup=null}},{log:"wolfTec.Logger",input:"wolfTec.InputBean",mouseUpEvent:{name:"Function1",arguments:["DOMEvent",null]},mouseMoveEvent:{name:"Function1",arguments:["DOMEvent",null]}},{}),stjs.ns("wolfTec"),wolfTec.ButtonGroup=function(){this.elements=[],this.selectedElement=wolfTec.Globals.INACTIVE_ID},stjs.extend(wolfTec.ButtonGroup,null,[],function(e,t){t.elements=null,t.selectedElement=0,t.addElement=function(e){this.elements.push(e),this.selectedElement==wolfTec.Globals.INACTIVE_ID&&null!=e.action&&(this.elements[this.elements.length-1].inFocus=!0,this.selectedElement=this.elements.length-1)},t.activeButton=function(){return this.elements[this.selectedElement]},t.getButtonByKey=function(e){for(var t=0,n=this.elements.length;n>t;t++)if(this.elements[t].key==e)return this.elements[t]
return null},t.getButtonsByReg=function(e){for(var t=[],n=0,i=this.elements.length;i>n;n++)e.test(this.elements[n].key)&&t.push(this.elements[n])
return t},t.updateIndex=function(e,t){for(var n=0,i=this.elements.length;i>n;n++)if(null!=this.elements[n].action&&!this.elements[n].inactive&&this.elements[n].isPositionInElement(e,t))return n==this.selectedElement?!1:(this.elements[this.selectedElement].inFocus=!1,this.selectedElement=n,this.elements[this.selectedElement].inFocus=!0,!0)
return!1},t.setIndex=function(e){0>e&&e>=this.elements.length&&stjs.exception(""),this.elements[this.selectedElement].inFocus=!1,this.selectedElement=e,this.elements[this.selectedElement].inFocus=!0},t.isInactive=function(){return!1},t.handleInput=function(e){var t=!0
switch(this.elements[this.selectedElement].inFocus=!1,e.key){case wolfTec.InputTypeKey.UP:case wolfTec.InputTypeKey.LEFT:do this.selectedElement--,this.selectedElement<0&&(this.selectedElement=this.elements.length-1)
while(null==this.elements[this.selectedElement].action||this.elements[this.selectedElement].isInactive())
break
case wolfTec.InputTypeKey.RIGHT:case wolfTec.InputTypeKey.DOWN:do this.selectedElement++,this.selectedElement>=this.elements.length&&(this.selectedElement=0)
while(null==this.elements[this.selectedElement].action||this.elements[this.selectedElement].isInactive())
break
default:t=!1}return this.elements[this.selectedElement].inFocus=!0,t},t.draw=function(e){for(var t=0,n=this.elements.length;n>t;t++){var i=this.elements[t]
i.isInactive()||i.draw(e)}}},{elements:{name:"Array",arguments:["wolfTec.UiField"]}},{}),stjs.ns("wolfTec"),wolfTec.State=function(){},stjs.extend(wolfTec.State,null,[],function(e,t){e.statemachine=null,e.jsUtil=null,e.log=null,t.isAnimationState=function(){return!1},t.changeState=function(e){wolfTec.State.statemachine.changeState(wolfTec.State.jsUtil.getBeanName(e))},t.changeStateById=function(e){wolfTec.State.statemachine.changeState(e)},t.genericInput=function(){},t.exit=function(){},t.enter=function(){},t.update=function(e,t){this.evalInput(t)},t.evalInput=function(e){if(null!=e)switch(e.key){case wolfTec.InputTypeKey.LEFT:this.keyLeft()
break
case wolfTec.InputTypeKey.RIGHT:this.keyRight()
break
case wolfTec.InputTypeKey.UP:this.keyUp()
break
case wolfTec.InputTypeKey.DOWN:this.keyDown()
break
case wolfTec.InputTypeKey.A:this.keyAction()
break
case wolfTec.InputTypeKey.B:this.keyCancel()}},t.render=function(){},t.keyUp=function(){},t.keyDown=function(){},t.keyLeft=function(){},t.keyRight=function(){},t.keyAction=function(){},t.keyCancel=function(){}},{statemachine:"wolfTec.StateMachineBean",jsUtil:"wolfTec.JsUtil",log:"wolfTec.Logger"},{}),stjs.ns("wolfTec"),wolfTec.CheckboxField=function(e,t,n,i,s,a,o){wolfTec.UiField.call(this,e,t,n,i,s,a,o,null)
var l=this
this.action=function(){l.checked=!l.checked},this.text="",this.checked=!1},stjs.extend(wolfTec.CheckboxField,wolfTec.UiField,[],function(e,t){t.checked=!1,t.draw=function(e){wolfTec.UiField.prototype.draw.call(this,e),e.fillStyle="black",e.fillRect(this.x+4,this.y+4,this.width-8,this.height-8),e.fillStyle=this.checked?"rgb(60,60,60)":"white",e.fillRect(this.x+5,this.y+5,this.width-10,this.height-10)}},{action:"Callback0"},{}),stjs.ns("wolfTec"),wolfTec.CustomizableField=function(e,t,n,i,s,a){wolfTec.UiField.call(this,e,t,n,i,s,0,wolfTec.UiField.STYLE_NORMAL,null),this.text="",this.drawFn=a},stjs.extend(wolfTec.CustomizableField,wolfTec.UiField,[],function(e,t){t.drawFn=null,t.draw=function(e){this.drawFn(e)}},{drawFn:{name:"Callback1",arguments:["CanvasRenderingContext2D"]},action:"Callback0"},{}),stjs.ns("wolfTec"),wolfTec.DefaultFactory=function(){},stjs.extend(wolfTec.DefaultFactory,null,[wolfTec.FactoryBean],function(e,t){t.options=null,t.jsUtil=null,t.create=function(e,t){if(t==wolfTec.Logger){{this.options.debug}return this.jsUtil.evalJs("LogJS.get({name: beanName, enabled: isDebug})")}return t==Array?this.jsUtil.evalJs("[]"):t==Map?this.jsUtil.evalJs("{}"):null}},{options:"wolfTec.EngineOptions",jsUtil:"wolfTec.JsUtil"},{}),stjs.ns("wolfTec"),wolfTec.KeyboardInputBean=function(){},stjs.extend(wolfTec.KeyboardInputBean,null,[wolfTec.InputBackend,wolfTec.InputMappable],function(e,t){t.CONSOLE_TOGGLE_KEY=192,t.log=null,t.input=null,t.stm=null,t.mapping=null,t.keyboardHandler=null,t.init=function(){this.mapping={},this.mapping[wolfTec.InputTypeKey.UP.name()]=38,this.mapping[wolfTec.InputTypeKey.DOWN.name()]=40,this.mapping[wolfTec.InputTypeKey.LEFT.name()]=37,this.mapping[wolfTec.InputTypeKey.RIGHT.name()]=39,this.mapping[wolfTec.InputTypeKey.A.name()]=13,this.mapping[wolfTec.InputTypeKey.B.name()]=8,this.keyboardHandler=stjs.bind(this,function(e){var t=e.keyCode
if(this.input.genericInput)this.stm.getActiveState().genericInput(wolfTec.InputBackendType.KEYBOARD,t)
else if(t==this.CONSOLE_TOGGLE_KEY)this.log.error("NotImplementedYet")
else for(var n in wolfTec.InputTypeKey.values())if(this.mapping[n.name()]==t)return this.input.pushAction(n,-1,-1),!0
return!1})},t.getInputMapping=function(){return this.mapping},t.getInputMappingName=function(){return"keyboard"},t.setInputMapping=function(e){this.mapping=e},t.enable=function(){this.log.info("disable keyboard input"),targetElement.onkeydown=this.keyboardHandler},t.disable=function(){this.log.info("disable keyboard input"),targetElement.onkeydown=null}},{log:"wolfTec.Logger",input:"wolfTec.InputBean",stm:"wolfTec.StateMachineBean",mapping:{name:"Map",arguments:[null,null]},keyboardHandler:{name:"Function1",arguments:["DOMEvent",null]}},{}),stjs.ns("wolfTec"),wolfTec.AssetLoadingManagerBean=function(){},stjs.extend(wolfTec.AssetLoadingManagerBean,null,[],function(e,t){t.log=null,t.loaderListeners=null,t.browser=null,t.storage=null,t.completed=!1,t.loadModification=null,t.init=function(){this.loadModification=function(){}},t.load=function(e){this.log.info("Start loading game content")
var t=stjs.bind(this,function(){this.log.info("Completed loading game content"),e()})
this.storage.get(wolfTec.Globals.STORAGE_PARAMETER_CACHED_CONTENT,stjs.bind(this,function(e){null!=e.value?this.grabAndCacheContent(stjs.bind(this,function(){this.loadContent(t)})):this.loadContent(t)}))},t.grabAndCacheContent=function(){},t.loadContent=function(){var e=[]
e.push(stjs.bind(this,function(e){return this.publishLoadEvent(new wolfTec.AssetItem("",null,wolfTec.AssetType.MODIFICATION),e)}))},t.publishGrabAndCacheEvent=function(){},t.publishLoadEvent=function(){},t.publishEventTo=function(){},t.isComplete=function(){return this.completed}},{log:"wolfTec.Logger",loaderListeners:{name:"Array",arguments:["wolfTec.AssetLoader"]},browser:"wolfTec.BrowserHelperBean",storage:"wolfTec.StorageBean",loadModification:{name:"Callback1",arguments:["Callback"]}},{}),stjs.ns("wolfTec"),wolfTec.VolumeManagerBean=function(){},stjs.extend(wolfTec.VolumeManagerBean,null,[],function(e,t){t.log=null,t.storage=null,t.audio=null,t.saveConfig=function(e){var t={}
t.bg=this.audio.getVolume(wolfTec.AudioChannel.CHANNEL_BG),t.sfx=this.audio.getVolume(wolfTec.AudioChannel.CHANNEL_SFX),this.storage.set(wolfTec.Globals.STORAGE_PARAMETER_AUDIO_VOLUME,t,stjs.bind(this,function(t,n){null!=n?this.log.error("SavingVolumeConfigException"):e()}))},t.loadConfig=function(e){this.storage.get("",stjs.bind(this,function(t){null!=t.value&&(this.audio.setVolume(wolfTec.AudioChannel.CHANNEL_BG,t.value.bg),this.audio.setVolume(wolfTec.AudioChannel.CHANNEL_SFX,t.value.sfx)),e()}))}},{log:"wolfTec.Logger",storage:"wolfTec.StorageBean",audio:"wolfTec.AudioBean"},{}),stjs.ns("wolfTec"),wolfTec.AudioBean=function(){},stjs.extend(wolfTec.AudioBean,null,[wolfTec.AssetLoader],function(e,t){e.MUSIC_KEY="MUSIC_",e.DEFAULT_SFX_VOL=1,e.DEFAULT_MUSIC_VOL=.5,t.log=null,t.storage=null,t.browser=null,t.apiStatus=0,t.sfxNode=null,t.musicNode=null,t.context=null,t.buffer=null,t.musicInLoadProcess=!1,t.musicConnector=null,t.musicID=null,t.musicPlayCallback=null,t.musicLoadCallback=null,t.init=function(){this.decodeAssetErrorCb=stjs.bind(this,function(e){return this.log.error(e)}),this.musicPlayCallback=stjs.bind(this,function(){this.musicConnector=this.playSoundOnGainNode(this.musicNode,this.buffer,!0),this.musicInLoadProcess=!1}),this.musicLoadCallback=function(){this.context.decodeAudioData(data,this.musicPlayCallback,this.decodeAssetErrorCb)}
try{this.log.info("Initialize.."),window.hasOwnProperty("AudioContext")?this.context=window.AudioContext:window.hasOwnProperty("webkitAudioContext")?this.context=window.webkitAudioContext:stjs.exception("noWebKitFound"),this.sfxNode=this.createSoundNode(wolfTec.AudioBean.DEFAULT_SFX_VOL),this.musicNode=this.createSoundNode(wolfTec.AudioBean.DEFAULT_MUSIC_VOL),this.buffer={},this.log.info("..done")}catch(e){this.log.error("..failed due => "+e)}},t.playNullSound=function(){null!=this.context&&this.playSoundOnGainNode(this.sfxNode,context.createBuffer(1,1,22050),!1)},t.playSFX=function(e){null!=this.context&&this.playSoundOnGainNode(this.sfxNode,this.buffer[e],!1)},t.playBG=function(e){return null==this.context||this.musicInLoadProcess?!1:this.musicID==e?!1:(null!=this.musicConnector&&this.stopBG(),this.musicInLoadProcess=!0,this.musicID=e,this.storage.get(wolfTec.AudioBean.MUSIC_KEY+e,this.musicLoadCallback),!0)},t.stopBG=function(){return null==this.context||this.musicInLoadProcess?!1:(null!=this.musicConnector&&(1==this.apiStatus?musicConnector.stop(0):musicConnector.noteOff(0),musicConnector.disconnect(0)),this.musicID=null,this.musicConnector=null,this.musicInLoadProcess=!1,!0)},t.isBuffered=function(e){return this.buffer.hasOwnProperty(e)},t.setVolume=function(e,t){if(null!=this.context){var n=e==wolfTec.AudioChannel.CHANNEL_BG?this.musicNode:this.sfxNode
0>t?t=0:t>1&&(t=1),n.gain.value=t}},t.getVolume=function(e){return null==this.context?-1:e==wolfTec.AudioChannel.CHANNEL_BG?this.musicNode.gain.value:e==wolfTec.AudioChannel.CHANNEL_SFX?this.sfxNode.gain.value:-1},t.isMusicSupported=function(){return null!=this.context},t.isSfxSupported=function(){return null!=this.context},t.createSoundNode=function(e){var t
return t=this.context.hasOwnProperty("createGain")?this.context.createGain():this.context.createGainNode(),t.gain.value=e,t.connect(this.context.destination),t},t.playSoundOnGainNode=function(e,t,n){var i=this.context.createBufferSource()
return i.loop=n,i.buffer=t,i.connect(e),0==this.apiStatus&&(this.apiStatus=i.hasOwnProperty("start")?1:2),1==this.apiStatus?i.start(0):i.noteOn(0),i},t.decodeAssetErrorCb=null,t.loadAsset=function(e,t,n){if(t.type!=wolfTec.AssetType.MUSIC){var i=stjs.bind(this,function(e){this.buffer[t.name]=e,n()})
e.get(t.path,function(e){this.context.decodeAudioData(e.value,i,this.decodeAssetErrorCb)})}},t.grabAsset=function(e,t){var n={}
n.path=t.path,n.type="arraybuffer",n.success=function(){},n.error=stjs.bind(this,function(){this.log.error("CannotLoadAssetException")}),this.browser.doHttpRequest(n)}},{log:"wolfTec.Logger",storage:"wolfTec.StorageBean",browser:"wolfTec.BrowserHelperBean",sfxNode:"Object",musicNode:"Object",context:"Object",buffer:{name:"Map",arguments:[null,"Object"]},musicConnector:"Object",musicPlayCallback:{name:"Callback1",arguments:["Object"]},musicLoadCallback:{name:"Callback1",arguments:[{name:"wolfTec.StorageEntry",arguments:["Object"]}]},decodeAssetErrorCb:{name:"Callback1",arguments:[null]}},{}),stjs.ns("wolfTec"),wolfTec.LocalizationBean=function(){this.languages={},this.selected=null},stjs.extend(wolfTec.LocalizationBean,null,[wolfTec.AssetLoader],function(e,t){t.languages=null,t.selected=null,t.loadAsset=function(e,t){t.type==wolfTec.AssetType.LANGUAGE},t.grabAsset=function(e,t){t.type==wolfTec.AssetType.LANGUAGE},t.registerLanguage=function(e,t){(null==e||null==t)&&stjs.exception("IllegalArgumentException"),this.languages.hasOwnProperty(e)&&stjs.exception("LanguageAlreadyRegisteredException")
for(var n={},i=Object.keys(t),s=0;s<i.length;s++)n[i[s]]=t[i[s]]
this.languages[e]=n},t.selectLanguage=function(e){this.languages.hasOwnProperty(e)||stjs.exception("unknown language"),this.selected=this.languages[e]},t.solveKey=function(e){if(null==this.selected)return e
var t=this.selected[e]
return null!=t?t:e}},{languages:{name:"Map",arguments:[null,{name:"Map",arguments:[null,null]}]},selected:{name:"Map",arguments:[null,null]}},{}),stjs.ns("wolfTec"),wolfTec.SpriteManagerBean=function(){},stjs.extend(wolfTec.SpriteManagerBean,null,[wolfTec.AssetLoader],function(e,t){t.browserUtil=null,t.sprites=null,t.overlayTiles=null,t.longAnimatedTiles=null,t.minimapIndex=null,t.init=function(){this.sprites={},this.overlayTiles={},this.longAnimatedTiles={},this.minimapIndex={}},t.loadAsset=function(e,t){t.type==wolfTec.AssetType.IMAGES},t.grabAsset=function(e,t){t.type==wolfTec.AssetType.IMAGES},t.getSprite=function(e){return this.sprites[e]},t.isLongAnimatedSprite=function(e){return this.longAnimatedTiles.hasOwnProperty(e)},t.toJSON=function(e){for(var t=[],n=0,i=e.getNumberOfImages();i>n;n++)t[n]=this.browserUtil.convertCanvasToBase64(e.getImage(n))
return JSON.stringify(t)},t.fromJSON=function(e){for(var t=JSON.parse(e),n=new wolfTec.Sprite(e.length),i=0,s=e.length;s>i;i++)n.setImage(i,this.browserUtil.convertBase64ToImage(t[i]))
return n}},{browserUtil:"wolfTec.BrowserHelperBean",sprites:{name:"Map",arguments:[null,"wolfTec.Sprite"]},overlayTiles:{name:"Map",arguments:[null,null]},longAnimatedTiles:{name:"Map",arguments:[null,null]},minimapIndex:{name:"Map",arguments:[null,null]}},{}),stjs.ns("wolfTec"),wolfTec.PositionableGroup=function(){wolfTec.ButtonGroup.call(this),this.x=0,this.y=0},stjs.extend(wolfTec.PositionableGroup,wolfTec.ButtonGroup,[],function(e,t){t.x=0,t.y=0,t.setMenuPosition=function(e,t){for(var n=e-this.x,i=t-this.y,s=0,a=this.elements.length;a>s;s++){var o=this.elements[s]
o.x+=n,o.y+=i}this.x=e,this.y=t}},{elements:{name:"Array",arguments:["wolfTec.UiField"]}},{}),stjs.ns("wolfTec"),wolfTec.MenuState=function(){},stjs.extend(wolfTec.MenuState,null,[wolfTec.State],null,{statemachine:"wolfTec.StateMachineBean",jsUtil:"wolfTec.JsUtil",log:"wolfTec.Logger"},{}),stjs.ns("wolfTec"),wolfTec.InGameState=function(){},stjs.extend(wolfTec.InGameState,null,[wolfTec.State],function(e,t){e.cursorHandler=null,e.animation=null,t.keyLeft=function(){wolfTec.InGameState.cursorHandler.moveCursor(wolfTec.Direction.LEFT,1)},t.keyRight=function(){wolfTec.InGameState.cursorHandler.moveCursor(wolfTec.Direction.RIGHT,1)},t.keyUp=function(){wolfTec.InGameState.cursorHandler.moveCursor(wolfTec.Direction.UP,1)},t.keyDown=function(){wolfTec.InGameState.cursorHandler.moveCursor(wolfTec.Direction.DOWN,1)},t.render=function(e){wolfTec.InGameState.animation.update(e)}},{cursorHandler:"wolfTec.CursorHandler",animation:"wolfTec.AnimationManagerBean",statemachine:"wolfTec.StateMachineBean",jsUtil:"wolfTec.JsUtil",log:"wolfTec.Logger"},{}),stjs.ns("wolfTec"),wolfTec.AnimationState=function(){},stjs.extend(wolfTec.AnimationState,null,[wolfTec.State],function(e,t){t.isAnimationState=function(){return!0}},{statemachine:"wolfTec.StateMachineBean",jsUtil:"wolfTec.JsUtil",log:"wolfTec.Logger"},{}),stjs.ns("wolfTec"),wolfTec.UiScreenLayout=function(e,t,n,i){wolfTec.ButtonGroup.call(this),this.left=n,this.curX=n,this.curY=i,this.curH=0,this.breakLine()},stjs.extend(wolfTec.UiScreenLayout,wolfTec.ButtonGroup,[],function(e,t){t.TILE_BASE=32,t.left=0,t.curX=0,t.curY=0,t.curH=0,t.repeat=function(e,t){for(var n=0;e>n;n++)t(this,n)
return this},t.addRowGap=function(e){return this.curY+=this.TILE_BASE*e,this},t.addColGap=function(e){return this.curX+=this.TILE_BASE*e,this},t.breakLine=function(){return this.curX=this.left,this.curY+=this.curH*this.TILE_BASE,this.curH=1,this},t.addButton=function(e,t,n,i,s,a,o){this.curH<t&&(this.curH=t)
var l=new wolfTec.UiField(this.curX,this.curY+n*this.TILE_BASE,e*this.TILE_BASE,t*this.TILE_BASE,i,a,s,o)
return this.curX+=e*this.TILE_BASE,this.addElement(l),this},t.addCustomField=function(e,t,n,i,s,a){!a&&this.curH<t&&(this.curH=t)
var o=new wolfTec.CustomizableField(this.curX,this.curY+n*this.TILE_BASE,e*this.TILE_BASE,t*this.TILE_BASE,i,s)
return this.curX+=e*this.TILE_BASE,this.addElement(o),this},t.addCheckbox=function(e,t,n,i,s,a){this.curH<t&&(this.curH=t)
var o=new wolfTec.CheckboxField(this.curX,this.curY+n*this.TILE_BASE,e*this.TILE_BASE,t*this.TILE_BASE,i,a,s)
return this.curX+=e*this.TILE_BASE,this.addElement(o),this}},{elements:{name:"Array",arguments:["wolfTec.UiField"]}},{})
