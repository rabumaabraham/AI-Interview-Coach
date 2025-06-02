const startBtn = document.getElementById('startInterview');
const aiQuestionDiv = document.getElementById('aiQuestion');
const userAnswerDiv = document.getElementById('userAnswer');
const feedbackDiv = document.getElementById('feedback');
const jobDescriptionInput = document.getElementById('jobDescription');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];

function speak(text, callback) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onend = callback;
  speechSynthesis.speak(utterance);
}

function askNextQuestion() {
  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];
    aiQuestionDiv.innerText = `AI: ${question}`;
    speak(question, () => {
      recognition.start();
    });
  } else {
    aiQuestionDiv.innerText = "Interview finished. Thank you!";
    
    // Request feedback after the interview is finished
    fetchFeedback();
  }
}

recognition.onresult = (event) => {
  const answer = event.results[0][0].transcript;
  userAnswerDiv.innerText = `You: ${answer}`;
  userAnswers.push(answer);  // Store the answer
  currentQuestionIndex++;
  setTimeout(askNextQuestion, 1000);
};



function fetchFeedback() {
  // Send the feedback request to the backend
  fetch('http://localhost:5000/api/questions/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questions: questions,
      userAnswers: userAnswers
    })
  })
    .then(res => res.json())
    .then(data => {
      feedbackDiv.innerText = `Feedback:\n\n${data.feedback}`;
    });
}

startBtn.addEventListener('click', () => {
  const jobDescription = jobDescriptionInput.value;

  fetch('http://localhost:5000/api/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobDescription })
  })
    .then(res => res.json())
    .then(data => {
      questions = data.questions;
      askNextQuestion();
    });
});


// faceeeeeeeeeeeeeeeeeeeeeeeeeee

const audioContext = new AudioContext();
let mediaRecorder;
let audioChunks = [];

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);

    audioChunks = [];

    mediaRecorder.ondataavailable = e => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks);
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.play();
      // You can extract pitch here with more code, or save audio for analysis
    };
  });

  // send faceeeeeeeeeeeeeeeeeeee

  function fetchFeedback() {
    fetch('http://localhost:5000/api/questions/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questions: questions,
        userAnswers: userAnswers,
        facialData: expressionData  // Include facial emotion data
      })
    })
    .then(res => res.json())
    .then(data => {
      feedbackDiv.innerText = `Feedback:\n\n${data.feedback}`;
    });
  }
  

