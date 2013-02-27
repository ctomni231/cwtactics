var PAGE_DESC = {};
var PAGE_DATA = {};
var PAGE_PROG = {};

/* ***************************** SECTION ***************************** */

PAGE_PROG.oldSection_ = null;
PAGE_PROG.newSection_ = null;

PAGE_PROG.fadeSectionIn = function(){
  $( "#"+PAGE_PROG.newSection_ ).fadeIn(500);
  PAGE_PROG.newSection_ = null;
};

PAGE_PROG.openSection = function( el, section ){
  if( el.href !== "" ) return true;
  
  if( PAGE_PROG.oldSection_ !== null ){
    PAGE_PROG.newSection_ = section;
    $("#"+PAGE_PROG.oldSection_).fadeOut(500,PAGE_PROG.fadeSectionIn);
  }
  else{
    PAGE_PROG.newSection_ = section;
    PAGE_PROG.fadeSectionIn();
  }
  
  PAGE_PROG.oldSection_ = section;
  return false;
};


/* ***************************** ON READY ***************************** */

$(document).ready(function(){

  // RENDER TEMPLATES
  $("#navBar").render( PAGE_DATA, PAGE_DESC.navBar);
  $("#sectionRelease").render( PAGE_DATA, PAGE_DESC.milestoneSection );
  $("#sectionLegal").render( PAGE_DATA, PAGE_DESC.legalSection );
  $("#sectionLinks").render( PAGE_DATA, PAGE_DESC.linkSection );
      
  // CONVERT RSS DATES TO HUMAN READABLE TIME
  $(".rss-date").each(function(i,element){
    element.innerHTML = moment( element.innerHTML, "YYYY-MM-DD HH:mm:ss.SSS-Z,ZZ").fromNow();;
  });
      
  $("#playLatestButton").attr("href", PAGE_DATA.latestMilestone.link );
  
  PAGE_PROG.openSection( { href:"" }, "sectionMain" ); 
});