
function pageLoad(){
    expt.stimOrder = stim; //not shuffling since the story is ordered
    $("#demoSurvey").load("demographic.html");

    expt.condition = Array.isArray(expt.condition) ? sample(expt.condition) : expt.condition; //randomly assign condition
    loadCondition();
    
    clicksMap[expt.startPage]();
}

function loadCondition(){
    if(expt.condition != "control"){
        $('#continueInstruct').prop('disabled', true);
        $.getJSON("ngram/" + expt.condition + "_unigram.json", function(uni){
            ngram[0] = uni;
        }).fail(function() {
            console.log("error loading ngram dicts");
        })

        $.getJSON("ngram/" + expt.condition + "_bigram.json", function(bi){
            ngram[1] = bi;
        }).fail(function() {
            console.log("error loading ngram dicts");
        })

        // $.ajaxSetup({
        //     timeout: 0
        // });
        $.ajax({
            dataType: "json",
            url: "ngram/" + expt.condition + "_trigram.json",
            data: data,
            success: function(tri) { 
                ngram[2] = tri; 
                console.log("ready!");
                $('#continueInstruct').prop('disabled', false); //enables moving on to trials after files loaded
            },
            timeout: 60000
        }).fail(function() {
            console.log("error loading ngram dicts");
        })
    }
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
    $('#instructions').css('display','block');
}

function clickInstruct(){
    $('#instructions').css('display','none');
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
        if(trial.number == 2){
            $('#trialInstruct').html("Continue your story, using the new images.");
        }
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
    if(submitPosttest()){
        $('#postExpt').css('display','none');
        $('#completed').css('display','block');
    } else{
        alert("Please respond to all questions to move on.")
    }
}

function recordKeyCode(){
    keyCodeData.push({
        trialNumber: trial.number,
        condition: expt.condition,
        predType: expt.predictionType,
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
        condition: expt.condition,
        predType: expt.predictionType,
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

function sample(set) {
    return (set[Math.floor(Math.random() * set.length)]);
}

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

