$(function() {
    let correctAnsw=0;
    let incorrectAnsw=0;
    let unanswered=0;
    let qNumber = 0 ;
    let timeCounter = 30;
    let interval_15 = 0;
    let isEndOfGame = false;
    let newGameIndex = 0;
    let questionArr = [];
    let questions_correct_answer = "";
    var categoriesArray = [];

   

    //console.log(categoriesArray)

    randomquestionGenerate(Math.floor(Math.random() * 10) + 9, 10);
    fetch("https://opentdb.com/api_category.php")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var categoriesRaw = data.trivia_categories;
            categoriesArray.push(categoriesRaw);
            categoriesRaw.forEach(function(categoriesList) {
                categoriesArray.push(categoriesList);
            })
        });

    function randomquestionGenerate(id, length) {
        
        var db = "https://opentdb.com/api.php?";
        var query = db + "amount=" + length + "&category=" + id + "&type=multiple";
        var fetchInit = {
            credentials: "same-origin"
        }
    
        fetch(query, fetchInit)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                createQuestions(data.results);
                console.log(data.results);
            })
    };
function createQuestions(questions) {
            

    function showQ(){
        let qNumberX = questions[qNumber].question;
        console.log(qNumberX);
        let showQuestionNum = qNumber + 1;
        let sayQuestion = "Question " + showQuestionNum + ": " + qNumberX;
        //speak
        responsiveVoice.cancel();
        responsiveVoice.speak(sayQuestion, "US English Male");
        $('#questionId').html(sayQuestion);
        $('.radio').show();
        $( "#answ1" ).prop( "checked", false );
        $( "#answ2" ).prop( "checked", false );
        $( "#answ3" ).prop( "checked", false );
        $( "#answ4" ).prop( "checked", false );
        
        questionArr [0] = questions[qNumber].incorrect_answers[0];
        questionArr [1] = questions[qNumber].incorrect_answers[1];
        questionArr [2] = questions[qNumber].incorrect_answers[2];
        questionArr [3] = questions[qNumber].correct_answer;
        questions_correct_answer = questions[qNumber].correct_answer;
        questionArr.sort();


        console.log(questionArr);
        //speak
        responsiveVoice.speak("1: " + questionArr[0], "US English Male");
        $('#answ1').get(0).nextSibling.textContent = questionArr[0];
        responsiveVoice.speak("2: " + questionArr[1], "US English Male");
        $('#answ2').get(0).nextSibling.textContent = questionArr[1];
        responsiveVoice.speak("3: " + questionArr[2], "US English Male");
        $('#answ3').get(0).nextSibling.textContent = questionArr[2];
        responsiveVoice.speak("4: " + questionArr[3], "US English Male");
        $('#answ4').get(0).nextSibling.textContent = questionArr[3];

    }
    ////////////////////////////////////////////////////////////////
    //showing topic category
     console.log("questions");
    $("#topic").html(questions[qNumber].category);

    function nextQuestion(){
        responsiveVoice.cancel();
        timeCounter = 30;
        newGameIndex = 0;
        if(qNumber < 10){
            showQ(qNumber);
            qNumber++;
        }else{
            isEndOfGame = true;
            clearInterval(interval_15);
            $("#showTimer").html("");
            $('.radio').hide();
            //speak
            responsiveVoice.speak("Completed! Let's see the result", "US English Male");
            $('#questionId').html("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Completed! Let's see the result");
            //speak
            responsiveVoice.speak("The correct answers: "+ correctAnsw , "US English Male");
            $('#questionId').append('<br><p>The Correct answers: '+ correctAnsw + '</p>');
            //speak
            responsiveVoice.speak("The incorrect answers: "+ incorrectAnsw , "US English Male");
            $('#questionId').append('<p>The Incorrect answers: '+ incorrectAnsw + '</p>');
            //speak
            responsiveVoice.speak("The unanswered: "+ unanswered , "US English Male");
            $('#questionId').append('<p>The Unanswered: '+ unanswered + '</p><br>');

            
            let userPointsCalculate = correctAnsw*10 - incorrectAnsw;
            responsiveVoice.speak("Your Total Score is : "+ userPointsCalculate , "US English Male");
            // send the result to firebase database
            console.log("userID");
            
            firebase.auth().onAuthStateChanged((userPointLog) => {
                if (userPointLog) {
                  userId = userPointLog.uid;
                  displayName = userPointLog.displayName;
                  imageUrl = userPointLog.photoURL;

                  function writeUserData(userId, displayName, imageUrl) {
                    firebase.database().ref('users/' + userId).set({
                      displayName: displayName,
                      profile_picture : imageUrl,
                      userPoints: userPointsCalculate
                    });
                  }
                  writeUserData(userId, displayName, imageUrl);
                   // show score board
                        //moved to script.js
                   // end score board
                }
              });
            
            interval_15 = setInterval(function(){
                if(timeCounter>=0){
                    
                    $("#showTimer").html("Be ready for new game in: " + timeCounter + " Seconds");
                    timeCounter --;
                    newGameIndex ++;
                    if(newGameIndex == 16){
                        clearInterval(interval_15);
                        newGame();
                    }
                }
                
            }, 1000);
            
        }
        
        
    }
    function newGame(){
        correctAnsw=0;
        incorrectAnsw=0;
        unanswered=0;
        qNumber = 0 ;
        timeCounter = 30;
        interval_15 = 0;
        isEndOfGame = false; 
        responsiveVoice.cancel();
        run();
    }
    function run()
    {
        $("#showTimer").html("");
        nextQuestion();
        if(!isEndOfGame)
        {
        //speak
            
            interval_15 = setInterval(function(){
                if(timeCounter>=0){
                    
                    $("#showTimer").html("Be ready for next one in: "+timeCounter+" Seconds");
                    timeCounter --;
                }
                else{
                    unansweredFunc(qNumber);
                    clearInterval(interval_15);
                }
                
            }, 1000);
        }
    }
    $('input:radio[name="optradio"]').change(
        function(){
            clearInterval(interval_15);
            $("#showTimer").html("");
            if ($(this).is(':checked')) {
                if($(this).get(0).nextSibling.textContent == questions_correct_answer) // correct answer is selected
                {
                    //speak
                    responsiveVoice.speak("Correct!", "US English Male");
                    correctAnswer();
                }
                else{ // incorrect answer is selected
                    //speak
                    responsiveVoice.speak("Incorrect!", "US English Male");
                    incorrectAnswer();
                }
            }
    });
    function correctAnswer(){
        
        $("#showTimer").html("");
        $('.radio').hide();
        correctAnsw++;
        $('#questionId').html("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Correct!");
        $('#answ1').get(0).nextSibling.textContent = '';
        $('#answ2').get(0).nextSibling.textContent = '';
        $('#answ3').get(0).nextSibling.textContent = '';
        $('#answ4').get(0).nextSibling.textContent = '';    

        timeCounter = 3;
        let interval3_co = setInterval(function(){
            if(timeCounter>0)
            {
                $("#showTimer").html("Be ready for next one in: "+timeCounter+" Seconds");
                timeCounter--;
            }
            else{
                clearInterval(interval3_co);
                run();
            }
        }, 1000);
    }
    function incorrectAnswer(){
        $("#showTimer").html("");
        $('.radio').hide();
        incorrectAnsw++;
        $('#questionId').html("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Incorrect!");
        $('#answ1').get(0).nextSibling.textContent = '';
        $('#answ2').get(0).nextSibling.textContent = '';
        $('#answ3').get(0).nextSibling.textContent = '';
        $('#answ4').get(0).nextSibling.textContent = '';   
        timeCounter = 3; 
        let interval3_in = setInterval(function(){
            if(timeCounter>0)
            {
                $("#showTimer").html("Be ready for next one in: "+timeCounter+" Seconds");
                timeCounter--;
            }
            else{
                clearInterval(interval3_in);
                run();
            }
        }, 1000);
    }
    function unansweredFunc(qNumber1){
        $("#showTimer").html("");
        $('.radio').hide();
        unanswered++;
        $('#questionId').html("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp The Answer is: "+ questions_correct_answer);
        $('#answ1').get(0).nextSibling.textContent = '';
        $('#answ2').get(0).nextSibling.textContent = '';
        $('#answ3').get(0).nextSibling.textContent = '';
        $('#answ4').get(0).nextSibling.textContent = '';    
        responsiveVoice.speak("Answer is:" + questions_correct_answer, "US English Male");
        timeCounter = 3;
        let interval3_un = setInterval(function(){
            if(timeCounter>0)
            {
                $("#showTimer").html("Be ready for next one in: "+timeCounter+" Seconds");
                timeCounter--;
            }
            else{
                clearInterval(interval3_un);
                run();
            }
        }, 1000);
    }
    run();
        

    }// end of questions
});