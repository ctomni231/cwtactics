PAGE_PROG.sectionController.registerSection({
  
  id: "roadmap",
  
  element: document.getElementById("sectionRoadmap"),
  
  dataLoader: function( section, cb ){
    
    // UP TO DATE DATA IN STORAGE ?  
    if( localStorage.endDate === undefined || moment().isAfter(localStorage.endDate) ){
      
      function render(){
        var milestoneData = JSON.parse( localStorage.milestoneData );
        var issueData     = JSON.parse( localStorage.issueData );
        var relativeToNow = function(){
          return function( text, render ){
            var date = render(text);
            return moment( date ).fromNow();
          };
        }
        
        // FOR EVERY MILESTONE
        for( var i=0,e=milestoneData.length; i<e; i++ ){
          var data = {};
          
          data.milestone = milestoneData[i];
          data.issues = [];
          data.relativeToNow = relativeToNow;
          
          var mId = data.milestone.number;
          for( var iI=0,eI=issueData.length; iI<eI; iI++ ){
            if( issueData[iI].milestone === mId ){
              data.issues.push( issueData[iI] );
            }
          }
          
          cb( section, data );
        }
      }
      
      var repoName = "cwtactics";
      var repoUser = "ctomni231";
      var repoURL = "https://api.github.com/repos/"+repoUser+"/"+repoName;
      
      // ------------------------------------------------------------------------
      // MILESTONE DATA
      $.getJSON( 
        repoURL+"/milestones?sort=due_date&direction=asc&callback=?", 
        function( respone ){
          localStorage.milestoneData = JSON.stringify( respone.data );
          
          var data = [];
          for( var i=0,e=respone.data.length; i<e; i++ ){
            var obj = {};
            
            obj.title = respone.data[i].title;
            obj.date = respone.data[i].due_on;
            obj.number = respone.data[i].number;
            obj.body = respone.data[i].description;
            
            data.push( obj );
          }
          
          localStorage.milestoneData = JSON.stringify( data );
          
          // --------------------------------------------------------------------
          // ISSUES
          $.getJSON( 
            repoURL+"/issues?&callback=?", 
            function( respone ){
              
              var data = [];
              for( var i=0,e=respone.data.length; i<e; i++ ){
                
                // NOT ATTACHED TO ANY MILESTONE
                if( respone.data[i].milestone === null ) continue;
                
                var obj = {};
                
                obj.title = respone.data[i].title;
                obj.body = respone.data[i].body;
                
                //obj.labels = respone.data[i].labels;
                
                obj.labels = [];
                for( var iL=0,eL=respone.data[i].labels.length; iL<eL; iL++ ){
                  obj.labels.push({
                    name: respone.data[i].labels[iL].name ,
                    color: respone.data[i].labels[iL].color 
                  });
                }
                
                obj.milestone = respone.data[i].milestone.number;
                
                data.push( obj );
              }
              
              localStorage.issueData = JSON.stringify( data );
              
              // DATA IS VALID FOR 15 MINUTES
              localStorage.endDate = moment().add('m', 15);
              
              // RENDER IT 
              render();
              
              // END RENDER ALGORITHM
            }
          );
          // END ISSUE REQUEST
          
        }
      );
      // END MILSTONE REQUEST
      
    }
    else render();
  },
  
  template: [
    "<table>",
    "<thead>",
    "<tr> <td> {{milestone.title}} </td> </tr>",
    "</thead>",
    "<tbody>",
    "{{#issues}}",
    "<tr> <td> <div> <div> {{title}} </div> <div> {{> labelList}} </div> </div> </td> </tr>",
    "{{/issues}}",
    "<tr> <td> Target-Date: <strong>{{#relativeToNow}}{{milestone.date}}{{/relativeToNow}}</strong>  </td> </tr>",
    "</tbody>",  
    "</table>"
  ].join(""),
  
  partials:{
    labelList: "<ul> {{#labels}} <li style='background-color:#{{color}};' > {{name}} </li> {{/labels}} </ul> </td> </tr>"
  }
});