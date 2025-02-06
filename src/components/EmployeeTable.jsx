import { Link } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaPen, FaTrash } from 'react-icons/fa';

const EmployeeTable = () => {
  return (
    <div className="container mx-auto p-6">
      <nav className="flex items-center mb-4 p-2 border rounded-lg shadow-md">
        <div className="flex items-center space-x-1">
          <span className="text-lg font-bold">Home</span>
        </div>
      </nav>

      <div className="flex justify-center items-center mb-4 space-x-4">
        <div className="flex items-center border rounded-lg">
          <input
            type="text"
            placeholder="Search..."
            className="py-2 px-3 focus:outline-none rounded-l-lg"
          />
          <button className="bg-gray-200 text-gray-500 px-3 rounded-r-lg">
            <AiOutlineSearch />
          </button>
        </div>

        <button className="bg-gray-200 text-orange-400 font-semibold px-4 py-2 rounded">
          Role Based
        </button>       
        <Link to="/interview">
          <button className="bg-gray-200 text-orange-400 font-semibold py-2 px-2 rounded">
            Create Employee
          </button>
        </Link>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-3 px-4 border-b">Full Name</th>
            <th className="py-3 px-4 border-b">Email ID</th>
            <th className="py-3 px-4 border-b">Role Applied For</th>
            <th className="py-3 px-4 border-b">Interview Date</th>
            <th className="py-3 px-4 border-b">Interview ID</th>
            <th className="py-3 px-4 border-b">Mode of Interview</th>
            <th className="py-3 px-4 border-b">Interview Status</th>
            <th className="py-3 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-100 text-center">
            <td className="py-2 px-4 border-b">John Doe</td>
            <td className="py-2 px-4 mailto:border-b">johndoe@example.com</td>
            <td className="py-2 px-4 border-b">Software Engineer</td>
            <td className="py-2 px-4 border-b">2024-10-25</td>
            <td className="py-2 px-4 border-b">INT12345</td>
            <td className="py-2 px-4 border-b">Online</td>
            <td className="py-2 px-4 border-b">Scheduled</td>
            <td className="py-2 px-4 border-b flex justify-center">
              <span className="text-black cursor-pointer mx-2">
                <FaPen />
              </span>
              <span className="text-black cursor-pointer mx-2">
                <FaTrash />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
