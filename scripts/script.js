$(document).ready(function() {

  // Make our variables global to the runtime of our application
  var questionNum = 0;
  var answer = null;
  var answer_i = null;
  var answer_status = null;
  var userScore = 0;
  var userName = null;
  var isSubmited = false;
  var isCompleted = false;
  var isStarted = false;
  var isNext = false;
  var isFinished = false;

  // get DOM selectors
  var startBtn = $(".btn");
  var question = $("#question");
  var choices = $("#choices");
  var addSubmitButton = $("#addSubmitButton");
  var addNextButton = $("#addNextButton");
  var addChoicesEl = $("#addChoices");
  var submitBtn = $("<button>");
  var nextBtn = $("<button>");
  var ansStatus = $(".status");
  var ansDisplay = $(".answer");
  var divBr = $("<br>");
  var divModalBtn = '<button type="button" class="btn btn-success">Finish</button>'
  var divUserInput = '<input class="form-control form-control-lg userNameInput" type="text" placeholder="Enter username to store score">'

  // Create question and multiple choices
  var tdChoices = $("<td>");

  choices.append(tdChoices);

  // Function to add choices for each question
  function addChoices(choices) {
    if(choices.length > 0){
      addChoicesEl.empty();
      // For each choice, create <tr> element
      choices.forEach(function(choice, i){
        var choiceListEl = $("<li>");
        var radioInput = $("<input>");
        var radioInputLabel = $("<label>");
      
        choiceListEl.attr("id", "choiceEl");
        radioInput.attr("data-index", i);
        radioInput.attr("type", "radio");
        radioInput.attr("id", "choice");
        radioInput.addClass("option-input radio");
        radioInput.attr("name", "choice");
        radioInput.attr("value", choice);
        radioInputLabel.attr("for", choice);
        radioInputLabel.text(choice);

        addChoicesEl.append(choiceListEl);
        choiceListEl.append(radioInput);
        choiceListEl.append(radioInputLabel);
        radioInputLabel.append($("<br>"));
        console.log(choiceListEl);
      }); 
    }
  }

  // Function to enter user details after successful completion of quiz
  function addToStorage(name,score){
    console.log()
  }
  // Prompt User to display score and enter User Name
  function promptScore(){
    submitBtn.hide();
    nextBtn.hide();
    question.text("Congratulations! Your final score is " + userScore + " / " + questions.length);
    question.append(divBr);
    question.append(divUserInput);
    question.append(divBr);
    question.append(divModalBtn);
  }

  // reset function
  function resetAll(){
    answer = null;
    answer_i = null;
    answer_status = null;
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    isSubmited=false;

    question.empty();
    addChoicesEl.empty();
    ansDisplay.empty();
    ansStatus.empty();
    onTimesUp();
    $("h5").text('')

    document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
    document.getElementById("base-timer-path-remaining").setAttribute("stroke-dasharray", 283);
    document.getElementById("base-timer-path-remaining").style.transition = "0.001s linear all";
  }

  // display Quiz
  function displayQuiz(){
    startTimer();

    // Display question
    console.log(questionNum);
    console.log(questions[questionNum].title);
    console.log(questions[questionNum].choices);

    // Display the question
    question.text(questions[questionNum].title);

    // Add choices to question
    addChoices(questions[questionNum].choices);
  }

  // display status
  function displayStatus(status){
    ansStatus.append($("<h5>").text(status));
  }

  // display answer
  function displayAnswer(answer){
    ansDisplay.append($("<h5>").text("Answer: " + answer));
  }

  // Function to read user input selection
  function getUserInput(){
    answer = $("input[name=choice]:checked").val();
    answer_i =  $("input[name=choice]:checked").attr("data-index");
    console.log("You have selected: " + answer);
    console.log("Index Position: ", answer_i)
  }

  // Function to validate the answer on submitting the answer
  function getResults(){
    if (!answer){
      alert("ERROR: Select at least one answer!")
      return;
    }

    // Disable remaining options
    console.log(answer_i);
    for (var i=0; i<questions[questionNum].choices.length; i++) {
      if (i === answer_i){
        return;
      }
      else{
        $("[data-index="+i+"]").attr('disabled',true);
      }
    }

    // Validate the anawer
    if( answer != questions[questionNum].answer) {
      //console.log($("[data-index="+answer_i+"]"))
      $("[data-index="+answer_i+"]").addClass("error");
      // $("#choiceEl").css('background-color', '#000');

      // Display status
      displayStatus("Wrong!!!");
      $(".status").css("--ansColor", "red");

      // Display correct answer:
      displayAnswer(questions[questionNum].answer);
    }
    else{
      displayStatus("Correct!");
      $(".status").css("--ansColor", "green");
      userScore = userScore+1;
    }
  }

  // Add the score to local storage
  function addToLocalStorage(obj) {
    localStorage.setItem('quizScore', JSON.stringify(obj))
  }

  // Render the scores in Highscores page
  function renderFromStorage(obj) {
    var scores = JSON.parse(localStorage.getItem('quizScore'));

    if (scores) {
      var scoreListEl = $("<ul>");
      $("#scores").append(scoreListEl);

      for (i=0; i < length(scores); i++){
        var scoreUl = $("<li>");
        scoreUl.text(scores[i]);
      }
    }
  }

  // Begins the quiz functionality
  startBtn.click(function(){
    console.log("Quiz started!");
    isStarted = true;

    if (isStarted){
      startBtn.hide();
      questionNum++
    }

    // Adding submit button
    submitBtn.attr("id", "submit-button");
    submitBtn.attr("value", "Submit");
    submitBtn.attr("class", "btn btn-dark clear");
    submitBtn.append($("<span>").text("Submit"));
    addSubmitButton.append(submitBtn);

    // Adding Next button
    nextBtn.attr("id", "submit-button");
    nextBtn.attr("value", "Submit");
    nextBtn.attr("class", "btn btn-dark clear");
    nextBtn.append($("<span>").text("Next"));
    addNextButton.append(nextBtn);
    
    // Display question and choices
    displayQuiz();

    // Listener to getUser input from radio type button
    $("input[name=choice]").click(function(){
      getUserInput();
    });

    // Listener event function to get results on submit
    submitBtn.click(function(){
      // If answers already submited, just return;
      if(isSubmited){
        return;
      }
      // Set submitted to true
      isSubmited = true;
      // Validate the answer
      onTimesUp() 
      getResults();
      // if all questions have completed, redirect to local storage functionality
    });

    // Implementation for next button listener
    nextBtn.click(function(){
      // Validate if user selected the answer
      if (!answer){
        console.log(answer);
        alert("ERROR: Select at least one answer and submit!")
        return;
      }
      // Validate if user submited the answer
      if (!isSubmited){
        console.log(isSubmited);
        alert("ERROR: Select at least one answer and submit!")
        return;
      }

      // Verify if quiz is completed
      if(questionNum+1 === questions.length){
        resetAll();
        promptScore()
        alert("Congrats! Quiz completed successfully");
      } else {
        // Get the next question
        questionNum++;
        // reset the timer and answer variables
        resetAll();
        // Display question and choices
        onTimesUp();
        displayQuiz();
        // Listener to getUser input from radio type button
        $("input[name=choice]").click(function(){
          getUserInput();
        });
        // Listener event function to get results on submit
        submitBtn.click(function(){
          // If answers already submited, just return;
          if(isSubmited){
            return;
          }
          // Set submitted to true
          isSubmited = true;
          // Validate the answer
          getResults();
          // if all questions have completed, redirect to local storage functionality
        });
      }
    });
  });

  // Function to store the user name and score in local storage
  $(".btn-sucess").click(function(){
    console.log("Entered Finish Button");

    // If user already submitted, return
    if(isFinished){
      return;
    }

    userName = $(".userNameInput").val();
    isFinished = true;
  })
});