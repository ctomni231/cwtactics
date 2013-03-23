PAGE_PROG.sectionController.registerSection({
  
  id: "news",
  
  element: document.getElementById("sectionNews"),
  
  dataLoader: function(){
    
    // NOT ATM
    /*
    $.getJSON( "https://www.googleapis.com/blogger/v3/blogs/8771777547738195480/posts?key=AIzaSyCFj15TpkchL4OUhLD1Q2zgxQnMb7v3XaM&callback=?",        
      function( respone ){
        console.log( respone );
      }
    );
    */
  },
  
  template: [].join(""),
      
  partials:{}
});