var expt = { //add conditions here
    saveURL: 'submit.simple.php',
    startPage: 'trial', // {'consent','trial'}
    totalTrials: 2, //adjust to how many trials you have
    debug: false //set to false when ready to run
};

var trial = {
    number: 1, //which trial is this? //1-indexed
    startTime: 0,
    endTime: 0,
    totalTime: 0
}
var client = parseClient();
var trialData = []; //store all data in json format
var vidData = [];
