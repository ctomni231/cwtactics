var loadAndDisplayIssues;
(function(){

  var repoName = "cwtactics";
  var repoUser = "ctomni231";
  var repoURL = "https://api.github.com/repos/"+repoUser+"/"+repoName;
  
  function columnData( data ){
    var td = document.createElement("td");
    td.innerHTML = data;
    
    return td;
  };
  
  loadAndDisplayIssues = function( targetElement ){

    $.getJSON( repoURL+"/milestones?sort=due_date&direction=asc&callback=?", function( response ){ 
      
      // FROM CURRENT TO FUTURE
      for( var i=0,e=response.data.length; i<e; i++ ){
        
        var milestone = response.data[i];
        var milestoneElement = document.createElement("table");
        
        var header = document.createElement("thead");
        milestoneElement.appendChild( header );
        
        header.innerHTML = "<tr><td>Milestone "+milestone.number+"</td></tr>";
        
        var body = document.createElement("tbody");
        milestoneElement.appendChild( body );
        
        // GET MILESTONE ISSUES 
        var milestone = response.data[i];
        $.getJSON( repoURL+"/issues?milestone="+milestone.number+"&callback=?", function( milestoneResponse ){ 
          
           // EVERY MILESTONE ISSUE
          for( var j=0,f=milestoneResponse.data.length; j<f; j++ ){
            
            var issue = milestoneResponse.data[j];
            var issueElement = document.createElement("tr");
            
            issueElement.appendChild( columnData( issue.title ) );
            issueElement.appendChild( columnData( issue.labels ) );
            
            var issueBody = columnData( issue.body );
            issueBody.colspan = 2;
            issueElement.appendChild( issueBody );
            
            body.appendChild( issueElement );
          }
          
        });
        
        targetElement.appendChild( milestoneElement );
      }
    });
  };
})();