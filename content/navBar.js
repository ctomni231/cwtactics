PAGE_DATA.navbarLinks = [
  
  { name:"News",          section:"news" },
  { name:"Releases",      section:"releases" },
  { name:"Working On",    section:"roadmap" },
  { name:"Links",         section:"links" },
  { name:"Legal Notice",  section:"legals" },
  { name:"Contact Us",    section:"mailto:ctomni231@gmail.com", target:"_self", link:true }
  
];

PAGE_DATA.generateTargetType = function(){
  return function( text, render ){
    var content = render(text);
    if( content === '' ) content = "_blank";
    
    return content;
  };
}