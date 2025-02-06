import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import axiosInstance from '../axiosConfig';
import { FaLessThan } from "react-icons/fa";
import CreateExamDetailsPopUp from './ExamPopUp';

const CreateExam = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const response = await axiosInstance.get('hrmsapplication/exam/get-all');
        if (response.data && Array.isArray(response.data)) {
          setTableData(response.data);
        } else {
          console.error('API response is not in expected format.');
        }
      } catch (error) {
        console.error('Error fetching exam data:', error);
      }
    };
    fetchExamData();
  }, []);

  const handleAddButtonClick = () => {
    setIsEditing(false);
    setCurrentData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (index) => {
    setIsEditing(true);
    setEditingIndex(index);
    setCurrentData(tableData[index]);
    setIsModalOpen(true);
  };

  const handleSave = (newData) => {
    // Validate fields before saving
    const { examName, startDate, endDate, duration, maxAttempts, departmentId } = newData;

    if (!examName || !startDate || !endDate || !duration || !maxAttempts || !departmentId || departmentId.length === 0) {
      alert('Please fill in all fields.');
      return;
    }

    if (isEditing) {
      const updatedData = [...tableData];
      updatedData[editingIndex] = newData;
      setTableData(updatedData);
    } else {
      setTableData([...tableData, newData]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (index) => {
    const examToDelete = tableData[index];
    try {
      await axiosInstance.delete(`hrmsapplication/exam/delete/${examToDelete.examId}`);
      const updatedData = tableData.filter((_, i) => i !== index);
      setTableData(updatedData);
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  const handleView = (examId) => {
    navigate(`/CreateQuestion/${examId}`);
  };

  const handleBackNavigation = () => {
    navigate('/admindashboard');
  };
  const handlebackclick = ((event) => {
    event.preventDefault();
    navigate(-1);
})


  return (
    <>
     <div className="p-4">
  {/* Navigation Buttons */}
  <div className="flex justify-between mb-4">
    <button
      onClick={handleBackNavigation}
      className="bg-blue-950 text-white font-semibold px-4 py-2 rounded hover:bg-blue-950 text-xs sm:text-sm"
    >
       Previous page
    </button>
    <button
      onClick={handleAddButtonClick}
      className="bg-blue-950 text-white  font-semibold px-4 py-2 rounded hover:bg-blue-950 text-xs sm:text-sm"
    >
      Add +
    </button>
  </div>

  {/* Responsive Table Container */}
  <div className="overflow-x-auto">
    <table className="min-w-full border-collapse border rounded-sm border-gray-300">
      {/* Table Header */}
      <thead className="bg-blue-950 text-white text-xs sm:text-sm">
        <tr>
          <th className="border border-gray-300 px-2 sm:px-4 py-2">Exam Name</th>
          <th className="border border-gray-300 px-2 sm:px-4 py-2">Start Date</th>
          <th className="border border-gray-300 px-2 sm:px-4 py-2">End Date</th>
          <th className="border border-gray-300 px-2 sm:px-4 py-2">Duration</th>
          <th className="border border-gray-300 px-2 sm:px-4 py-2">Attempts</th>
          <th className="border border-gray-300 px-2 sm:px-4 py-2">Department</th>
          <th className="border border-gray-300 px-2 sm:px-4 py-2">Pass %</th>
          <th className="border border-gray-300 px-2 sm:px-4 py-2">View</th>
          <th className="border border-gray-300 px-2 sm:px-4 py-2">Action</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody className="text-xs sm:text-sm">
        {tableData.length === 0 ? (
          <tr>
            <td colSpan="9" className="text-center py-4">No exams available</td>
          </tr>
        ) : (
          tableData.map((row, index) => (
            <tr key={index} className="odd:bg-white even:bg-gray-50">
              <td className="border border-gray-300 text-center px-2 sm:px-4 py-2">{row.examName}</td>
              <td className="border border-gray-300 text-center px-2 sm:px-4 py-2">{row.startDate}</td>
              <td className="border border-gray-300 text-center px-2 sm:px-4 py-2">{row.endDate}</td>
              <td className="border border-gray-300 text-center px-2 sm:px-4 py-2">{row.duration}</td>
              <td className="border border-gray-300 text-center px-2 sm:px-4 py-2">{row.maxAttempts}</td>
              <td className="border border-gray-300 text-center px-2 sm:px-4 py-2">
                {row.departmentId && Array.isArray(row.departmentId) ? row.departmentId.join(', ') : 'N/A'}
              </td>
              <td className="border border-gray-300 text-center px-2 sm:px-4 py-2">{row.passPercentage}</td>
              <td className="border border-gray-300 px-2 sm:px-4 py-2 text-center">
                <AiOutlineEye
                  size={18}
                  className="text-blue-500 cursor-pointer"
                  title="View"
                  onClick={() => handleView(row.examId)}
                />
              </td>
              <td className="border border-gray-300 text-center px-2 sm:px-4 py-2 flex justify-center space-x-1">
                <AiOutlineEdit
                  size={18}
                  className="text-green-500 cursor-pointer"
                  title="Edit"
                  onClick={() => handleEdit(index)}
                />
                <AiOutlineDelete
                  size={18}
                  className="text-red-500 cursor-pointer"
                  title="Delete"
                  onClick={() => handleDelete(index)}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  {/* Modal Popup */}
  {isModalOpen && (
    <CreateExamDetailsPopUp
      initialData={currentData}
      onSave={handleSave}
      onClose={() => setIsModalOpen(false)}
    />
  )}
</div>

    </>
  );
};

export default CreateExam;
