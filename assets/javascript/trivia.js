$(function() {

    var categoriesArray = [];
    //console.log(categoriesArray)

    questionGenerate(Math.floor(Math.random() * 10) + 9, 10);//parameters for the questiongenerate function

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

    function questionGenerate(id, length) {
        
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
                //console.log(data.results);
            })
    };

    function createQuestions(questions) {

        var points = 0;
        var count = 0;
        var choice;
        var answerIndex;

        $("#topic").html(questions[count].category);

        updateQuestion();

        document.querySelector("#answers").addEventListener("click", function() {
            
            var answers = document.getElementsByClassName("answer");

            if (event.target.id == "answers") {
                return;
            }
            for (var i = 0; i < answers.length; i++) {
                if (answers[i].classList.contains("selectedAnswer")) {
                answers[i].classList.remove("selectedAnswer");
                }
            }
            
            event.target.classList.add("selectedAnswer");
            choice = event.target.id;
        });

        $("#submitBtn").click(function() {
            var answers = document.getElementsByClassName("answer");
            if (choice == answerIndex) {
                answers[choice].classList.add("correctAnswer");
                points+=50;
                $("#userScore").html(`Your score: ${points}`);
                // console.log("user score: " + points);
            } 
            else {
                answers[choice].classList.add("incorrectAnswer");//highlisghts incorrect answer after submission
                answers[answerIndex].classList.add("correctAnswer");//highlights correct answer after submission
            }
            count++;
            // console.log("current count: " + count);
            setTimeout(function() {
                if (count < questions.length) {
                    updateQuestion();
                } 
                else {
                    questionGenerate(Math.floor(Math.random() * 10) + 9, 10);
                    count = 0;
                }
            }, 2000)
        });

        function updateQuestion() {

            var allAnswers = [];//creates array for the generated answers
            var correctAnswer = questions[count].correct_answer;

            $("#answers").empty();
            questions[count].incorrect_answers.forEach(function(answer) {
                allAnswers.push(answer);
            });
            
            allAnswers.join();
            allAnswers.splice(Math.floor(Math.random() * 4), 0, correctAnswer); //randomizes the order
            allAnswers.join();

            answerIndex = allAnswers.indexOf(correctAnswer);

            $("#question").html(questions[count].question);
            for (var i = 0; i < allAnswers.length; i++) {
                
                var answerList = document.createElement("li");
                var text = document.createTextNode(decodeHTML(allAnswers[i]));

                answerList.appendChild(text);
                answerList.classList.add("answer");
                answerList.id = i;
                document.getElementById("answers").appendChild(answerList);
            }

            function decodeHTML(html) {

                var text = document.createElement("textarea");

                text.innerHTML = html;
                return text.value;
            }
        }
    };

<<<<<<< HEAD
});
=======
});
>>>>>>> 550cc6cd34ddee75e097cb762ea7177d171c2986
