import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, } from "react-router-dom";
import Dashboard from "./components/AdminDashboard.js";
import Dashboard1 from "./components/Dashboard.js";
import Profile from "./components/PersonalInfo.js";
import Education from "./components/Education.js";
import Current from "./components/CurrentExperience.js";
import FamilyDetails from "./components/FamilyDetails.js";
import Experience from "./components/Experience.js";
import Location from "./components/Location.js";
import National from "./components/National.js";
import Travel from "./components/Travel.js";
import Navbar from "./components/MainNavbar";
import Login from "./components/Login.js";
import ProtectedRoute from "./components/Authorized Access/ProtectedRoute.js";
import AttendanceSheet from "./components/Attendence.js";
import Interview from "./components/onboarding/InterviewTable.js";
import Onboarding from "./components/onboarding/Onboarding.js";
import AllEmployee from "./components/AllEmployees.js";

import OrganizationCreation from "./components/Organizations.js";
import Department from "./components/Department.js";
import UserDashboard from "./components/UserDashboard.js";
import Careers from "./components/Careers.js";
import Holidays from "./components/Holidays";
import Project from "./components/Project.js";
import AssignmentCreation from "./components/Assignmentcreation.js";
import EmployeeReports from "./components/EmployeeReports.js";
import EmployeeId from "./components/EmployeeId.js";
import Maintaience from "./components/undermaintaience.js";
import Payroll from "./components/onboarding/Payrollsection";
import ApprovalMaster from "./components/Approvals/ApprovalMaster.js";
import LeaveApproval from "./components/Approvals/LeaveApproval.js";
import LeaveStatus from "./components/Approvals/LeaveStatus.js";
import AttendanceApproval from "./components/Approvals/AttendanceApproval.js";
import AttendanceStatus from "./components/Approvals/AttendanceStatus.js";
import ProfileDetailsStatus from "./components/Approvals/ProfileDetailStatus.js";
import ProfileDetailsApproval from "./components/Approvals/ProfileDetailsApproval.js";
import Assignments from "./components/Assignments/Assignments.js";
import ForgotPassword from "./components/ForgetPassword.js";
import Organisation from "./components/Organization.js";
import Associate360 from "./components/Associate360.js";
import ManagerEmployee from "./components/ManagerEmployee.js";
// import ProfileCreation from './components/onboarding/interviewprofile';
// import InterviewTable from "./components//InterviewTable.js";
// import TokenExpired from "./components/TokenExpiry.js";
import EmployeePerformane from "./components/EmployeePerformance/Performancelist.js";
import Deliverables from "./components/EmployeePerformance/Deliverables";
import LeaveForm from "./components/Leaves/LeaveForm.js";
import LeaveBalance from "./components/Leaves/LeaveBalance.js";
import LeaveRequest from "./components/Leaves/LeaveRequest.js";

import TimeEntryPage from "./components/TimeSheet/TimeEntryPage.js";
import EmployeeList from "./components/TimeSheet/EmployeeList.js";
import TimeSheet from "./components/TimeSheet/TotalTime.js";
import EntryPage from "./components/TimeSheet/EntryPage.js"
import DesignationForm from "./components/designations/Designations.js";
import PayrollUser from "./components/onboarding/Payrolluser.js"
import Unauthorized from "./components/Authorized Access/Unauthorized.js"
import OnboardingDashboard from "./components/OnboardingDashboard/OnboardingDashboard.js";
import OnboardingPersonalDetails from "./components/OnboardingDashboard/OnboardingPersonalDetails";

import { ToastContainer } from "react-toastify";
import Examdetails from "./components/Exams/ExamDetails.js";
import List from "./components/Exams/EmployeeList.js"
import Exam from "./components/Exams/SelfExam.js";
import CreateExam from "./components/Exams/CreateExam.js";
import CreateQuestion from "./components/Exams/CreateQuestion.js";
import ExamStart from "./components/Exams/ExamStart.js";

import Data from "./components/Exams/Examdata.js";

import GetStatus from "./components/TimeSheet/GetStatus.js";




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
