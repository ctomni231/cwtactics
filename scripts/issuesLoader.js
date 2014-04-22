PAGE_PROG.registerSection({
    
  id: "issues",
  name: "Working On",
  
  element: "sectionRoadmap",
  
  dataLoader: function( section, cb ){
    
    function render(){
      var issueData = JSON.parse( localStorage.issueData );      
      cb( section, issueData );
      
      $('#sectionRoadmap a[title]').qtip({
              position: { my: 'right middle', at: 'left middle' },
              style:    { classes: 'qtip-bootstrap' }
      }); 
    }
    
    // UP TO DATE DATA IN STORAGE ?  
    if( localStorage.issueEndDate === undefined || moment().isAfter(localStorage.issueEndDate) ){
      
      // NEXT MILESTONE
      var NEXT_VERSION        = 6;
      var NEXT_VERSION_HEADER = "Version 0.4";
      
      var url = "https://api.github.com/repos/ctomni231/cwtactics/issues?"+
                "milestone="+NEXT_VERSION+
                "&callback=?";

      $.getJSON( url, function( respone ){
          
          var data = {
            header:NEXT_VERSION_HEADER,
            issues:[]
          };
          for( var i=0,e=respone.data.length; i<e; i++ ){
            var obj = {};
            
            // META DATA
            obj.title = respone.data[i].title;
            //obj.body = respone.data[i].body;
            obj.url = respone.data[i].html_url;
            
            // GET LABELS
            obj.labels = [];
            for( var iL=0,eL=respone.data[i].labels.length; iL<eL; iL++ ){
              obj.labels.push({
                name: respone.data[i].labels[iL].name ,
                color: respone.data[i].labels[iL].color 
              });
            }
            
            data.issues.push( obj );
          }
          
          // SAVE DATA AS CACHE FOR THE NEXT HOUR
          localStorage.issueData = JSON.stringify( data );
          localStorage.issueEndDate = moment().add('m', 360);
          
          // RENDER IT 
          render();
        }
      );
    }
    else render();
  },
  
  template: [
    "<h1>Working On</h1>",
    
    "<div class=\"issueNextVersion\">{{header}}</div>",

    "{{#issues}}",
      "<div class=\"issueEntry\" >",
        "<div class='issueLabel'>{{> labelList}}</div>",
        "<div class='issueTitle'><a target='_blank' href='{{url}}' title='Goto Github'>{{title}}</a></div>",
      "</div>",
    "{{/issues}}"
  ].join(""),
  
  partials:{
    labelList: "{{#labels}} <span class='issueLabel' style='"+
                  "color:#{{color}}; "+
                  "border:1px solid #{{color}}; "+
                  "border-radius: 15px; "+
                  "padding-left: 5px; "+
                  "padding-right: 5px; "+
                "' > {{name}} </span> {{/labels}} "
  }
});
