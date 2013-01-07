function PAGE_CONVERT_TAG_CLASSES(){
  var now = new Date();

  // DATES
  var elements = document.getElementsByClassName("dateDiff");
  for( var i = 0,e = elements.length; i<e; i++ ){
    var dateVal = Date.parse( elements[i].innerHTML );
    var diff = now - dateVal;
    var daysDiff = Math.floor(diff/1000/60/60/24);

    var value;
    if( daysDiff === 0 ) value = "Today";
    else if( daysDiff === 1 ) value = "Yesterday";
    else if( daysDiff < 7 ) value = "This Week";
    else if( daysDiff < 30 ) value = "Last Weeks";
    else if( daysDiff < 60 ) value = "Last Month";
    else if( daysDiff < 365 ) value = "Last Months";
    else if( daysDiff >= 365 ) value = "Last Year";
    else value = "Wheeew... old!";

    elements[i].innerHTML = value;
  }

  // COMPA MAP
  elements = document.getElementsByClassName("withStatusIcon");
  for( var i = 0,e = elements.length; i<e; i++ ){
    var value = elements[i].innerHTML;

    if( value === "fine" ) value = "sign_tick.png";
    else if( value === "problem" ) value = "sign_warning.png";
    else if( value === "error" ) value = "sign_cacel.png";
    else if( value === "unknown" ) value = "sign_question.png";
    else value = "sign_question.png";

    value = "<img src='icons/"+value+"'></img>";

    elements[i].innerHTML = value;
  }
}