import React, { useState } from 'react';
import AudioRecorder from './src/components/AudioRecorder';

/**
 * EXAMPLE: How to integrate the AudioRecorder component into your app
 * 
 * This example shows:
 * - Basic integration with form state
 * - Reset functionality for multi-step forms
 * - Fallback to text input
 * - Error handling
 */

function ExampleInterviewForm() {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions] = useState([
    "Tell me about your background and experience.",
    "What are your biggest strengths?",
    "Where do you see yourself in 5 years?"
  ]);
  
  const handleTranscriptChange = (transcript: string) => {
    setCurrentAnswer(transcript);
  };

  const handleNextQuestion = () => {
    // Save current answer (you would save this to your state/API)
    console.log(`Answer ${currentQuestionIndex + 1}:`, currentAnswer);
    
    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentAnswer(''); // Clear for next question
    }
  };

  const handleSubmitInterview = () => {
    console.log('Final answer:', currentAnswer);
    // Submit all answers to your API
    alert('Interview completed!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Interview Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
        <p className="text-lg text-gray-700">
          {questions[currentQuestionIndex]}
        </p>
      </div>

      {/* Voice Recording Component */}
      <AudioRecorder
        onTranscriptChange={handleTranscriptChange}
        resetTrigger={currentQuestionIndex} // Reset when question changes
        disabled={false}
        className="mb-6"
      />

      {/* Text Input Fallback */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer (you can edit the transcribed text)
        </label>
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Your answer will appear here from voice recording, or you can type directly..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={handleNextQuestion}
            disabled={!currentAnswer.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={handleSubmitInterview}
            disabled={!currentAnswer.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Interview
          </button>
        )}
      </div>
    </div>
  );
}

export default ExampleInterviewForm;

/**
 * ALTERNATIVE: Simple single-question example
 */
function SimpleVoiceInput() {
  const [answer, setAnswer] = useState('');

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Voice Input Example</h3>
      
      <AudioRecorder
        onTranscriptChange={setAnswer}
        className="mb-4"
      />
      
      <div className="p-3 bg-gray-50 rounded">
        <strong>Captured Answer:</strong>
        <p>{answer || 'No answer yet...'}</p>
      </div>
    </div>
  );
}

export { SimpleVoiceInput };