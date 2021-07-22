

function getPrediction(callfunction){
    // return("you"); //for testing text functions
    var nWords = getStringLen($('#response').text());
    word.number = nWords;
    nWords = Math.min(nWords, 2); // if # words > 2, reduce to 2
    var nDict = ngram[nWords] // get which ngram dictionary
    
    //stuff here to get prediction from dictionary
    try {
        if(nWords == 0) { // look up unigram
            /* When no words already, predict most common unigram */
            // let predWord = getMaxKey(nDict); // get most likely next word
            // predWord = predWord.charAt(0).toUpperCase() + predWord.slice(1); // capitalize first word

            /* When no words already, predict nothing */
            let predWord = '';
            return(predWord);
        } else { // look up bigram or trigram
            try {
                let lastWords = getLastNWords($('#response').text(), nWords).toLowerCase(); //previous word(s) & lower case
                // ~~ functions ~~
                // getMax = get most freq word
                // getProbMatch = stochastically choose from the normed 10-most freq words
                let predWord = callfunction(nDict[lastWords]); 
                return(predWord);
            } catch(error) { // if we don't have enough known context, back off on amount of context
                nWords = nWords == 1 ? 1 : nWords - 1;
                let lastWords = getLastNWords($('#response').text(), nWords).toLowerCase(); //previous word(s) & lower case
                let predWord = callfunction(nDict[lastWords]); // call function again
                return(predWord);
            }
        }
    } catch(error){ // if no word is predicted, return blank
        //console.error(error);
        return('');
    }
    
}

function showPrediction(){
    if(expt.condition != "control"){
        let charLen = $('#response').text().length;
        word.prediction = getPrediction(getProbMatch);
        $('#response').append("<font id='predictedWord'>" + word.prediction + "</font>");
        setCaret(charLen); // set carat to before predicted word
        word.acceptPred = false; //reset whether prediction was accepted
    }
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




    //////////////////////////////////
   //////// Helper Functions ////////
  //////////////////////////////////

function getMax(d){
    return(Object.entries(d).reduce((a, b) => a[1] > b[1] ? a : b)[0])
}

function getNMax(d, n){
    let sortArr = [];
    for(k in d){
        sortArr.push([k, d[k]]);
    }
    sortArr.sort(function(a, b) {
        return b[1] - a[1];
    });
    return(sortArr.slice(0, n));
}

function getProbMatch(d) {
    let rand = Math.random();
    d = getNMax(d, 10);
    let sumProb = Object.keys(d).reduce((sum, key) => sum+parseFloat(d[key][1]||0),0);
    let cumulProb = 0;
    for(k in d){
        cumulProb += d[k][1] / sumProb; // get cumulative probability
        d[k].push(cumulProb);
        if(rand <= cumulProb){ // compare to random number sample
            return(d[k][0]) // return word if it is the first cumulative prob less than the sample
        }
    }
}
















