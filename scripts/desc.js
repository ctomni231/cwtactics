var PAGE_NEWS_DESC = {
  "table tr": {
    "newsEntry <- news": {
      "td.date": "#{newsEntry.date}",
      "td.content": "#{newsEntry.content}"
    }
  }
};

var PAGE_COMPA_DESC = {
  "table tr": {
    "entry <- compabilities": {
      "td.name": "#{entry.name}",
      "td.lvWin": "#{entry.levelWin}",
      "td.lvLin": "#{entry.levelLin}",
      "td.lvMac": "#{entry.levelMac}",
      "td.lvDrd": "#{entry.levelDrd}",
      "td.lvIOS": "#{entry.levelIOS}",
      "td.notes": "#{entry.notes}"
    }
  }
};

var PAGE_MILESTONES_DESC = {
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

      "p.firstText": "#{entry.pre}",

      "p.imgBox": function(args) {
        if( typeof args.item.img !== 'undefined' && args.item.img !== null ){
          return "<img src='"+args.item.img+"'>";
        }
        else return "";
      },

      "p.lastText": "#{entry.post}",

      "a@href": "#{entry.link}"
      ,
      
      "a": "#{entry.linkCaption}"
      ,
      
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

var PAGE_NAVBAR_DESC = {
  "li":{
    "entry <- links":{
      "a":"entry.name",
      "a@href":"entry.link"
    }
  }
};
