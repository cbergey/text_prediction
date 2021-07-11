

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
    $('#stimRow').html(presentStim(expt.nStimTrial));
    listenResponse();
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


function getPredFile(){ // get ngram files value from dict
    var nWords = getStringLen($('#response').val());
    nWords = Math.max(nWords, 2); // if # words > 2, reduce to 2
    return(ngram[nWords.toString()]); // convert to string and get ngram value
}

function getPrediction(){
    var nDict = getPredFile();
    //stuff here to get prediction from dictionary
}

function listenResponse(){
    var keyPress = function(e){
        var key = e.keyCode;
        if(key == 32){
            console.log("word done!");
            word.time = new Date().getTime() - word.startTime;
            saveData(); //save data after every word
            word.startTime = new Date().getTime(); //reset word timer
        }
    }
    $("#response").keydown(keyPress);
}

function clearListenResponse(){
    $('#response').keydown(null);
    $('#response').val('');
}

function saveData(){
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
    return(string.split(" "));
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
