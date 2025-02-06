import { useEffect, useState } from 'react';
import axiosInstance from "./axiosConfig";
import { Link } from 'react-router-dom';
import { FaLessThan, FaEdit, FaTrashAlt } from 'react-icons/fa'; 
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Department = () => {
  const [departmentId, setDepartmentId] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [departmentHead, setDepartmentHead] = useState('');
  const [departments, setDepartments] = useState([]);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);  

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axiosInstance.get(`hrmsapplication/department/getAllDepartments`);
        const data = response.data;
        setDepartments(data);
        console.log("Fetched data:", data);
      } catch (error) {
        console.error('Error fetching department details:', error);
        toast.error("Error fetching departments.");
      }
    };
    fetchDepartment();
  }, []);

  const handleAddDepartment = async () => {
    if (!departmentId.trim() || !departmentName.trim() || !departmentHead.trim()) {
      alert('Please enter department ID, name, and head.');
      return;
    }

    const departmentData = {
      departmentId,
      departmentName,
      departmentHead,
    };

    try {
      const response = await axiosInstance.post(
        '/hrmsapplication/department/create',
        departmentData
      );

      const result = response.data;
      setDepartments([...departments, departmentData]);
      setDepartmentId('');
      setDepartmentName('');
      setDepartmentHead('');
      toast.success("Department added successfully!");
      console.log('Department added:', result);
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error("Error adding department. Please try again.");
    }
  };

  const handleUpdateDepartment = async () => {
    if (!departmentName.trim() || !departmentHead.trim()) {
      alert('Please enter department name and head.');
      return;
    }

    const updatedDepartmentData = {
      departmentName,
      departmentHead,
    };

    try {
      const response = await axiosInstance.patch(
        `hrmsapplication/department/update`,
        { departmentId: editingDepartmentId, ...updatedDepartmentData }
      );

      const result = response.data;
      setDepartments(departments.map((dept) =>
        dept.departmentId === editingDepartmentId ? { ...dept, ...updatedDepartmentData } : dept
      ));
      setDepartmentName('');
      setDepartmentHead('');
      setDepartmentId('');
      setEditingDepartmentId(null); 
      toast.success("Department updated successfully!");
      console.log('Department updated:', result);
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error("Error updating department. Please try again.");
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const response = await axiosInstance.delete(
          `hrmsapplication/department/deleteDepartment/${departmentId}`
        );

        const result = response.data;
        setDepartments(departments.filter((dept) => dept.departmentId !== departmentId));
        toast.success("Department deleted successfully!");
        console.log('Department deleted:', result);
      } catch (error) {
        console.error('Error deleting department:', error);
        toast.error("Error deleting department. Please try again.");
      }
    }
  };

  const handleEditDepartment = (department) => {
    setEditingDepartmentId(department.departmentId);  
    setDepartmentId(department.departmentId);
    setDepartmentName(department.departmentName);
    setDepartmentHead(department.departmentHead);
  };

  return (
    <div className="px-2 sm:px-4">
      <div className="flex flex-wrap items-center justify-start p-2 bg-blue-950 border-2 border-gray-800 rounded-md  w-[150px] sm:w-[150px] mb-3 mt-5 ml-0 sm:ml-5">
        <FaLessThan className="text-white mr-2" />
        <Link to={`/admindashboard`}>
          <button>
            <span className="text font-semibold text-white">Previous Page</span>
          </button>
        </Link>
      </div>

      <div className="mb-6 shadow-md p-4 rounded-lg">
        <h2 className="text-lg sm:text-xl text-center mb-4 font-bold p-2 text-white bg-blue-950 rounded-lg">
          Manage Department
        </h2>

        <input
          type="text"
          className="w-full px-3 py-2 mb-4 border rounded-lg text-sm"
          placeholder="Enter department ID"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          disabled={editingDepartmentId} // Disable ID input while editing
        />
        <input
          type="text"
          className="w-full px-3 py-2 mb-4 border rounded-lg text-sm"
          placeholder="Enter department name"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
        />
        <input
          type="text"
          className="w-full px-3 py-2 mb-4 border rounded-lg text-sm"
          placeholder="Enter department head"
          value={departmentHead}
          onChange={(e) => setDepartmentHead(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row items-center">
          <button
            onClick={editingDepartmentId ? handleUpdateDepartment : handleAddDepartment} // Toggle between update and add
            className="w-full sm:w-auto bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-950 transition duration-300 mb-2 sm:mb-0"
          >
            {editingDepartmentId ? 'Update Department' : 'Add Department'}
          </button>

          <select
            className="w-full sm:w-auto ml-0 sm:ml-5 px-4 py-2 rounded-lg bg-blue-950 text-white"
            value={departmentName}
          >
            <option value="">All Departments</option>

            {departments.length > 0 ? (
              departments.map((dept) => (
                <option
                  className="bg-white text-black"
                  key={dept.departmentId}
                  value={dept.departmentName}
                >
                  {dept.departmentName}
                </option>
              ))
            ) : (
              <option>Loading...</option>
            )}
          </select>
        </div>
      </div>

      <div className="shadow-md p-4 rounded-lg">
        <h3 className="text-lg sm:text-xl text-center mb-4 font-bold p-2 text-white bg-blue-950 rounded-lg">
          Department List
        </h3>

        <ul className="list-disc pl-6">
          {departments.length > 0 ? (
            departments.map((dept, index) => (
              <li key={index} className="mb-2 text-gray-700 text-sm">
                <strong>ID:</strong> {dept.departmentId} - <strong>Name:</strong> {dept.departmentName} -{' '}
                <strong>Head:</strong> {dept.departmentHead}
                <button
                  onClick={() => handleEditDepartment(dept)}
                  className="ml-4 text-black p-2 rounded-lg"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteDepartment(dept.departmentId)}
                  className="ml-2 text-black p-2 rounded-lg"
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No departments added yet.</p>
          )}
        </ul>
      </div>
    </div>

  );
};

export default Department;
