
function setCarat(charIndex){
    var range = document.createRange();
    range.setStart(document.getElementById('response').childNodes[0],charIndex); // after which char to set carat
    range.collapse(true); // I don't know what this does, but it's on tutorials
    var sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function listenResponse(){
    var keyPress = function(e){
        var key = e.keyCode;

        if(key == 32) { // click spacebar => new word
            trial.fullResponse = $('#response').text();
            word.text = getLastNWords(trial.fullResponse, 1);
            saveData(); //save data after every word
            word.startTime = new Date().getTime(); //reset word timer
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
                saveData(); //save data after every word
                word.startTime = new Date().getTime(); //reset word timer
                showPrediction();
                predActive = true;
            }
        } else {
            hidePrediction();
            predActive = false;
        }

        char.code = key; //save keycode to data

    }
    $("#response").keydown(keyPress);
}

function clearListenResponse(){
    $('#response').keydown(null);
    $('#response').val('');
}