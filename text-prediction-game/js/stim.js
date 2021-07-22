var stim = [];
for(i=0; i<10; i++){
	stim.push("Frog"+i+".png");
}

var ngram = {
	// "childes": {
		"0": childes_unigram,
		"1": childes_bigram,
		"2": childes_trigram
	// }, 
	// "COCA": {
	// 	"0": COCA_unigram,
	// 	"1": COCA_bigram,
	// 	"2": COCA_trigram
	// }
	
}