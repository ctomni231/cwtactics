/* ***************************************************************** */

PAGE_DESC.linkSection = {
  
  "li":{
    "entry <- links":{
      
      "a":"#{entry.name}",
      
      "a@href":"#{entry.link}"
    }
  }
  
};

/* ***************************************************************** */

PAGE_DESC.legalSection = {
  
  "div.infoBox":{
    "entry <- legals": {

      "div.infoBoxHeader": function(args) {
        var item = args.item;
        return [
          item.header,
          "<span>",
          item.version,
          "</span><span class='role'>",
          item.subHeaderT,
          "<br/>",
          item.subHeaderB,
          "</span>"
        ].join("");
      },
      
      "p.text":{
        "part <- entry.text": {
          ".":"#{part}"
        }
      },
            
      "a@href": "#{entry.link}",
      "a@style": function( args ){
        var link = args.item.link;
        if( typeof link !== 'undefined' && link !== null && link.length > 0 ){
          return "";
        }
        return "display:none";
      }
      
    }
  }
  
};

/* ***************************************************************** */

PAGE_DESC.milestoneSection = {
  
  "div.infoBox":{
    "entry <- milestones": {

      "div.infoBoxHeader": function(args) {
        var item = args.item;
        return [
          item.header,
          "<span>",
          item.version,
          "</span><span class='role'>",
          item.subHeaderT,
          "<br/>",
          item.subHeaderB,
          "</span>"
        ].join("");
      },
      
      "p.imgBox": function(args) {
        if( typeof args.item.img !== 'undefined' && args.item.img !== null ){
          return "<img src='"+args.item.img+"'>";
        }
        else return "";
      },
    
      "p.text":{
        "part <- entry.text": {
          ".":"#{part}"
        }
      },
      
      "li.changelog":{
        "log <- entry.changelog": {
          ".":"#{log}"
        }
      },
      
      "a@href": "#{entry.link}",
      "a@style": function( args ){
        var link = args.item.link;
        if( typeof link !== 'undefined' && link !== null && link.length > 0 ){
          return "";
        }
        return "display:none";
      }
      
    }
  }
  
};

/* ***************************************************************** */

PAGE_DESC.navBar = {
  "li":{
    "entry <- navBar":{
      
      "a":"#{entry.name}",
      
      "a@section":"#{entry.section}",
      
      "a@href":function( args ){
        var target = args.item.section;
        var link = args.item.link;
        
        if( link === true ){
          return target;
        }
        return "";
      },
      
      "a@target":function( args ){
        var target = args.item.section;
        var link = args.item.link;
        
        if( link === true && target.substr(0,6) !== "mailto" ){
          return "_blank";
        }
        return "_self";
      }
    }
  }
};
