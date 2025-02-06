import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, } from "react-router-dom";
import Dashboard from "./components/AdminDashboard.jsx";
import Dashboard1 from "./components/Dashboard.jsx";
import Profile from "./components/PersonalInfo.jsx";
import Education from "./components/Education.jsx";
import Current from "./components/CurrentExperience.jsx";
import FamilyDetails from "./components/FamilyDetails.jsx";
import Experience from "./components/Experience.jsx";
import Location from "./components/Location.jsx";
import National from "./components/National.jsx";
import Travel from "./components/Travel.jsx";
import Navbar from "./components/MainNavbar.jsx";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/Authorized Access/ProtectedRoute.jsx";
import AttendanceSheet from "./components/Attendence.jsx";
import Interview from "./components/onboarding/InterviewTable.jsx";
import Onboarding from "./components/onboarding/Onboarding.jsx";
import AllEmployee from "./components/AllEmployees.jsx";

import OrganizationCreation from "./components/Organizations.jsx";
import Department from "./components/Department.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import Careers from "./components/Careers.jsx";
import Holidays from "./components/Holidays.jsx";
import Project from "./components/Project.jsx";
import AssignmentCreation from "./components/Assignmentcreation.jsx";
import EmployeeReports from "./components/EmployeeReports.jsx";
import EmployeeId from "./components/EmployeeId.jsx";
import Maintaience from "./components/undermaintaience.jsx";
import Payroll from "./components/onboarding/Payrollsection.jsx";
import ApprovalMaster from "./components/Approvals/ApprovalMaster.jsx";
import LeaveApproval from "./components/Approvals/LeaveApproval.jsx";
import LeaveStatus from "./components/Approvals/LeaveStatus.jsx";
import AttendanceApproval from "./components/Approvals/AttendanceApproval.jsx";
import AttendanceStatus from "./components/Approvals/AttendanceStatus.jsx";
import ProfileDetailsStatus from "./components/Approvals/ProfileDetailStatus.jsx";
import ProfileDetailsApproval from "./components/Approvals/ProfileDetailsApproval.jsx";
import Assignments from "./components/Assignments/Assignments.jsx";
import ForgotPassword from "./components/ForgetPassword.jsx";
import Organisation from "./components/Organization.jsx";
import Associate360 from "./components/Associate360.jsx";
import ManagerEmployee from "./components/ManagerEmployee.jsx";
// import ProfileCreation from './components/onboarding/interviewprofile.jsx';
// import InterviewTable from "./components//InterviewTable.jsx";
// import TokenExpired from "./components/TokenExpiry.jsx";
import EmployeePerformane from "./components/EmployeePerformance/Performancelist.jsx";
import Deliverables from "./components/EmployeePerformance/Deliverables.jsx";
import LeaveForm from "./components/Leaves/LeaveForm.jsx";
import LeaveBalance from "./components/Leaves/LeaveBalance.jsx";
import LeaveRequest from "./components/Leaves/LeaveRequest.jsx";

import TimeEntryPage from "./components/TimeSheet/TimeEntryPage.jsx";
import EmployeeList from "./components/TimeSheet/EmployeeList.jsx";
import TimeSheet from "./components/TimeSheet/TotalTime.jsx";
import EntryPage from "./components/TimeSheet/EntryPage.jsx"
import DesignationForm from "./components/designations/Designations.jsx";
import PayrollUser from "./components/onboarding/Payrolluser.jsx"
import Unauthorized from "./components/Authorized Access/Unauthorized.jsx"
import OnboardingDashboard from "./components/OnboardingDashboard/OnboardingDashboard.jsx";
import OnboardingPersonalDetails from "./components/OnboardingDashboard/OnboardingPersonalDetails.jsx";

import { ToastContainer } from "react-toastify";
import Examdetails from "./components/Exams/ExamDetails.jsx";
import List from "./components/Exams/EmployeeList.jsx"
import Exam from "./components/Exams/SelfExam.jsx";
import CreateExam from "./components/Exams/CreateExam.jsx";
import CreateQuestion from "./components/Exams/CreateQuestion.jsx";
import ExamStart from "./components/Exams/ExamStart.jsx";

import Data from "./components/Exams/Examdata.jsx";

import GetStatus from "./components/TimeSheet/GetStatus.jsx";




function AppContent() {
  const location = useLocation();
  const hideNavbarOnPaths = ["/"];

  return (


    <>
      {!hideNavbarOnPaths.includes(location.pathname) && <Navbar />}

      <Routes>
        {/* public access path */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/undermaintaience" element={< Maintaience />} />
        {/* admin access path */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
          <Route path="/admindashboard" element={<Dashboard />} />
          <Route path='/createorganization' element={<OrganizationCreation />} />
          <Route path='/designations' element={<DesignationForm />} />
          <Route path='/department' element={<Department />} />
          <Route path='/allEmployee' element={<AllEmployee />} />
          <Route path="/LeaveForm" element={<LeaveForm />} />
          <Route path="/payrollSection/:employeeId" element={< Payroll />} />
          <Route path="/createexam" element={< CreateExam />} />
          <Route path="/CreateQuestion/:examId" element={< CreateQuestion />} />



        </Route>
        {/* admin and hr access path */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_HR"]} />}>
          <Route path="/interviewTable" element={< Interview />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboardingDocuments" element={<Onboarding />} />
        </Route>
        {/* employee access path */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_EMPLOYEE"]} />}>
          <Route path="/ProfileDetailsApproval/:employeeId/:EmpId" element={<ProfileDetailsApproval />} />
          <Route path="/ProfileDetailsStatus/:employeeId" element={<ProfileDetailsStatus />} />
        </Route>
        {/* hr,manager access path */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_MANAGER", "ROLE_HR"]} />}>
          <Route path="/table" element={<EmployeeList />} />
          <Route path="/timesheets/:employeeId" element={<TimeSheet />} />
          <Route path="/employeePerformance" element={<  EmployeePerformane />} />
          <Route path="/EmployeeReports" element={<EmployeeReports />} />
          <Route path="/LeaveApproval/:employeeId/:EmpId" element={<LeaveApproval />} />
          <Route path="/AttendanceApproval/:employeeId/:EmpId" element={<AttendanceApproval />} />
          <Route path="/employeelist" element={<List />} />
          <Route path="/status/:employeeId" element={<GetStatus />} />
          

        </Route>
        {/* employee,hr,manager access path */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_EMPLOYEE", "ROLE_MANAGER", "ROLE_HR"]} />}>
          <Route path="/payrolluser/:employeeId" element={<PayrollUser />} />
          <Route path="/Assignments" element={<Assignments />} />
          <Route path="/ManagerEmployee" element={<ManagerEmployee />} />
          <Route path='/userdashboard' element={<UserDashboard />} />
          <Route path="/LeaveBalance" element={<LeaveBalance />} />
          <Route path="/LeaveRequest" element={<LeaveRequest />} />
          <Route path="/Organization/:employeeId" element={<Organisation />} />
          <Route path="/entrypage/:employeeId" element={<EntryPage />} />
          <Route path="/timeEntry/:employeeId/:fromDateParam/:toDateParam" element={<TimeEntryPage />} />
          <Route path="/Deliverables/:employeeId" element={<  Deliverables />} />
          <Route path="/attendenceSheet" element={<AttendanceSheet />} />
          <Route path="/attendenceSheet/:employeeId" element={<AttendanceSheet />} />
          <Route path="/associate360" element={<Associate360 />} />
          <Route path="/EmployeeId/:employeeId" element={<EmployeeId />} />
          <Route path="/ApprovalMaster" element={<ApprovalMaster />} />
          <Route path="/LeaveStatus/:employeeId" element={<LeaveStatus />} />
          <Route path="/AttendanceStatus/:employeeId" element={<AttendanceStatus />} />
          <Route path="/selfexam/:employeeId" element={<Exam />} />
          <Route path="/ExamStart/:examId" element={< ExamStart />} />
            <Route path="/examdetails/:employeeId" element={<Examdetails />} />
          <Route path="/examdata/:employeeId/:examId" element={< Data />} />



        </Route>
        {/* admin,hr,manager,employee access path */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_EMPLOYEE", "ROLE_MANAGER", "ROLE_HR", "ROLE_ADMIN", "ROLE_ONBOARDING"]} />}>
          <Route path="/dashboard/:employeeId" element={<Dashboard1 />} />
          <Route path="/personalDetails/:employeeId" element={<Profile />} />
          <Route path="/familyDetails/:employeeId" element={<FamilyDetails />} />
          <Route path="/Travel/:employeeId" element={<Travel />} />
          <Route path="/Location/:employeeId" element={<Location />} />
          <Route path="/National/:employeeId" element={<National />} />
          <Route path="/experience/:employeeId" element={<Experience />} />
          <Route path="/educationDetails/:employeeId" element={<Education />} />
          <Route path="/current/:employeeId" element={<Current />} />
          <Route path='/careers' element={<Careers />} />
          <Route path='/holidays' element={<Holidays />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/assignmentcreation/:projectCode" element={<AssignmentCreation />} />
        </Route>
        {/* Role Onboarding*/}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_ONBOARDING"]} />}>
          <Route path='/Onboarding/Dashboard' element={<OnboardingDashboard />} />
          <Route path='/Onboarding/personalDetails/:employeeId' element={<OnboardingPersonalDetails />} />

        </Route>

      </Routes>
      <ToastContainer />


    </>
  );
}
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
export default App;
