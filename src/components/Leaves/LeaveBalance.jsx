import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { FaLessThan} from "react-icons/fa";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';  

function LeaveBalance() {   
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [responses, setResponses] = useState([]);   
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);   
  const [rowsPerPage] = useState(5);   
  const employeeId=localStorage.getItem('EmpId') ;
  const role = localStorage.getItem('UserRole');
  const navigate=useNavigate();

 
     

  
  const handleFetchData = async () => {
    try {
      let response;
      if (role === "ROLE_HR") {
         response = await axiosInstance.get(`hrmsapplication/employee/getHrReportees/${employeeId}`);
      } else if (role === "ROLE_MANAGER") {
        response = await axiosInstance.get(`hrmsapplication/employee/getEmployeesListByManagerId/${employeeId}`);
      }
      setEmployees(response?.data || []);
      // toast.success("Data loaded successfully!");
    } 
    // catch (error) {
    //   console.error("Error fetching employee data:", error);
    //   toast.error("Error fetching data!");
    // }
    catch (error) {
      console.error("Error adding the job:", error);

      // Extract error details
      let errorMessage = "Failed to add the job. Please try again.";
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      toast.error(errorMessage); // Show extracted error in toast
    }
  };


  useEffect(() => {
    handleFetchData();
  }, [role]);
  
  useEffect(() => {     
    const fetchResponses = async () => {       
      try {         
        const response = await axiosInstance.get(`hrmsapplication/leave/requests?employeeId=${employeeId}&page=${page}&size=40`);         
        // setResponses(response.data); 
        
        const balanceResponse = await axiosInstance.get(`hrmsapplication/getleavebalance/${employeeId}`);
        setLeaveBalance(balanceResponse.data );
        const updatedRequests = response.data.map((req) => {
          const matchedEmployee = employees.find(
            (emp) => emp.employeeId === req.employeeId
          );
          return {
            ...req,
            employeeName: matchedEmployee?.employeeName || "Unknown",
          };
        });
        setResponses(updatedRequests); 
        // toast.success("Data loaded successfully!"); 
      }
      //  catch (error) {         
      //   console.error("Error fetching responses:", error);       
      //   toast.error("Error fetching data!"); 
      // }  
      catch (error) {
        console.error("Error adding the job:", error);
  
        // Extract error details
        let errorMessage = "Failed to add the job. Please try again.";
        if (error.response?.data) {
          if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
        }
  
        toast.error(errorMessage); // Show extracted error in toast
      }   
    };     
    fetchResponses();   
  }, [employeeId,employees]);    
 
  const totalPages = Math.ceil(responses.length / rowsPerPage);   
  const paginatedResponses = responses.slice(page  *rowsPerPage, (page + 1) * rowsPerPage);    

  const handlePreviousPage = () => {     
    if (page > 0) {       
      setPage(prev => prev - 1);     
    }   
  };    

  const handleNextPage = () => {     
    if (page < totalPages - 1) {       
      setPage(prev => prev + 1);     
    }   
  };    
  const handlebackclick=((event)=>{
    event.preventDefault();
    navigate(-1);
})

  return (     
    <>
    {  /* ToastContainer to display toasts */}
    
    <div className="flex items-center justify-start px-2 py-2 overflow-x-auto border-2 border-gray-800  bg-blue-950 rounded-md w-40 ml-4 mb-5 mt-5">
                <FaLessThan className="text-white mr-2" />
                {/* <Link to="/LeaveRequest"> */}
                 <button onClick={handlebackclick}><span className="text font-semibold text-white">Previous Page</span></button>
                {/* </Link> */}
        </div>
        {/* <div className="bg-white p-2 border-1 border-black flex justify-between items-center">
        <button 
          className="flex items-center text-black bg-green-500 px-2 py-1 rounded" 
          onClick={handleFetchData}
        >
         {role === 'HR' ? 'Fetch Reportees' : 'Fetch Leave Requests'}
        </button> 
      </div> */}
    <div className="container mx-auto p-4">   
   
      <div className="mb-8 mx-auto overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Leave Balance</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300  bg-orange-400">Types of Leaves</th>
              {leaveBalance.map((leave, index) => (
                <th key={index} className="border border-gray-300 px-4 py-2 bg-gray-200">
                  {leave.leaveType}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-orange-400">Count</th>
              {leaveBalance.map((leave, index) => (
                <td key={index} className="border border-gray-300 px-4 py-2 text-center bg-gray-200">
                  {leave.count}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className='mt-5'>         
        <div className='border rounded-lg shadow-md p-4 bg-white'>           
          <div className="flex justify-between items-center mb-4">             
            <h1 className="font-bold text-xl">Leaves Status</h1>           
          </div>            
          {paginatedResponses.length > 0 ? (             
            <>               
              <table className="w-full table-auto border-collapse overflow-x-auto">                 
                <thead>                   
                  <tr className="bg-gray-300">                     
                    <th className="border border-solid border-gray-400 p-1 text-center">Employee ID</th>                     
                    {/* <th className="border border-solid border-gray-400 p-1 text-center">Employee Name</th>                      */}
                    <th className="border border-solid border-gray-400 p-1 text-center">Leave Type</th>                     
                    <th className="border border-solid border-gray-400 p-1 text-center">Start Date</th>                     
                    <th className="border border-solid border-gray-400 p-1 text-center">End Date</th>                     
                    <th className="border border-solid border-gray-400 p-1 text-center">Applied Date</th>                     
                    <th className="border border-solid border-gray-400 p-1 text-center">Duration</th>                     
                    <th className="border border-solid border-gray-400 p-1 text-center">Status</th>                     
                    <th className="border border-solid border-gray-400 p-1 text-center">Comments</th>                   
                  </tr>                 
                </thead>                 
                <tbody>                   
                  {paginatedResponses.map(req => (                     
                    <tr key={req.id} className="text-center">                       
                      <td className="border border-solid border-gray-400 p-1">{req.employeeId}</td>                       
                      {/* <td className="border border-solid border-gray-400 p-1">{req.employeeName}</td>                        */}
                      <td className="border border-solid border-gray-400 p-1">{req.leaveName}</td>                       
                      <td className="border border-solid border-gray-400 p-1">{req.startDate}</td>                       
                      <td className="border border-solid border-gray-400 p-1">{req.endDate}</td>                       
                      <td className="border border-solid border-gray-400 p-1">{req.appliedDate}</td>                       
                      <td className="border border-solid border-gray-400 p-1">{req.duration}</td>                       
                      <td className="border border-solid border-gray-400 p-1">{req.status}</td>                       
                      <td className="border border-solid border-gray-400 p-1">{req.comments}</td>                     
                    </tr>                   
                  ))}                 
                </tbody>               
              </table>               
              <div className="flex items-center justify-center mt-4">                 
                <span                   
                  onClick={handlePreviousPage}                   
                  className={`cursor-pointer ${page === 0 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-600'} text-lg font-bold mr-2`}                 
                >                   
                  &lt;                 
                </span>                 
                <span className="font-semibold text-sm">                   
                  Page {page + 1} of {totalPages}                 
                </span>                 
                <span                   
                  onClick={handleNextPage}                   
                  className={`cursor-pointer ${page === totalPages - 1 ? 'text-gray-400' : 'text-gray-600 hover:text-gray-600'} text-lg font-bold ml-2`}                 
                >                   
                  &gt;                 
                </span>               
              </div>             
            </>           
          ) : (             
            <p className="text-center mt-4">No results found.</p>           
          )}         
        </div>       
      </div>     
    </div>   
    </>
  ); 
} 

export default LeaveBalance;
