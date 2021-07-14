

function getPrediction(){
    var nWords = getStringLen($('#response').text());
    word.number = nWords;
    nWords = Math.min(nWords, 2); // if # words > 2, reduce to 2
    var nDict = ngram[nWords] // get which ngram dictionary
    
    //stuff here to get prediction from dictionary
    try {
        if(nWords == 0) { // look up unigram
            var predWord = getMaxKey(nDict); // get most likely next word
            predWord = predWord.charAt(0).toUpperCase() + predWord.slice(1); // capitalize first word
            return(predWord);
        } else { // look up bigram or trigram
            var lastWords = getLastNWords($('#response').text(), nWords).toLowerCase(); //previous word(s) & lower case
            var predWord = getMaxKey(nDict[lastWords]); // get most likely next word
            return(predWord);
        }
    } catch(error){ // if no word is predicted, return blank
        //console.error(error);
        return('');
    }
    
}

function showPrediction(){
    var charLen = $('#response').text().length;
    word.prediction = getPrediction();
    $('#response').append("<font id='predictedWord'>" + word.prediction + "</font>");
    setCarat(charLen); // set carat to before predicted word
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
