
function setCaret(charIndex){
    let range = document.createRange();
    range.setStart(document.getElementById('response').childNodes[0],charIndex); // after which char to set carat
    range.collapse(true); // I don't know what this does, but it's on tutorials
    let sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

var space = false;
function listenResponse(){
    var keyPress = function(e){
        let key = e.keyCode;
        char.acceptPred = false;
        char.code = key; //save keycode to data
        let caret = false;

        // prevent caret from being moved by arrow keys
        if([37,38,39,40].includes(key)) {
        	e.preventDefault();
        	caret = true;
            alertMessage("The arrow keys are turned off!"); // alert user that they can't use arrow keys
        }

        if(key == 32) { // click spacebar => new word
            if(!space){ // this if statement ignores double spaces
                saveData(); //save data after every word
                word.startTime = new Date().getTime(); //reset word timer
                saveKeyCode();
                if($('#response').text().slice(-1) == '.'){ // hacky --- no prediction if previous character is period+space
                    word.prediction = '';
                } else{
                    showPrediction();
                }
                predActive = true;
                space = true;
            }
        } else if(key == 9) {
            e.preventDefault();
            // if !predActive => nothing happens
            // if predActive => accept prediction and generate new prediction
            if(predActive) {
                acceptPrediction();
                word.text = word.prediction;
                word.acceptPred = true; // save data saying prediction was accepted; resets in showPrediction()
                char.acceptPred = true;
                saveData(); //save data after every word
                word.startTime = new Date().getTime(); //reset word timer
                saveKeyCode();
                showPrediction();
                predActive = true;
            }
        } else {
        	saveKeyCode();
        	if(!caret){
        		hidePrediction();
        	}
            predActive = false;
            space = false;
        }
    }

    $("#response").keydown(keyPress);
}

function clearListenResponse(){
    $('#response').keydown(null);
    $('#response').val('');
}

function turnOffCaretMove(){
    $('#response').click(function(){ 
        let charLen = $('#response').text().length - $('#predictedWord').text().length;
        if($('#response').text().length > 0){ // only if there is text in the box
            setCaret(charLen);
            alertMessage("Caret movement is off!"); // alert user that they can't move caret
        }
    });
}

function alertMessage(txt){
    clearTimeout(alertMsg); // if previous message, clear time
    $('#alert').html(txt); // alert user XXXX
    alertMsg = setTimeout(function(){ $('#alert').html('&nbsp') }, 2000); // remove alert after 2 secs
}


    //////////////////////////////////
   //////// Helper Functions ////////
  //////////////////////////////////

// split text into sentences
function getSplitSents(string){
    return(string.split('. ')); //split text up by sentences that follow period+space pattern
}

function getSplitStr(string){
    let splitStr = string.split(/\W/g); //removes weird non-alpha characters
    splitStr = remove(splitStr, ''); //removes blanks '' from split string array
    return(splitStr);
}

function getStringLen(string) {
    if(string == ''){
        return(0);
    } else{
        let sents = getSplitSents(string);
        let lastSent = sents[sents.length - 1];
        return(getSplitStr(lastSent).length);
    }
}

function getLastNWords(string, n, punct=false) {
    if(punct) { //preserves punctuation (for saving data)
        let words = string.split(" ");
        return(words[words.length-1]);
    } else {
        let l = getStringLen(string);
        let sents = getSplitSents(string);
        let lastSent = sents[sents.length - 1];
        let ws = getSplitStr(lastSent);
        let wArr = [];
        for(var i=l-n; i<l; i++){
            wArr.push(ws[i]);
        }
    return(wArr.join(' '));
    }
}


function remove(arr, val){
    return(arr.filter(function(el){
        return(el != val);
    }));
}


