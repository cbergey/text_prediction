

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


function saveKeyCode(){
    char.time = new Date().getTime() - char.startTime;
    char.char = String.fromCharCode(char.code);

    recordKeyCode();
    // these lines write to server
    let data = {client: client, expt: expt, trials: keyCodeData};
    if(!expt.debug){
        writeServer(data, "c");
    }

    ++char.number;
}

function saveData(){
    word.time = new Date().getTime() - word.startTime;

    recordData();
    // these lines write to server
    let data = {client: client, expt: expt, trials: trialData};
    if(!expt.debug){
        writeServer(data, "w");
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
    } else {
        // increase trial number
        ++trial.number;
        trial.endTime = null;
        trialStart();
    }
}

function recordKeyCode(){
    keyCodeData.push({
        trialNumber: trial.number,
        charNumber: char.number,
        prediction: word.prediction,
        acceptPred: char.acceptPred,
        keycode: char.code,
        char: char.char,
        startTime: char.startTime,
        time: char.time
    })
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


function remove(arr, val){
    return(arr.filter(function(el){
        return(el != val);
    }));
}
