var PAGE_DESC = {};
var PAGE_DATA = {};
var PAGE_PROG = {};

/**
 *
 * @namespace
 */ 
PAGE_PROG.sectionController = {
  
  /**
   * Active page section.
   * @private
   */
  _active:null,
  
  /**
   * Active link.
   * @private
   */
  _activeLink:null,
  
  /**
   * All known page sections.
   * @private
   */
  _registered:{},
  
  /**
   *
   */
  registerSection: function( factoryDesc ){
    var sect = {};
    
    sect.element = factoryDesc.element;
    sect.template = factoryDesc.template;
    sect.partials = factoryDesc.partials;
    sect.rendered = false;
    if( factoryDesc.onopen ) sect.onopen = factoryDesc.onopen ;
    
    if( factoryDesc.dataLoader ) sect.dataLoader = factoryDesc.dataLoader;
    
    PAGE_PROG.sectionController._registered[ factoryDesc.id ] = sect;
  },
  
  /** @private */
  _renderSection: function( section, data ){
    if( !data ) data = PAGE_DATA;
    var el = document.createElement("div");
    
    el.innerHTML = Mustache.render( 
      section.template, 
      data,
      section.partials 
    );
    
    section.element.appendChild(el);
    section.rendered = true;
  },
  
  /**
   * Opens a registered section on the page. If a section
   * is already opened then it will be hidden by setting
   * its opacity to zero.
   */
  openSection: function( invoker, id ){
    if( invoker != null && invoker.href !== "" ) return true;
    
    // HIDE OLD
    if( this._active !== null ){
      this._active.element.style.display = "none";
      this._activeLink.className = "";
    }
    
    // SHOW NEW
    var section = this._registered[id];
    
    // RENDER IT ( LAZY RENDERING )
    if( !section.rendered ){
      
      if( section.dataLoader ){
        section.dataLoader( section, this._renderSection );
      }
      else this._renderSection( section );  
    }
    
    if( section.onopen ){
      section.onopen();
    }
    
    
    section.element.style.display = "";
    invoker.parentElement.className = "headerBarTabSelected";
    
    this._active = section;
    this._activeLink = invoker.parentElement;
        
    return false;
  }
};