// Function to get questions from local storage
function getQuestionsFromLocalStorage() {
    const storedQuestions = localStorage.getItem('questions');
    if (storedQuestions) {
      return JSON.parse(storedQuestions);
    } else {
      return [];
    }
  }
  
  // Function to save questions to local storage
  function saveQuestionsToLocalStorage(questions) {
    localStorage.setItem('questions', JSON.stringify(questions));
  }
  
  // Function to add questions entered by the user
  function addQuestions() {
    const questionInput = document.getElementById('question-input');
    const inputQuestions = questionInput.value.trim().split('\n').filter(question => question.trim() !== '');
    if (inputQuestions.length > 0) {
      const existingQuestions = getQuestionsFromLocalStorage();
      const allQuestions = [...existingQuestions, ...inputQuestions];
      saveQuestionsToLocalStorage(allQuestions);
      window.location.href = 'interview.html';
    } else {
      alert('Please enter at least one question.');
    }
  }

  // Function to clear all questions
function clearAllQuestions() {
  // Clear questions from local storage
  localStorage.removeItem('questions');
  // Clear questions array
  questions = [];
  // Clear textarea
  document.getElementById('question-input').value = '';
}

// Event listener for the "Clear All Questions" button
document.getElementById('clear-all-questions-btn').addEventListener('click', clearAllQuestions);

  
  // Function to populate textarea with questions from local storage
  function populateTextarea() {
    const questionInput = document.getElementById('question-input');
    const existingQuestions = getQuestionsFromLocalStorage();
    questionInput.value = existingQuestions.join('\n');
  }
  
  // Event listener for the "Add Questions" button
  document.getElementById('add-question-btn').addEventListener('click', addQuestions);
  
  // Populate textarea with questions from local storage when the page loads
  window.addEventListener('DOMContentLoaded', populateTextarea);
  