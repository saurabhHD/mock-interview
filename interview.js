let questions = [];
let currentQuestionIndex = 0;
let mediaRecorder;
let recordedChunks = [];
let recognition;

// Function to get questions from local storage
function getQuestionsFromLocalStorage() {
  const storedQuestions = localStorage.getItem('questions');
  if (storedQuestions) {
    questions = JSON.parse(storedQuestions);
    displayQuestion();
    initializeCamera();
    initializeSpeechRecognition();
  } else {
    alert('No questions found. Please enter questions first.');
    window.location.href = 'index.html';
  }
}

// Function to save questions to local storage
function saveQuestionsToLocalStorage() {
  localStorage.setItem('questions', JSON.stringify(questions));
}

// Function to display a question
function displayQuestion() {
    if (questions.length > 0) {
      // Shuffle the questions array
      shuffleArray(questions);
      const questionText = document.getElementById('question-text');
      questionText.textContent = questions[currentQuestionIndex];
      readQuestion();
    } else {
      alert('No questions available.');
      window.location.href = 'index.html';
    }
  }
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
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
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const video = document.getElementById('video');
    video.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleRecordingStop;
    document.getElementById('start-recording-btn').disabled = false;
  } catch (error) {
    console.error('Error accessing camera: ', error);
    alert('Error accessing camera. Please check your camera and microphone permissions.');
  }
}

// Function to initialize speech recognition
function initializeSpeechRecognition() {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = 'en-US';
  recognition.onstart = function() {
    muteSpeaker();
  };
  recognition.onend = function() {
    unmuteSpeaker();
  };
}

// Function to start speech recognition
function startSpeechRecognition() {
  recognition.start();
}

// Function to stop speech recognition
function stopSpeechRecognition() {
  recognition.stop();
}

// Function to mute speaker
function muteSpeaker() {
  const video = document.getElementById('video');
  if (video) {
    video.muted = true;
  }
}

// Function to unmute speaker
function unmuteSpeaker() {
  const video = document.getElementById('video');
  if (video) {
    video.muted = false;
  }
}

// Function to handle available data from MediaRecorder
function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
}

// Function to start recording
// Function to start recording
function startRecording() {
    recordedChunks = [];
    const questionText = questions[currentQuestionIndex];
    const questionVoice = getQuestionVoice(questionText);
    const utterance = new SpeechSynthesisUtterance(questionText);
    utterance.voice = questionVoice;
    utterance.onend = function() {
      // Mute the speaker after the question has been spoken
      muteSpeaker();
      // Start recording and speech recognition
      mediaRecorder.start();
      startSpeechRecognition();
      // Disable the start recording button
      document.getElementById('start-recording-btn').disabled = true;
      // Enable the stop recording button
      document.getElementById('stop-recording-btn').disabled = false;
    };
    // Speak the question
    speechSynthesis.speak(utterance);
  }
  
  
  
  // Function to get the voice for a given question text
  function getQuestionVoice(questionText) {
    const matchingQuestion = questions.find(question => question.text === questionText);
    if (matchingQuestion) {
      const voices = speechSynthesis.getVoices();
      const voiceName = matchingQuestion.voice;
      return voices.find(voice => voice.name === voiceName);
    }
    return null;
  }
  

// Function to stop recording and save the recorded media
function stopRecording() {
  mediaRecorder.stop();
  stopSpeechRecognition();
  document.getElementById('start-recording-btn').disabled = false;
  document.getElementById('stop-recording-btn').disabled = true;
}

// Function to handle recording stop
function handleRecordingStop() {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'interview.webm';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Function to move to the next question
function nextQuestion() {
  currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
  displayQuestion();
}

// Event listener for the "Next Question" button
document.getElementById('next-btn').addEventListener('click', nextQuestion);

// Event listener for the "Start Recording" button
document.getElementById('start-recording-btn').addEventListener('click', startRecording);

// Event listener for the "Stop Recording" button
document.getElementById('stop-recording-btn').addEventListener('click', stopRecording);

// Load questions from local storage and initialize camera when the page loads
window.addEventListener('DOMContentLoaded', getQuestionsFromLocalStorage);
