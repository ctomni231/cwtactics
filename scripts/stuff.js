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
    var title = "";
    
    if( value === "" ) continue;


    if( value === "fine" ) title = "Runs fine";
    else if( value === "problem" ) title = "Some faults may happen";
    else if( value === "error" ) title = "Does not start";
    else if( value === "unknown" ) title = "Not tested yet";
    else if( value === "none" ) title = "Not available on platform";
    else if( value === "ico_win" ) title = "Microsoft Windows";
    else if( value === "ico_mac" ) title = "Apple Mac Osx";
    else if( value === "ico_lin" ) title = "Linux";
    else if( value === "ico_drd" ) title = "Android 4";
    else if( value === "ico_ios" ) title = "Apple iOS 6";
    else if( value === "Chrome" ) title = "Google Chrome";
    else if( value === "Firefox" ) title = "Firefox";
    else if( value === "Safari" ) title = "Apple Safari";
    else if( value === "InternetExplorer" ) title = "Internet Explorer";
    else title = "Unknown";


    if( value === "fine" ) value = "sign_tick.png";
    else if( value === "problem" ) value = "sign_warning.png";
    else if( value === "error" ) value = "sign_cacel.png";
    else if( value === "unknown" ) value = "sign_question.png";
    else if( value === "none" ) value = "sign_deny.png";

    else if( value === "ico_win" ) value = "ico_win.png";
    else if( value === "ico_mac" ) value = "ico_mac.png";
    else if( value === "ico_lin" ) value = "ico_lin.png";
    else if( value === "ico_drd" ) value = "ico_drd.png";
    else if( value === "ico_ios" ) value = "ico_ios.png";

    else if( value === "Chrome" ) value = "ico_ch.png";
    else if( value === "Firefox" ) value = "ico_ff.png";
    else if( value === "Safari" ) value = "ico_sf.png";
    else if( value === "InternetExplorer" ) value = "ico_ie.png";
    else value = "sign_question.png";


    value = "<img title='"+title+"' src='icons/"+value+"'></img>";

    elements[i].innerHTML = value;
  }
}