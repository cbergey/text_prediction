var demographicClient = { // filled out by participant
	country: "",
	gender: "",
	genderOther: "",
	race: "",
	raceOther: "",
	age: "",
	english: "",
	otherLangBirth: "",
	otherLangLater: "",
	education: "",
	occupation: "",
	disability: "",
	disabilityExplain: "",
	comments: ""
}

var postResponse = {};

function getAllChecked(name){
	let arr = [];
	$('input[name='+name+']:checked').each(function () {
		if(this.checked){
			arr.push($(this).val());
		}
	});
	return(arr)
}

function openExplain(value){
	$('#'+value+"Explain").prop("disabled",false);
}

function closeExplain(value){
	$('#'+value+"Explain").prop("disabled",true);
}

function submitDemo(){
	demographicClient.country = $('select[name = "country"] option:selected').val();
	demographicClient.gender = getAllChecked('gender');
	demographicClient.genderOther = $('#genderOther').val();
	demographicClient.race = getAllChecked('race');
	demographicClient.raceOther = $('#raceOther').val();
	demographicClient.age = $('#age').val();
	demographicClient.english = $('input[name = "english"]:checked').val();
	demographicClient.otherLangBirth = $('#otherLangBirth').val();
	demographicClient.otherLangLater = $('#otherLangLater').val();
	demographicClient.education = $('select[name = "education"] option:selected').val();
	demographicClient.occupation = $('#occupation').val();
	demographicClient.disability = $('input[name = "disability"]:checked').val();
	demographicClient.disabilityExplain = $('#disabilityExplain').val();

	client.demographic = demographicClient;
	saveData();
}



  ///////////////////////
 // Posttest questions//
///////////////////////

function showQuestions(){
	for(i in postQs){
		let qNum = parseInt(i) + 1;
		postQhtml += "<b style='font-size:18px'>" + qNum + ". </b>"
		switch(postQs[i]["type"]) {
			case "slider":
				postQhtml += addSlider(postQs[i]);
				break;
			case "radio":
				postQhtml += addRadio(postQs[i]);
				break;
		}
		postQhtml += "<br><br><br><br><br><br><br><br>";
	}
	$("#posttestSurvey").html(postQhtml);

	setupSlider();
}

function addSlider(qi){
	let id = qi["id"];
	let ans = qi["answers"];
	let questionHTML = "<label id=" + id + ">" + qi["question"];
	let sliderHTML = "<div class='sliderContainer'>" +
					 "<input id=" + id + "Slider name=" + id + "Slider class='slider inactiveSlider' type='range' min='0' max='100' value=''><br>" +
					 "<div class='min'><p>" + ans[0] + "</p></div>" + 
					 "<div class='max'><p>" + ans[1] + "</p></div>" + 
					 "</div>";
	return(questionHTML + sliderHTML + "</label>")
}

function addRadio(qi){
	let id = qi["id"];
	let ans = qi["answers"];
	let questionHTML = "<label id=" + id + ">" + qi["question"] + " ";
	let radioHTML = "";
	for(a in ans){
		radioHTML += "<input type='radio' name=" + id + "Radio value=" + ans[a] + "><label for=" + ans[a] + ">" + ans[a] + "</label>"
	}
	return(questionHTML + radioHTML + "</label>");
}

function setupSlider(){
	$('.slider').on('click input',
        function(){
            $(this).removeClass('inactiveSlider');
            $(this).addClass('activeSlider');
        });
}

function submitPosttest(){
	let checkResponse = true;
	for(i in postQs){
		let id = postQs[i]["id"];
		switch(postQs[i]["type"]) {
			case "slider":
				postResponse[id] = $("#"+id+"Slider").val(); 
				if($('#'+id+'Slider').hasClass('inactiveSlider')){
					checkResponse = false;
				}
				break;
			case "radio":
				postResponse[id] = $("input[name = " + id + "Radio]:checked").val(); 
				if($("input[name = " + id + "Radio]:checked").val() == undefined){
					checkResponse = false;
				}
				break;
		}
	}
	client.posttest = postResponse;
	saveData();
	return(checkResponse);
}










