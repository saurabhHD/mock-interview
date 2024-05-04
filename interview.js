let questions = [];
let answeredQuestions = [];
let currentQuestionIndex = 0;
let mediaStream;

// Function to get questions from local storage
function getQuestionsFromLocalStorage() {
  const storedQuestions = localStorage.getItem('questions');
  if (storedQuestions) {
    questions = JSON.parse(storedQuestions);
    displayQuestion();
    initializeCamera();
    updateProgressBar();
  } else {
    alert('No questions found. Please enter questions first.');
    window.location.href = 'index.html';
  }
}

// Function to display a question
function displayQuestion() {
  if (questions.length > 0) {
    let randomIndex = Math.floor(Math.random() * questions.length);
    while (answeredQuestions.includes(randomIndex)) {
      randomIndex = Math.floor(Math.random() * questions.length);
    }
    currentQuestionIndex = randomIndex;
    const questionText = document.getElementById('question-text');
    questionText.textContent = questions[currentQuestionIndex];
    readQuestion();
  } else {
    alert('No questions available.');
    window.location.href = 'index.html';
  }
}

// Function to read out the displayed question
function readQuestion() {
  const speechSynthesis = window.speechSynthesis;
  const questionText = questions[currentQuestionIndex];
  const utterance = new SpeechSynthesisUtterance(questionText);
  speechSynthesis.speak(utterance);
}

// Function to initialize camera
async function initializeCamera() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById('video');
    video.srcObject = mediaStream;
  } catch (error) {
    console.error('Error accessing camera: ', error);
    alert('Error accessing camera. Please check your camera permissions.');
  }
}

// Function to move to the next question
function nextQuestion() {
  if (answeredQuestions.length === questions.length) {
    alert('Interview completed!');
    return;
  }
  answeredQuestions.push(currentQuestionIndex);
  displayQuestion();
  updateProgressBar();
}

// Function to update progress bar
function updateProgressBar() {
  const progress = document.getElementById('progress');
  const percentage = (answeredQuestions.length / questions.length) * 100;
  progress.style.width = `${percentage}%`;
}

// Event listener for the "Next Question" button
document.getElementById('next-btn').addEventListener('click', nextQuestion);

// Load questions from local storage when the page loads
window.addEventListener('DOMContentLoaded', getQuestionsFromLocalStorage);
