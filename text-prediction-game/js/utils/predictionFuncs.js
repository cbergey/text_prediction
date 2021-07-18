

function getPrediction(){
    // return("you"); //for testing text functions
    var nWords = getStringLen($('#response').text());
    word.number = nWords;
    nWords = Math.min(nWords, 2); // if # words > 2, reduce to 2
    var nDict = ngram[nWords] // get which ngram dictionary
    
    //stuff here to get prediction from dictionary
    try {
        if(nWords == 0) { // look up unigram
            /* When no words already, predict most common unigram */
            // var predWord = getMaxKey(nDict); // get most likely next word
            // predWord = predWord.charAt(0).toUpperCase() + predWord.slice(1); // capitalize first word

            /* When no words already, predict nothing */
            predWord = '';
            return(predWord);
        } else { // look up bigram or trigram
            try {
                var lastWords = getLastNWords($('#response').text(), nWords).toLowerCase(); //previous word(s) & lower case
                var predWord = getMaxKey(nDict[lastWords]); // get most likely next word
                return(predWord);
            } catch(error) { // if we don't have enough known context, back off on amount of context
                nWords = nWords == 1 ? 1 : nWords - 1;
                var lastWords = getLastNWords($('#response').text(), nWords).toLowerCase(); //previous word(s) & lower case
                var predWord = getMaxKey(nDict[lastWords]); // get most likely next word
                return(predWord);
            }
        }
    } catch(error){ // if no word is predicted, return blank
        //console.error(error);
        return('');
    }
    
}

function showPrediction(){
    let charLen = $('#response').text().length;
    word.prediction = getPrediction();
    $('#response').append("<font id='predictedWord'>" + word.prediction + "</font>");
    setCaret(charLen); // set carat to before predicted word
    word.acceptPred = false; //reset whether prediction was accepted
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

function getMaxKey(d){
    return(Object.entries(d).reduce((a, b) => a[1] > b[1] ? a : b)[0])
}

function getNMaxKeys(d, n){
    let sortArr = [];
    for(k in d){
        sortArr.push([k, d[k]]);
    }
    sortArr.sort(function(a, b) {
        return b[1] - a[1];
    });
    return(sortArr.slice(0, n));
}

