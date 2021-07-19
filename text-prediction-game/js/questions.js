var demographicClient = { // filled out by participant
	country: "",
	gender: "",
	age: "",
	english: "",
	otherLangBirth: "",
	otherLangLater: "",
	education: "",
	occupation: "",
	comments: ""
}

function submitDemo(){
	demographicClient.country = $('select[name = "country"] option:selected').val();
	demographicClient.gender = $('input[name = "gender"]:checked').val();
	demographicClient.age = $('#age').val();
	demographicClient.english = $('input[name = "english"]:checked').val();
	demographicClient.otherLangBirth = $('#otherLangBirth').val();
	demographicClient.otherLangLater = $('#otherLangLater').val();
	demographicClient.country = $('select[name = "education"] option:selected').val();
	demographicClient.occupation = $('#occupation').val();

	client.demographic = demographicClient;
}