PAGE_DATA.navbarLinks = [
  
  { name:"News",          section:"sectionMain" },
  { name:"Releases",      section:"sectionRelease" },
  { name:"Working On",    section:"sectionRoadmap" },
  { name:"Links",         section:"sectionLinks" },
  { name:"Legal Notice",  section:"sectionLegal" },
  { name:"Contact Us",    section:"mailto:ctomni231@gmail.com", target:"_self", link:true }
  
];

PAGE_DATA.generateTargetType = function(){
  return function( text, render ){
    var content = render(text);
    if( content === '' ) content = "_blank";
    
    return content;
  };
}