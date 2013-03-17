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
  PAGE_DESC.fillNavbarSection( document.getElementById("navbar") );
  PAGE_DESC.fillLinkSection( document.getElementById("sectionLinks") );
  PAGE_DESC.fillLegalsSection( document.getElementById("sectionLegal") );
  PAGE_DESC.fillReleaseSection( document.getElementById("sectionRelease") );
  PAGE_DESC.loadAndDisplayIssues( document.getElementById("sectionRoadmap") );
  
  $("#playLatestButton").attr("href", PAGE_DATA.latestMilestone.link );
  
  // CONVERT RSS DATES TO HUMAN READABLE TIME
  $(".rss-date").each(function(i,element){
    element.innerHTML = moment( element.innerHTML, "YYYY-MM-DD HH:mm:ss.SSS-Z,ZZ").fromNow();;
  });

  // OPEN MAIN SECTION
  PAGE_PROG.openSection( { href:"" }, "sectionMain" ); 
});