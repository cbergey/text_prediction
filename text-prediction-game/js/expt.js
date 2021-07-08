

function pageLoad(){
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
    //function here of experiment
    
}

function trialDone(){
    $('#trial').css('display','none');
    trial.endTime = new Date().getTime();
    trial.totalTime = trial.endTime - trial.startTime;

    recordData();
    // these lines write to server
    data = {client: client, expt: expt, trials: trialData};
    if(!expt.debug){
        writeServer(data);
    }

    
    // if we are done with all trials, then go to completed page
    if(trial.number == expt.totalTrials){
        $('#trial').css('display', 'none');
        $('#completed').css('display','block');
    }
    else {
        // increase trial number
        ++trial.number;
        trialStart();
    }
}

function recordData(){
    // record what the subject did in json format
    trialData.push({
        trialNumber: trial.number,
        trialTime: trial.totalTime,
        startTime: trial.startTime,
        endTime: trial.endTime
    });
}

function experimentDone(){
    submitExternal(client);
}











    ////////////////////////////
   //////// Microphone ////////
  ////////////////////////////

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audiotRecorder = null;

function turnOnMicrophone(){
    var constraints = {audio:true};
    var preview = document.querySelector('.videostream');
    var recording = document.querySelector('#recording');
    navigator.mediaDevices.getUserMedia(constraints).
    then(stream => {
        //put something here
    })
}

function turnOffMicrophone(){

}

// function saveAudio(){
//     audioRecorder.exportWAV(doneEncoding);

//     function doneEncoding( blob ) {
//         Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
//         recIndex++;
//     }

// }


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
