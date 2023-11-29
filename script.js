document.addEventListener("DOMContentLoaded", function () {
  var questionBox = document.getElementById("question-box");
  var optionsContainer = document.getElementById("options-container");
  var answerStatus = document.getElementById("answer-status");
  var resultContainer = document.getElementById("result-container");
  var resultMessage = document.getElementById("result-message");
  var currentLanguage = "sl";
  var currentQuestionIndex = 0;
  var currentResults = [];
  var questions;

  // Fetch questions from the JSON file
  var originalQuestions;

  fetch("vprasanje.json")
    .then((response) => response.json())
    .then((data) => {
      originalQuestions = data;
      shuffleQuestions();
    })
    .catch((error) => console.error("Error fetching questions:", error));

  function shuffleQuestions() {
    questions = JSON.parse(JSON.stringify(originalQuestions));

    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];

      for (let lang in questions[i].options) {
        questions[i].options[lang] = shuffleArray(questions[i].options[lang]);
      }
    }

    displayQuestion();
  }

  function shuffleArray(array) {
    const shuffledArray = [...array];

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
  }

  // Function to display a question
function displayQuestion() {
  var currentQuestion = questions[currentQuestionIndex];

  var questionCounter = document.getElementById("question-counter");
  questionCounter.textContent = `${currentLanguage === 'sl' ? 'Vprašanje' : 'Question'} ${currentQuestionIndex + 1}/${questions.length}`;

  // Display the question in the current language
  questionBox.innerHTML = "<p>" + currentQuestion.question[currentLanguage] + "</p>";

  optionsContainer.innerHTML = "";
  answerStatus.innerHTML = ""; // Clear previous counter dots

  currentQuestion.options[currentLanguage].forEach(function (option, i) {
    var optionContainer = document.createElement("div");
    optionContainer.className = "option-container";

    // Answer option
    var optionBox = document.createElement("div");
    optionBox.className = "options-box"; // Add a class here
    optionBox.innerHTML = option;
    optionBox.onclick = function () {
      checkAnswer(i); // Pass the index of the selected answer
    };

    optionContainer.appendChild(optionBox);
    optionsContainer.appendChild(optionContainer);

      optionContainer.appendChild(optionBox);
      optionsContainer.appendChild(optionContainer);
    });
  }

  var questionCounter = document.getElementById("question-counter");

  function updateQuestionCounterText() {
    if (currentLanguage === "sl") {
      questionCounter.textContent = `Vprašanje ${currentQuestionIndex + 1}/${questions.length}`;
    } else if (currentLanguage === "en") {
      questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    }
  }

  function checkAnswer(selectedAnswerIndex) {
    console.log("Checking answer...");
    var currentQuestion = questions[currentQuestionIndex];
    var dots = document.querySelectorAll(".dot");

    if (!currentQuestion) {
      console.error("Error: Current question is undefined.");
      return;
    }

    selectedAnswerIndex = Number(selectedAnswerIndex);
    var selectedAnswerText = currentQuestion.options[currentLanguage][selectedAnswerIndex];

    var isCorrect = selectedAnswerText.startsWith(" ");

    handleAnswerFeedback(isCorrect, selectedAnswerIndex);

    currentResults.push(isCorrect);

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      console.log("Moving to the next question...");
      displayQuestion();
    } else {
      console.log("All questions answered, showing results...");
      showResults();
    }
  }

  function handleAnswerFeedback(isCorrect, selectedAnswerIndex) {
    console.log(isCorrect ? "Correct!" : "Incorrect.");

    document.body.classList.add(isCorrect ? "correct-flash" : "incorrect-flash");

    var answerButton = optionsContainer.children[selectedAnswerIndex].querySelector(".options-box");
    answerButton.classList.add(isCorrect ? "correct-flash" : "incorrect-flash");

    setTimeout(function () {
      document.body.classList.remove("correct-flash", "incorrect-flash");
      answerButton.classList.remove("correct-flash", "incorrect-flash");
    }, 500);
  }

  // Function to show quiz results
function showResults() {
  // Calculate the number of correct answers
  var correctCount = currentResults.filter((result) => result).length;

  // Display results in the result container
  resultContainer.style.display = "block";

  // Update the content of the result message based on the current language
  var resultMessage = document.getElementById("result-message");
  resultMessage.textContent = getResultMessage(correctCount);

  // Update the "Quiz Results" header based on the current language
  var quizResultsHeader = document.getElementById("quiz-results-header");
  quizResultsHeader.textContent = getQuizResultsHeader();

  // Hide everything else
  questionBox.style.display = "none";
  optionsContainer.style.display = "none";
  answerStatus.style.display = "none";

}

// Function to get the result message based on the current language
function getResultMessage(correctCount) {
  if (currentLanguage === "sl") {
    return `Dobili ste ${correctCount} od 10 pravilnih odgovorov.`;
  } else {
    return `You got ${correctCount} out of 10 correct answers.`;
  }
}

// Function to get the "Quiz Results" header text based on the current language
function getQuizResultsHeader() {
  var headerElement = document.getElementById("quiz-results-header");

  if (currentLanguage === "sl") {
    headerElement.textContent = "Rezultati kviza";
  } else {
    headerElement.textContent = "Quiz Results";
  }

}

  window.restartQuiz = function (language) {
    currentQuestionIndex = 0;
    currentResults = [];

    currentLanguage = language;

    updateQuestionCounterText();

    var resultContainer = document.getElementById("result-container");
    resultContainer.style.display = "none";
    resultMessage.textContent = "";

    var questionBox = document.getElementById("question-box");
    questionBox.style.display = "grid";
    questionBox.innerHTML = "";

    var optionsContainer = document.getElementById("options-container");
    optionsContainer.style.display = "grid";
    optionsContainer.innerHTML = "";

    var answerStatus = document.getElementById("answer-status");
    answerStatus.innerHTML = "";

    setTimeout(function () {
      shuffleQuestions();
    }, 100);
  };
});
