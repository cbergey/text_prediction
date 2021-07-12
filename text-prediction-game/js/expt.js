

function pageLoad(){
    expt.stimOrder = shuffle(stim);
    clicksMap[expt.startPage]();
}

function loadConsent(){
    $('#consent').css('display','block');
    $('#continueConsent').attr('disabled',true);
    $('input:radio[name="consent"]').change(
        function(){
            if($(this).is(':checked') && $(this).val()=="yes"){
                $('#continueConsent').attr('disabled',false);
            }
        });
}

function clickContConsent(){
    $('#consent').css('display','none');
    trialStart();
}


function trialStart(){
    $('#trial').css('display','block');
    //$('#next').attr('disabled',true);
    $('#round').html('Round ' + trial.number + " of " + expt.totalTrials);
    trial.startTime = new Date().getTime(); //reset start of trial time
    word.startTime = new Date().getTime(); //reset word timer

    //function here of experiment
    predActive = true;
    $('#stimRow').html(presentStim(expt.nStimTrial));
    listenResponse();
    showPrediction();
}

function presentStim(numStim){
    var stimTable = "";
    trial.stim = [];
    for(i=0; i<numStim; i++) {
        var thisStim = expt.stimOrder[(trial.number-1)*numStim+i];
        trial.stim.push(thisStim);
        stimTable += "<div class='stimCell'><img class='stimImg' src='img/stim-img/"+thisStim+"'></div>";
    }
    return(stimTable);
}



function getPrediction(){
    var nWords = getStringLen($('#response').text());
    nWords = Math.min(nWords, 2); // if # words > 2, reduce to 2
    var nDict = ngram[nWords] // get which ngram dictionary
    
    //stuff here to get prediction from dictionary
    try {
        if(nWords == 0) { // look up unigram
            var predWord = getMaxKey(nDict); // get most likely next word
            predWord = predWord.charAt(0).toUpperCase() + predWord.slice(1); // capitalize first word
            return(predWord);
        } else { // look up bigram or trigram
            var lastWords = getLastNWords($('#response').text(), nWords).toLowerCase(); //previous word(s) & lower case
            var predWord = getMaxKey(nDict[lastWords]); // get most likely next word
            return(predWord);
        }
    } catch(error){ // if no word is predicted, return blank
        //console.error(error);
        return('');
    }
    
}

function setCarat(charIndex){
    var range = document.createRange();
    range.setStart(document.getElementById('response').childNodes[0],charIndex); // after which char to set carat
    range.collapse(true); // I don't know what this does, but it's on tutorials
    var sel = document.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

function showPrediction(){
    var charLen = $('#response').text().length;
    word.prediction = getPrediction();
    $('#response').append("<font id='predictedWord'>" + word.prediction + "</font>");
    setCarat(charLen); // set carat to before predicted word
    word.acceptPred = false; //reset whether prediction was accepted
}

function hidePrediction(){
    $('#predictedWord').remove();
}

function acceptPrediction(){
    hidePrediction();
    var value = $('#response').text(); // save text and append on word prediction // fixes carat issue
    value = value + word.prediction + '&nbsp';
    trial.fullResponse = value;
    $('#response').html(value); 
}

function listenResponse(){
    var keyPress = function(e){
        var key = e.keyCode;
        if(key == 32) { // click spacebar => new word
            trial.fullResponse = $('#response').text();
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
    }
    $("#response").keydown(keyPress);
}

function clearListenResponse(){
    $('#response').keydown(null);
    $('#response').val('');
}

function saveData(){
    word.time = new Date().getTime() - word.startTime;
    var fullResponse = $('#response').val();
    word.text = getLastNWords(fullResponse, 1);

    recordData();
    // these lines write to server
    data = {client: client, expt: expt, trials: trialData};
    if(!expt.debug){
        writeServer(data);
    }
}


function trialDone(){
    $('#trial').css('display','none');
    
    trial.endTime = new Date().getTime();
    trial.totalTime = trial.endTime - trial.startTime;

    saveData();
    clearListenResponse();
    
    // if we are done with all trials, then go to completed page
    if(trial.number == expt.totalTrials){
        $('#trial').css('display', 'none');
        $('#completed').css('display','block');
    }
    else {
        // increase trial number
        ++trial.number;
        trial.endTime = null;
        trialStart();
    }
}

function recordData(){
    // record what the subject did in json format
    trialData.push({
        trialNumber: trial.number,
        trialStim: trial.stim,
        startTime: trial.startTime,
        wordNumber: word.number,
        textPrediction: word.prediction,
        textResponse: word.text,
        predAccepted: word.acceptPred,
        wordTime: word.time,
        trialCumulTime: word.cumulTime
        
    });
}

function experimentDone(){
    submitExternal(client);
}











    //////////////////////////////////
   //////// Helper Functions ////////
  //////////////////////////////////


function shuffle(array){ //shuffle list of objects
  var tornado = array.slice(0);
  var return_array = [];
  for(var i=0; i<array.length; i++){
    var randomIndex = Math.floor(Math.random()*tornado.length);
    return_array.push(tornado.splice(randomIndex, 1)[0]);
  }
  return return_array;   
}

function debugLog(message) {
    if(expt.debug){
        console.log(message);
    }
}

function getSplitStr(string){
    var splitStr = string.split(/\W/g); //removes weird non-alpha characters
    splitStr = remove(splitStr, ''); //removes blanks '' from split string array
    return(splitStr);
}

function getStringLen(string) {
    if(string == ''){
        return(0);
    } else{
        return(getSplitStr(string).length);
    }
}

function getLastNWords(string, n) {
    var l = getStringLen(string);
    var ws = getSplitStr(string);
    var wArr = [];
    for(var i=l-n; i<l; i++){
        wArr.push(ws[i]);
    }
    return(wArr.join(' '));
}

function getMaxKey(d){
    return(Object.entries(d).reduce((a, b) => a[1] > b[1] ? a : b)[0])
}

function remove(arr, val){
    return(arr.filter(function(el){
        return(el != val);
    }));
}
