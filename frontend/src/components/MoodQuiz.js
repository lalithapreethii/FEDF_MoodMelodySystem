import React, { useState } from 'react';
import MusicPlaylist from './MusicPlaylist';
import '../styles/MoodQuiz.css';

const questions = [
  {
    q: "If your mood had a weather pattern right now, it would be:",
    options: [
      { text: "☀️ Sunny and clear", mood: "Happy", score: { Happy: 3, Calm: 2 } },
      { text: "⛈️ A raging thunderstorm", mood: "Angry", score: { Angry: 3, Frustrated: 2 } },
      { text: "🌧️ A quiet, drizzly rain", mood: "Sad", score: { Sad: 3, Melancholic: 2 } },
      { text: "🌫️ Foggy and uncertain", mood: "Anxious", score: { Anxious: 3, Confused: 2 } },
      { text: "🌙 A calm, starry night", mood: "Peaceful", score: { Peaceful: 3, Content: 2 } }
    ]
  },
  {
    q: "What kind of social interaction sounds best to you at this moment?",
    options: [
      { text: "🎉 A big, loud party with friends", mood: "Energetic", score: { Happy: 2, Energetic: 3 } },
      { text: "💬 A deep one-on-one conversation", mood: "Thoughtful", score: { Calm: 2, Peaceful: 1 } },
      { text: "🚫 Absolutely none, I need space", mood: "Overwhelmed", score: { Sad: 2, Angry: 2, Anxious: 1 } },
      { text: "☕ A small, cozy gathering", mood: "Content", score: { Peaceful: 2, Happy: 1 } }
    ]
  },
  {
    q: "Pick an emoji that best captures your current state:",
    options: [
      { text: "😊 Joyful/Excited", mood: "Happy", score: { Happy: 3 } },
      { text: "😢 Sad/Disappointed", mood: "Sad", score: { Sad: 3 } },
      { text: "😠 Angry/Annoyed", mood: "Angry", score: { Angry: 3 } },
      { text: "🥰 Loving/Peaceful", mood: "Peaceful", score: { Peaceful: 3 } },
      { text: "😰 Anxious/Stressed", mood: "Anxious", score: { Anxious: 3 } },
      { text: "😐 Numb/Neutral", mood: "Neutral", score: { Calm: 1 } }
    ]
  },
  {
    q: "If you had an extra hour right now, you would most likely spend it:",
    options: [
      { text: "🎨 On a creative project", mood: "Inspired", score: { Happy: 2, Peaceful: 1 } },
      { text: "🏃 Exercising or being active", mood: "Energetic", score: { Energetic: 3, Happy: 1 } },
      { text: "😴 Napping or resting", mood: "Tired", score: { Sad: 2, Calm: 1 } },
      { text: "📺 Watching comfort shows", mood: "Anxious", score: { Anxious: 2, Sad: 1 } },
      { text: "💭 Venting to a friend", mood: "Frustrated", score: { Angry: 2, Anxious: 1 } }
    ]
  },
  {
    q: "How is your physical energy level feeling?",
    options: [
      { text: "⚡ Buzzing, ready to go!", mood: "Energetic", score: { Happy: 2, Energetic: 3 } },
      { text: "⚖️ Steady and balanced", mood: "Calm", score: { Calm: 3, Peaceful: 2 } },
      { text: "💤 Completely drained", mood: "Exhausted", score: { Sad: 3 } },
      { text: "😖 Restless and jittery", mood: "Anxious", score: { Anxious: 3 } }
    ]
  },
  {
    q: "What color best represents how you're feeling inside?",
    options: [
      { text: "🟡 Bright Yellow/Orange", mood: "Happy", score: { Happy: 3 } },
      { text: "🔵 Cool Blue/Green", mood: "Calm", score: { Calm: 3, Peaceful: 2 } },
      { text: "🔷 Dark Blue/Grey", mood: "Sad", score: { Sad: 3 } },
      { text: "🔴 Fiery Red", mood: "Angry", score: { Angry: 3 } },
      { text: "🟤 Murky Brown", mood: "Confused", score: { Anxious: 2, Sad: 1 } }
    ]
  },
  {
    q: "When you think about the day so far, what comes to mind first?",
    options: [
      { text: "😊 A moment that made me smile", mood: "Happy", score: { Happy: 3 } },
      { text: "🤔 A problem I'm figuring out", mood: "Anxious", score: { Anxious: 3 } },
      { text: "😔 A general heaviness", mood: "Sad", score: { Sad: 3 } },
      { text: "😤 Something that frustrated me", mood: "Angry", score: { Angry: 3 } },
      { text: "😌 Quiet and okay-ness", mood: "Peaceful", score: { Peaceful: 3, Calm: 2 } }
    ]
  }
];

const MoodQuiz = () => {
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [moodScores, setMoodScores] = useState({
    Happy: 0,
    Sad: 0,
    Angry: 0,
    Anxious: 0,
    Peaceful: 0,
    Calm: 0,
    Energetic: 0
  });

  function selectAnswer(option) {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    // Update mood scores
    const newScores = { ...moodScores };
    Object.keys(option.score).forEach(mood => {
      newScores[mood] = (newScores[mood] || 0) + option.score[mood];
    });
    setMoodScores(newScores);

    if (currentQuestion === questions.length - 1) {
      // Calculate final mood
      const finalMood = Object.keys(newScores).reduce((a, b) => 
        newScores[a] > newScores[b] ? a : b
      );
      
      console.log('✅ Quiz completed! Detected mood:', finalMood);
      setDetectedMood(finalMood);
      setQuizCompleted(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  }

  const handleRetakeQuiz = () => {
    setQuizCompleted(false);
    setDetectedMood(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setMoodScores({
      Happy: 0,
      Sad: 0,
      Angry: 0,
      Anxious: 0,
      Peaceful: 0,
      Calm: 0,
      Energetic: 0
    });
  };

  // Show playlist after quiz completion
  if (quizCompleted && detectedMood) {
    return <MusicPlaylist mood={detectedMood} onRetake={handleRetakeQuiz} />;
  }

  // Show quiz
  return (
    <div className="mood-quiz-container">
      <div className="quiz-card">
        <div className="question-section">
          <h2 className="question-text">{questions[currentQuestion].q}</h2>
        </div>

        <div className="options-grid">
          {questions[currentQuestion].options.map((opt, index) => (
            <button 
              key={index} 
              className="option-button"
              onClick={() => selectAnswer(opt)}
            >
              <span className="option-text">{opt.text}</span>
              <span className="option-arrow">→</span>
            </button>
          ))}
        </div>

        {currentQuestion > 0 && (
          <div className="quiz-navigation">
            <button 
              className="nav-button btn-back"
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodQuiz;
