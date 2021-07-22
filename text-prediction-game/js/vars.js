var expt = { //add conditions here
    saveURL: 'submit.simple.php',
    saveKeyCodeURL: 'submit.keycode.php',
    startPage: 'instructions', // {'consent','demographic','instructions','trial','posttest'}
    condition: 'childes', //['control', 'childes', 'COCAnews', 'COCAfic'],
    predictionType: 'probMatching',
    lm: '',
    totalTrials: 5, //adjust to how many trials you have
    nStimTrial: 2,
    stimOrder: [],
    postQhtml: '',
    // sona: {
    //     experiment_id: 1505,
    //     credit_token: 'b20092f9d3b34a378ee654bcc50710ea'
    // },
    debug: true //set to false when ready to run
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

var predActive = false;
var alertMsg = null;

var client = parseClient();
var trialData = []; //store all data in json format
var data = [];
var keyCodeData = [];
