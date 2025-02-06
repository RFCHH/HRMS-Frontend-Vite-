// import React, { createContext, useState, useEffect } from "react";

// export const EmployeeContext = createContext();

// const EmployeeProvider = ({ children }) => {
//   const [employeeData, setEmployeeData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           // "http://192.168.0.119:8080/hrmsapplication/employee/getProfileDashboard/HRMS6"
//         );
//         const data = await response.json();
//         setEmployeeData(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <EmployeeContext.Provider value={employeeData}>
//       {children}
//     </EmployeeContext.Provider>
//   );
// };

// export default EmployeeProvider;

// EmployeeProvider.js
// EmployeeProvider.js
import React, { createContext, useState, useEffect } from "react";

export const EmployeeContext = createContext();

const EmployeeProvider = ({ children }) => {
  const [employeeData, setEmployeeData] = useState(null);
  const [currentEmployeeId, setCurrentEmployeeId] = useState("HRMS1"); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://192.168.0.119:8080/hrmsapplication/employee/getProfileDashboard/${currentEmployeeId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setEmployeeData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setEmployeeData(null); 
      }
    };
    fetchData();
  }, [currentEmployeeId]);

  return (
    <EmployeeContext.Provider
      value={{ employeeData, currentEmployeeId, setCurrentEmployeeId }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeProvider;
