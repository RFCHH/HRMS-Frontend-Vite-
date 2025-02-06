import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaLessThan } from "react-icons/fa";

function ExamStart() {
  const [questions, setQuestions] = useState([]);
  const [duration, setDuration] = useState(0); 
  const [timer, setTimer] = useState(0); 
  const [selectedOptions, setSelectedOptions] = useState({});
  const [error, setError] = useState('');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const employeeId = localStorage.getItem("EmpId");
  const { examId } = useParams();

  useEffect(() => {
    const startExam = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/examSheets/start?examId=${examId}&employeeId=${employeeId}`);

        const { questions, duration } = response.data;

        if (questions && Array.isArray(questions)) {
          setQuestions(questions);
        } else {
          setError('No questions available for this exam.');
        }

        setDuration(duration);
        setTimer(duration * 60); // Convert minutes to seconds
        setIsTimerRunning(true);
      } catch (error) {
        console.error('Error fetching exam data:', error);
        setError('Error occurred while starting the exam.');
      }
    };

    startExam();
  }, [examId, employeeId]);

  useEffect(() => {
    let timerInterval;
  
    // Only start the timer interval when it's running and timer > 0
    if (isTimerRunning && timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    }
  
    // Submit the exam 5 seconds before the timer hits zero
    if (timer === 2 && isTimerRunning) {
      clearInterval(timerInterval); // Clear the interval as soon as it's 5 seconds
      setIsTimerRunning(false); // Stop the timer
      handleSubmit(); // Submit the exam
    }
  
    // // When the timer reaches zero, submit the exam
    // if (timer <= 0 && isTimerRunning) {
    //   clearInterval(timerInterval);  // Clear the interval when the time is up
    //   setIsTimerRunning(false);
    //   handleSubmit(); 
    // }
  
    return () => clearInterval(timerInterval);  // Cleanup interval when component unmounts or updates
  }, [isTimerRunning, timer]);
  
  

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    const answers = Object.keys(selectedOptions).map((questionId) => ({
      questionId,
      optionId: selectedOptions[questionId],
    }));

    try {
      const response = await axiosInstance.post(
        `hrmsapplication/exam/submit?employeeId=${employeeId}&examId=${examId}`,
        { answers }
      );

      if (response.status === 200) {
        setIsSubmitted(true);
        alert("Exam submitted successfully!");
        navigate(`/selfexam/${employeeId}`);
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      setError('Failed to submit the exam. Please try again later.');
    }
  };


  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  const handlebackclick = ((event) => {
    event.preventDefault();
    navigate(-1);
})

  return (
    <div className="container mx-auto p-6">           
     <div className="flex items-center justify-start px-2 py-2 overflow-x-auto bg-blue-950 border-2 border-gray-800 rounded-md w-40 mb-5 mt-5">
                    <FaLessThan className="text-white mr-2" />
                    <button onClick={handlebackclick}><span className="font-semibold text-white">Previous Page</span></button>
                </div>

      <h1 className="text-3xl font-semibold mb-6">Exam Start</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {duration > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Duration: {duration} minutes</h2>
          <p className="text-lg">You have {duration} minutes to complete the exam.</p>
        </div>
      )}
      <div>
          {isTimerRunning && (
            <p className="text-lg font-semibold text-red-600">
              Time Left: {formatTime(timer)}
            </p>
          )}
        </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Questions</h2>

        {questions.length === 0 ? (
          <p>No questions available for this exam.</p>
        ) : (
          questions.map((questionData) => (
            <div key={questionData.questionId} className="bg-white p-4 rounded-lg shadow-lg mb-4">
              <div className="font-medium text-xl">{questionData.question}</div>
              <div className="mt-2">
                {questionData.options.map((option) => (
                  <div
                    key={option.optionId}
                    onClick={() => handleOptionSelect(questionData.questionId, option.optionId)}
                    className={`py-2 px-4 rounded mt-2 cursor-pointer ${
                      selectedOptions[questionData.questionId] === option.optionId
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100'
                    }`}
                  >
                    {option.option}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between mt-6">
        {/* <div>
          {isTimerRunning && (
            <p className="text-lg font-semibold">
              Time Left: {formatTime(timer)}
            </p>
          )}
        </div> */}
      </div>

      {!isSubmitted && (
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit Exam
          </button>
        </div>
      )}
    </div>
  );
}

export default ExamStart;
