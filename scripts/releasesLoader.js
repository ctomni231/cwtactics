PAGE_PROG.releaseSelected = -1;

PAGE_PROG.releases = null;

PAGE_PROG.updateReleaseBox = function( mode ){
  if( !PAGE_PROG.releases ){
    PAGE_PROG.releases = document.getElementsByName("releaseBlock");
  }
  
  if( PAGE_PROG.releaseSelected !== -1 ){ 
    PAGE_PROG.releases[PAGE_PROG.releaseSelected].className="pure-g-r content_block hidden"; 
  } 
  else PAGE_PROG.releaseSelected = 0;
    
  if( mode === -1 && PAGE_PROG.releaseSelected > 0 ){
    PAGE_PROG.releaseSelected--;
  }
  if( mode === +1 && PAGE_PROG.releaseSelected < PAGE_PROG.releases.length-1 ){
    PAGE_PROG.releaseSelected++;
  }
    
  PAGE_PROG.releases[PAGE_PROG.releaseSelected].className="pure-g-r content_block visible"; 
};

PAGE_PROG.registerSection({
  
  id: "releases",
  name: "Releases",
  
  element: "sectionRelease",
  
  template: [

    "<h1>Releases</h1>",
    
    // controls
    "<div class=\"release_controls\" >",
      "<a class=\"left\" href='#' ",
        "onClick='PAGE_PROG.updateReleaseBox(-1); return false;' > Newer Releases </a>",
      "<a class=\"right\" href='#' ",
        "onClick='PAGE_PROG.updateReleaseBox(+1); return false;' > Older Releases </a>",
    "</div>",
    
    // content
    "{{#milestones}}",

      "<div id='{{header}}-{{version}}' name='releaseBlock' ",
                                       "class=\"pure-g-r content_block hidden\">",


        "<div class='releaseHeader'>",
          "<div class=\"version\">{{header}} {{version}}</div>",
          "<div class=\"description\"> {{subHeaderT}} {{subHeaderB}} </div>",
        "</div>",                   

        "<div class=\"releaseImage\" >",
          "<a class=\"play\" ",
             "{{#link}}href=\"{{link}}\"                 {{/link}}",
             "{{^link}}href=\"#\" onclick='return false;'{{/link}} ",
             "target=\"_blank\">",

            "{{#img}}<img src=\"{{img}}\" ",
              "{{#link}}title='Play it!'{{/link}}",
              "{{^link}}title='Link is broken!'{{/link}}",
            "/> {{/img}}",
          "</a>",
        "</div>",

        "<div class=\"releaseText\" >",
          "{{> textBlock}}",
        "</div>",

        "<div class=\"log\" >",
          "{{> changeLogV2}}",,
        "</div>",

      "</div>",

    "{{/milestones}}"
    
  ].join(""),
  
  partials:{
    textBlock: "{{#text}}<p>{{{.}}}</p>{{/text}}",
    changeLogV2: [
      "{{#log}}",

        "{{#NEW}}",
          "<div class=\"logEntry newEntry\">",
            "<div>New</div> <div>{{{.}}}</div>",
          "</div>",
        "{{/NEW}}",

        "{{#CHANGED}}",
          "<div class=\"logEntry changedEntry\">",
            "<div>Changed</div> <div>{{{.}}}</div>",
          "</div>",
        "{{/CHANGED}}",

        "{{#FIXED}}",
          "<div class=\"logEntry fixedEntry\">",
            "<div>Fixed</div> <div>{{{.}}}</div>",
          "</div>",
        "{{/FIXED}}",

      "{{/log}}"
    ].join("")
  },

  after:function(){

    $('#sectionRelease img[title="Play it!"]').qtip({
          position: { my: 'right middle', at: 'left middle' },
          style:    { classes: 'qtip-bootstrap' }
    }); 
    
    $('#sectionRelease img[title="Link is broken!"]').qtip({
          position: { my: 'right middle', at: 'left middle' },
          style:    { classes: 'qtip-red qtip-shadow qtip-rounded' }
    });  

    // DEACTIVATE BUTTON FOR NOW
    $(".playButton a").attr("title",
      "Currently broken, fix will be released together with CWT 0.3.5. :)"
    ).attr("href","#");
  }
});