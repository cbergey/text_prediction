var expt = { //add conditions here
    saveURL: 'submit.simple.php',
    saveKeyCodeURL: 'submit.keycode.php',
    startPage: 'consent', // {'consent','demographic','instructions','trial','posttest'}
    condition: ['control', 'childes', 'COCAnews', 'COCAfic'],
    predictionType: 'probMatching',
    lm: '',
    totalTrials: 5, //adjust to how many trials you have
    nStimTrial: 2,
    stimOrder: [],
    sona: {
        experiment_id: 2132,
        credit_token: '11775c36fd90451782ea8429cd023247'
    },
    debug: false //set to false when ready to run
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

var char = { // character keycode
    number: 0,
    code: '',
    char: '',
    acceptPred: false,
    startTime: 0,
    time: 0
}

var postQhtml = "";
var predActive = false;
var alertMsg = null;

var client = parseClient();
var trialData = []; //store all data in json format
var data = [];
var keyCodeData = [];
