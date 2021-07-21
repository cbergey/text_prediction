

function pageLoad(){
    expt.stimOrder = shuffle(stim);
    $("#demoSurvey").load("demographic.html");
    // loadCondition(expt.condition);
    
    clicksMap[expt.startPage]();
}

function loadCondition(){
    let gram = ["unigram","bigram","trigram"]
    for(var g=0; g < gram.length; g++){
        let scriptElement=document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = 'ngram/'+expt.condition+'_'+gram[g]+'.json';
        document.head.appendChild(scriptElement);
        console.log(scriptElement)

        // if(condition == "childes"){
        //     switch(g){
        //         case 0:
        //             expt.lm[g] = childes_unigram;
        //             break;
        //         case 1:
        //             expt.lm[g] = childes_bigram;
        //             break;
        //         case 2:
        //             expt.lm[g] = childes_trigram;
        //             break;
        //     } 
        // } else if(condition == "COCA"){
        //     switch(g){
        //         case 0:
        //             expt.lm[g] = COCA_unigram;
        //             break;
        //         case 1:
        //             expt.lm[g] = COCA_bigram;
        //             break;
        //         case 2:
        //             expt.lm[g] = COCA_trigram;
        //             break;
        //     } 
        // }
    }

    console.log(childes_unigram)
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

function clickConsent(){
    $('#consent').css('display','none');
    $('#demographic').css('display','block');
}

function clickDemo(){
    $('#demographic').css('display','none');
    submitDemo();
    trialStart();
}


function trialStart(){
    $('#trial').css('display','block');
    $('#round').html('Round ' + trial.number + " of " + expt.totalTrials);
    trial.startTime = new Date().getTime(); //reset start of trial time
    word.startTime = new Date().getTime(); //reset word timer

    //function here of experiment
    predActive = true;
    $('#stimRow').html(presentStim(expt.nStimTrial));
    listenResponse();
    showPrediction();
    turnOffCaretMove();
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
    trial.fullResponse = $('#response').text();
    word.text = getLastNWords(trial.fullResponse, 1, true);
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
        showPosttest();
    } else {
        // increase trial number
        ++trial.number;
        trial.endTime = null;
        $('#response').text(''); //clears text between trials
        trialStart();
    }
}

function showPosttest(){
    $('#postExpt').css('display','block');
    showQuestions();
}

function clickPosttest(){
    submitPosttest();
    $('#postExpt').css('display','none');
    $('#completed').css('display','block');
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

