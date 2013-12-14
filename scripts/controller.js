var PAGE_DATA = {};

var PAGE_PROG = {
  
  _sections:[],
  
  registerSection: function( obj ){
    this._sections.push( obj );
  },
  
  inject: function( section , data, after ){        
    var el;
    el = document.createElement("div");
    el.innerHTML = Mustache.render( section.template, data, section.partials );
    document.getElementById(section.element).appendChild(el);
    if( after ) after();
  },
  
  renderSections: function(){
    for( var i=0,e=this._sections.length; i<e; i++ ){
      var section = this._sections[i];    
      
      if( section.dataLoader ){
        section.dataLoader( section, this.inject, section.after );
      }
      else this.inject( section, PAGE_DATA, section.after );
    }
  }
};