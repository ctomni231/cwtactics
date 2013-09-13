PAGE_PROG.registerSection({
    
  id: "issues",
  name: "Working On",
  
  element: "sectionRoadmap",
  
  dataLoader: function( section, cb ){
    
    function render(){
      var issueData = JSON.parse( localStorage.issueData );      
      cb( section, issueData );
    }
    
    // UP TO DATE DATA IN STORAGE ?  
    if( localStorage.endDate === undefined || moment().isAfter(localStorage.endDate) ){
      
      // NEXT MILESTONE
      var NEXT_VERSION = 8;
      var NEXT_VERSION_HEADER = "Version 0.3.5";
      
      var url = "https://api.github.com/repos/ctomni231/cwtactics/issues?milestone="+NEXT_VERSION+"&callback=?";
      $.getJSON( url, function( respone ){
          
          var data = {
            header:NEXT_VERSION_HEADER,
            issues:[]
          };
          for( var i=0,e=respone.data.length; i<e; i++ ){
            var obj = {};
            
            // META DATA
            obj.title = respone.data[i].title;
            obj.body = respone.data[i].body;
            
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
          localStorage.endDate = moment().add('m', 60);
          
          // RENDER IT 
          render();
        }
      );
    }
    else render();
  },
  
  template: [
    "<p class=\"issueNextVersion\">{{header}}</p>",
    "{{#issues}}",
      "<div class=\"issueEntry\" >",
        "<span>{{title}}</span>",
        "</br>",
        "<span>{{> labelList}}</span>",
      "</div>",
    "{{/issues}}",
  ].join(""),
  
  partials:{
    labelList: "{{#labels}} <span class='issueLabel' style='color:#{{color}};' > {{name}} </span> {{/labels}} "
  }
});