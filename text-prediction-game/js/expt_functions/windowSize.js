
function clickFullscreen(){
    if($('#fullscreenButton').attr('value') == 'off'){
        var winFull = document.documentElement; // Make the browser window full screen.
        openFullscreen(winFull);
        $('#fullscreenButton').html('Exit<br>full screen mode');
        $('#fullscreenButton').attr('value', 'on');
        $('#fullscreenButton').css({'border-color':'red', 'background-color':'red'});
        $('#fullscreenButton').hover(function(){
            $(this).css('background-color','red');
        }, function(){
            $(this).css('background-color', 'white');
        })
    } else{
        closeFullscreen();
        $('#fullscreenButton').html('Enter<br>full screen mode');
        $('#fullscreenButton').attr('value', 'off');
        $('#fullscreenButton').css({'border-color':'#4CAF50', 'background-color':'#4CAF50',});
        $('#fullscreenButton').hover(function(){
            $(this).css('background-color','#4CAF50');
        }, function(){
            $(this).css('background-color', 'white');
        })
    }
}

////////////////////////////////////

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}




function checkWindowDimensionsDynamic() {
    function displayWindowSize() {
        let dynWidth = $(window).width();
        let dynHeight = $(window).height();
        $("#windowText").html("Screen is " + dynWidth + " x " + dynHeight);
    };
    
    window.onresize = displayWindowSize;
    window.onload = displayWindowSize();
    
}

function checkWindowDimensions(minWidthPercent, minHeightPercent){ //dynamically check if dimensions are larger than specified percentages of max screen
    // minWidth: percent of width converted to magnitude
    // for my computer full screen is 83% of screen width
    minWidth = minWidthPercent * screen.width;

    // minHeight: percent of height converted to magnitude
    // for my computer full screen is 91% of screen height
    minHeight = minHeightPercent * screen.height;

    if($(window).width() >= minWidth && $(window).height() >= minHeight){
        return true;
    } else{
        warningMessage = ""; // if window size isn't large enough, warn client
        if($(window).width() < minWidth){
            warningMessage = warningMessage + "Please expand your screen width.\n"
        }
        if($(window).height() < minHeight){
            warningMessage = warningMessage + "Please expand your screen height.\n"
        }
        alert(warningMessage);
        return false;
    }
}