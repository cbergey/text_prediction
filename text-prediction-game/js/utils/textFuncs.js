
function setCaret(charIndex){
    let range = document.createRange();
    range.setStart(document.getElementById('response').childNodes[0],charIndex); // after which char to set carat
    range.collapse(true); // I don't know what this does, but it's on tutorials
    let sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

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
            trial.fullResponse = $('#response').text();
            word.text = getLastNWords(trial.fullResponse, 1);
            saveData(); //save data after every word
            word.startTime = new Date().getTime(); //reset word timer
            saveKeyCode();
            showPrediction();
            predActive = true;
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
        }
    }

    $("#response").keydown(keyPress);
}

function clearListenResponse(){
    $('#response').keydown(null);
    $('#response').val('');
}

function alertMessage(txt){
    clearTimeout(alertMsg); // if previous message, clear time
    $('#alert').html(txt); // alert user XXXX
    alertMsg = setTimeout(function(){ $('#alert').html('&nbsp') }, 2000); // remove alert after 2 secs
}

