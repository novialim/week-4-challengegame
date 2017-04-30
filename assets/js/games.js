$(document).ready(function() {
    console.log( "ready!" );

    var attackPower;
    var counterAttackPower;
    var attackerHP;
    var defenderHP;
    var currentScore = 0;
    var isEnemyChosen = false;
    var gameWon = false;
	var fightCharacter = [];
    var allCharacter = [];

    reset();


	function drawAllImage(numOfImage, targetSection){
		for(var i=0; i<numOfImage; i++){

			console.log("hit 1: "+i);

			var characterDiv = document.createElement("div"); // create div element
			characterDiv.className=allCharacter[i].charClass; // add unique character name as class name
			$('#'+targetSection).append(characterDiv);
			$(characterDiv).append("<span>"+allCharacter[i].name+"</span>");
	    	$(characterDiv).append($('<img>',{src:'./assets/images/'+allCharacter[i].scr+'',alt:'character'+allCharacter[i].charClass+''}));
			$(characterDiv).append($('<span>',{class:'HP'+allCharacter[i].charClass+''}));

			$('.HP'+allCharacter[i].charClass).text(allCharacter[i].healthPoints);

			console.log("hit 2: "+i);
		}
	}

	function drawSelectedImage(imageIndex, targetSection){

		var characterDiv = document.createElement("div"); // create div element
		characterDiv.className=allCharacter[imageIndex].charClass; // add unique character name as class name
		$('#'+targetSection).append(characterDiv);
		$(characterDiv).append("<span>"+allCharacter[imageIndex].name+"</span>");
    	$(characterDiv).append($('<img>',{src:'./assets/images/'+allCharacter[imageIndex].scr+'',alt:'character'+allCharacter[imageIndex].charClass+''}));
		$(characterDiv).append($('<span>',{class:'HP'+allCharacter[imageIndex].charClass+''}));

		$('.HP'+allCharacter[imageIndex].charClass).text(allCharacter[imageIndex].healthPoints);
	
	}

	// Add transparent placeholder
	$('#charChosen').prepend($('<img>',{id:'placeholder',src:'./assets/images/placeholder.png'}));

	// Chose your character
	$(document).on("click", "#charStartPos img", function(evt) {
		// on click get div parent class of img
		var chosen_imgClass = $(this).parent().attr('class');
		var chosen_index;

		// Remove all images from #charStartPos section
		$("#charStartPos").empty();
		// Remove placeholder image from #charChosen section
		$("#placeholder").remove();

		// remove chosen object from obj array
		for (var i =0; i < allCharacter.length; i++){
		   	if (allCharacter[i].charClass === chosen_imgClass) {
				
				// Draw selected image at #charChosen section
				drawSelectedImage(i, "charChosen");

				fightCharacter.push(allCharacter[i]);

				// Remove selected from original character object array
		      	allCharacter.splice(i,1);
		      	break;
		   }
		}

		// Load remaining defending character images 
    	drawAllImage(allCharacter.length, "charRemaining");		 

		console.log("2nd Object Array List Count: "+allCharacter.length);
		console.log(chosen_imgClass);


	}); // End of chosen character

	// Chose enemy character and append to charDefender area
	$(document).on("click", "#charRemaining img", function() {

		if(!isEnemyChosen){
			// on click get div parent class of img
			var chosen_imgClass = $(this).parent().attr('class');
			var chosen_index;

			$("#attackerUpdate").text("");

			// Remove chosen image from #charStartPos section
			$("."+chosen_imgClass).remove();

			// remove chosen object from obj array
			for (var i =0; i < allCharacter.length; i++){
			   	if (allCharacter[i].charClass === chosen_imgClass) {
					
					// Draw selected image at #charChosen section
					drawSelectedImage(i, "charDefender");

					fightCharacter.push(allCharacter[i]);

					// Remove selected from original character object array
			      	allCharacter.splice(i,1);
			      	isEnemyChosen = true;
			      	break;
			   }
			}
		}	
	}); // End of chosen enemy character

			// {"name":"Darth Maul", "healthPoints":180, "attackPower":100, "counterAttackPower":100, "scr":"starwars3.png", "charClass":"characterDivdarthmaul"}

	$('#attackBtn').on("click", function() {
	
	if(fightCharacter.length==2 && !gameWon){ // When we have both attacker and defender selected

		// Attacker will be fightCharacter[0]; Defender will be fightCharacter[1]
		if((fightCharacter[0].healthPoints >0) && (fightCharacter[1].healthPoints >0)){	
			
			// When user click on attack, attacker HP -- defender counter Attack power
			fightCharacter[0].healthPoints -= fightCharacter[1].counterAttackPower;
			// When user click on attack, defender HP -- Attack Power
			fightCharacter[1].healthPoints -= fightCharacter[0].attackPower;	

			console.log("Char 1 HP: "+fightCharacter[0].healthPoints);
			console.log("Char 2 HP: "+fightCharacter[1].healthPoints);

			$(".HP"+fightCharacter[0].charClass).text(fightCharacter[0].healthPoints);			
			$(".HP"+fightCharacter[1].charClass).text(fightCharacter[1].healthPoints);

			$("#attackerUpdate").text("You attacked "+fightCharacter[1].name+" for " +fightCharacter[0].attackPower+" damage.");
			$("#defenderUpdate").text(fightCharacter[1].name+" attacked you back for " +fightCharacter[1].counterAttackPower+" damage.");

			fightCharacter[0].attackPower+=fightCharacter[0].attackPower;
		} 
		
		if ((fightCharacter[1].healthPoints <=0)){
			isEnemyChosen = false;
			// Remove chosen image from #charStartPos section
			$("."+fightCharacter[1].charClass).remove();
			$("#attackerUpdate").text("You have defeated " +fightCharacter[1].name+ ", You can chose to fight another enemy.");
			$("#defenderUpdate").text("");

			// Remove defeated character from fight character object array
		    fightCharacter.splice(1,1);
		}
		
		if(fightCharacter[0].healthPoints <=0){
			$("#attackerUpdate").text("You have been defeated. GAME OVER!!!");
			$("#defenderUpdate").text("");
			$("#restartBtn").css({"visibility":"visible"});
			isEnemyChosen = true;
		}

		if (allCharacter.length === 0)
		{
			$("#attackerUpdate").text("You won!!! GAME OVER!!!");	
			gameWon = true;
			$("#restartBtn").css({"visibility":"visible"});
		}
	}
	else if(gameWon){
		$("#attackerUpdate").text("Come on, you have won. Press the restart button duhz");	
	}
	else{
		$("#attackerUpdate").text("Please select your defender");	
	}


	}); // End of attack button click


	$('#restartBtn').on("click", function() {
			reset();
	}); // End of restart button click

    function reset(){

    	// Remove chosen image from #charStartPos section
		$("#charChosen").empty();
		$("#charRemaining").empty();
		$("#restartBtn").css({"visibility":"hidden"});

		isEnemyChosen = false;
	    gameWon = false;
		fightCharacter = [];
	    allCharacter = [
		    {"name":"Obi-Wan Kenobi", "healthPoints":120, "attackPower":8, "counterAttackPower":20, "scr":"starwars0.png", "charClass":"characterDivobiwankenobi"},
		    {"name":"Luke Skywalker", "healthPoints":100, "attackPower":20, "counterAttackPower":5, "scr":"starwars1.png", "charClass":"characterDivlukeskywalker"},
		    {"name":"Darth Sidious", "healthPoints":150, "attackPower":20, "counterAttackPower":20, "scr":"starwars2.png", "charClass":"characterDivdarthsidious"},
			{"name":"Darth Maul", "healthPoints":180, "attackPower":20, "counterAttackPower":25, "scr":"starwars3.png", "charClass":"characterDivdarthmaul"}
		];	

		// Load character images
	    drawAllImage(allCharacter.length, "charStartPos");

	    console.log("resetted character array length: "+allCharacter.length);
    }

		
   
}); // End of document ready ()