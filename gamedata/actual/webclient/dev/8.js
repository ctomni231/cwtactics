(function(){var t=function(){for(var t=this.__defValue__,e=this.__width__,n=this.__height__,o="function"==typeof t,E=0,r=e;r>E;E++)for(var i=0,_=n;_>i;i++)this[E][i]=o?t(E,i,this[E][i]):t},e=function(t){var e=this.__width__,n=this.__height__;if(t.length!==this.length)throw Error();for(var o=0,E=e;E>o;o++)for(var r=0,i=n;i>r;r++)t[o][r]=this[o][r]};util.matrix=function(n,o,E){void 0===E&&(E=null);var r=[];r.__defValue__=E,r.__width__=n,r.__height__=o,r.resetValues=t,r.cloneValues=e;for(var i=0;n>i;i++)r[i]=[];return r.resetValues(),r}})();