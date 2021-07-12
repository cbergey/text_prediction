var expt = { //add conditions here
    saveURL: 'submit.simple.php',
    startPage: 'trial', // {'consent','trial'}
    totalTrials: 2, //adjust to how many trials you have
    nStimTrial: 3,
    debug: false, //set to false when ready to run
    stimOrder: []
};

var trial = {
    number: 1, //which trial is this? //1-indexed
    stim: [],
    startTime: 0,
    endTime: 0,
    totalTime: 0,
    fullResponse: ''
}

var word = {
    number: 0,
    prediction: '',
    text: '',
    acceptPred: false,
    startTime: 0,
    time: 0,
    cumulTime: 0
}

var predActive = false;

var client = parseClient();
var trialData = []; //store all data in json format
var vidData = [];
