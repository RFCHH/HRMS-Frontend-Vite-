import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaLessThan, FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing react-icons
import { NavLink } from 'react-router-dom';

function CreateQuestion() {
  const [popUp, setPopUp] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState({
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: ''
  });
  const [correctOption, setCorrectOption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null); // Track the question being edited

  const { examId } = useParams(); // Dynamic examId from URL

  useEffect(() => {
    if (examId) {
      fetchQuestions();
    }
  }, [examId]);

  const fetchQuestions = async () => {
    try {
      const response = await axiosInstance.get(`hrmsapplication/exam/get-questions/${examId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching questions", error);
    }
  };

  const resetForm = () => {
    setQuestion('');
    setOptions({
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: ''
    });
    setCorrectOption('');
    setEditingQuestion(null);
    setError('');
  };

  const handleOpenPopup = () => {
    setPopUp(true);
  };

  const handleClosePopup = () => {
    setPopUp(false);
    resetForm(); // Call resetForm when closing the popup
  };

  const handleEdit = (questionData) => {
    setEditingQuestion(questionData); // Set the question being edited
    setPopUp(true); // Open the popup
  
    // Pre-fill question field
    setQuestion(questionData.question);
  
    // Pre-fill options
    setOptions({
      optionA: questionData.options[0].option,
      optionB: questionData.options[1].option,
      optionC: questionData.options[2].option,
      optionD: questionData.options[3].option,
    });
  
    // Find the correct option
    const correctOption = questionData.options.find(option => option.correct);
    
    // Set the correct option based on the one marked as correct
    if (correctOption) {
      switch (correctOption.option) {
        case questionData.options[0].option:
          setCorrectOption('A');
          break;
        case questionData.options[1].option:
          setCorrectOption('B');
          break;
        case questionData.options[2].option:
          setCorrectOption('C');
          break;
        case questionData.options[3].option:
          setCorrectOption('D');
          break;
        default:
          setCorrectOption('');
      }
    } else {
      setCorrectOption(''); // In case no option is marked as correct, which should not happen
    }
  };
  

  const validateForm = () => {
    if (!question || !options.optionA || !options.optionB || !options.optionC || !options.optionD || !correctOption) {
      setError('Please fill in all fields and select a correct option.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    setLoading(true);
  
    const data = {
      examId,
      // Only add questionId if we're editing an existing question
      questionId: editingQuestion ? editingQuestion.questionId : null, // If editingQuestion is null, don't include questionId
      question, // Send the question text
      options: [
        { option: options.optionA, correct: correctOption === 'A' },
        { option: options.optionB, correct: correctOption === 'B' },
        { option: options.optionC, correct: correctOption === 'C' },
        { option: options.optionD, correct: correctOption === 'D' }
      ],
    };
  
    try {
      let response;
      if (editingQuestion) {
        // Use PATCH request for editing an existing question
        response = await axiosInstance.patch('https://hrms-application-a6vr.onrender.com/hrmsapplication/exam/update-question', data);
      } else {
        // Create a new question (this would still be a POST request as usual)
        response = await axiosInstance.post('hrmsapplication/exam/addquoestions', data);
      }
  
      if (response.status === 200) {
        setPopUp(false);
  
        // Reset form after successful save
        resetForm();
  
        // Fetch updated questions
        const updatedResponse = await axiosInstance.get(`hrmsapplication/exam/get-questions/${examId}`);
        setQuestions(updatedResponse.data);
      } else {
        setError('Failed to save question. Please try again.');
      }
    } catch (error) {
      setError('Error occurred while saving the question.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async (questionId) => {
    try {
      const response = await axiosInstance.delete(`hrmsapplication/exam/deleteQuestionId/${questionId}`);
      
      if (response.status === 204) {
        // Since the response body is empty, we just need to remove the question from the state
        setQuestions(prevQuestions => prevQuestions.filter(q => q.questionId !== questionId));
        alert('Question deleted successfully');
      } else {
        alert('Error occurred while deleting the question');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Error occurred while deleting the question');
    }
  };
  

  return (
    <div className="container mx-auto p-6">
      <div className='flex flex-row justify-between'>
        <NavLink
          to='/createexam'
          className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40 ml-5 mb-5 mt-5">
          <FaLessThan className="text-orange-500 mr-2" />
          <button>
            <span className="text font-semibold text-orange-500">Previous Page</span>
          </button>
        </NavLink>
        <button 
          onClick={handleOpenPopup} 
          className="flex items-center justify-center px-2 py-2 overflow-x-auto border-2 border-gray-800 rounded-md w-40  mb-5 mt-5">
          Create Question
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Existing Questions</h2>
        {questions.length === 0 ? (
          <p>No questions available for this exam.</p>
        ) : (
          questions.map((questionData, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-lg mb-4">
              <div className="font-medium text-xl">{questionData.question}</div>
              <div className="mt-2">
                {questionData.options.map((option, optIndex) => (
                  <div 
                    key={optIndex}
                    className={`py-2 px-4 rounded mt-2 ${option.correct ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`} >
                    {option.option}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => handleDelete(questionData.questionId)} // Handle delete action
                className="mt-2 p-2 bg-red-500 text-white rounded hover:bg-red-600">
                <FaTrashAlt /> {/* Delete icon */}
              </button>
              <button 
                onClick={() => handleEdit(questionData)} // Handle edit action
                className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600">
                <FaEdit /> {/* Edit icon */}
              </button>
            </div>
          ))
        )}
      </div>

      {popUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-3/4 mx-auto">
            <div className="text-white flex justify-between items-center mb-4 bg-orange-400 p-2 rounded">
              <div className="text-xl font-semibold">Create Question</div>
              <div onClick={handleClosePopup} className="cursor-pointer text-lg font-bold">X</div>
            </div>

            {error && <p className="text-red-600 mt-2">{error}</p>}

            <div className="mt-4">
              <label className="block font-medium">Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="border border-black w-full p-4 rounded mt-2 h-32"
              />
              <div className='grid grid-cols-2 gap-4'>
                <div className="mt-4">
                  <label className="block font-medium">Option A</label>
                  <input
                    type="text"
                    value={options.optionA}
                    onChange={(e) => setOptions({ ...options, optionA: e.target.value })}
                    className="border border-black w-full p-2 rounded mt-2"
                  />
                </div>

                <div className="mt-4">
                  <label className="block font-medium">Option B</label>
                  <input
                    type="text"
                    value={options.optionB}
                    onChange={(e) => setOptions({ ...options, optionB: e.target.value })}
                    className="border border-black w-full p-2 rounded mt-2"
                  />
                </div>

                <div className="mt-4">
                  <label className="block font-medium">Option C</label>
                  <input
                    type="text"
                    value={options.optionC}
                    onChange={(e) => setOptions({ ...options, optionC: e.target.value })}
                    className="border border-black w-full p-2 rounded mt-2"
                  />
                </div>

                <div className="mt-4">
                  <label className="block font-medium">Option D</label>
                  <input
                    type="text"
                    value={options.optionD}
                    onChange={(e) => setOptions({ ...options, optionD: e.target.value })}
                    className="border border-black w-full p-2 rounded mt-2"
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="font-medium">Select Correct Option</p>
                <div className="flex space-x-4">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <label key={opt} className="flex items-center">
                      <input
                        type="radio"
                        name="correctOption"
                        value={opt}
                        checked={correctOption === opt}  // Ensure the correct option is selected
                        onChange={() => setCorrectOption(opt)} // Update correctOption state
                        className="mr-2"
                      />
                      Option {opt}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className={`p-2 border border-black rounded bg-green-500 text-white hover:bg-green-600 ${loading ? 'cursor-not-allowed' : ''}`}
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button className="p-2 border border-black rounded ml-2" onClick={handleClosePopup}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateQuestion;
