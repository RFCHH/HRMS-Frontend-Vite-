import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiTwotoneHome } from 'react-icons/ai';
import axiosInstance from '../axiosConfig';
import { useParams, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TimeEntryPage = () => {
	const [projects, setProjects] = useState([]);
	const [totalHours, setTotalHours] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const [timeOffData, setTimeOffData] = useState([]);
	const [topUpData, setTopUpData] = useState([]);
	const [fromDate, setStartDate] = useState('');
	const [toDate, setEndDate] = useState('');
	const { employeeId, fromDateParam, toDateParam } = useParams();
	const { state } = useLocation();
	const status = state?.status;
	console.log('Status from entrypage:', status);
	console.log(employeeId);
	const navigate = useNavigate();
	const getWeekStartDate = () => {
		const now = new Date(fromDateParam);
		const dayOfWeek = now.getDay();
		const fromDate = new Date(fromDateParam);
		const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
		fromDate.setDate(now.getDate() - diffToMonday);
		return fromDate;
	};
	const formatPostDate = (date) => {
		const d = new Date(date);
		const day = String(d.getDate()).padStart(2, '0');
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const year = d.getFullYear();
		return `${year}-${month}-${day}`;
	};
	const [weekStartDate, setWeekStartDate] = useState(getWeekStartDate());

	useEffect(() => {
		setStartDate(fromDateParam);
		setEndDate(toDateParam);

		const fetchDefaultData = async () => {
			try {
				const response = await axiosInstance.get(
					`hrmsapplication/createTimeSheets/getTimeSheets?employeeId=${employeeId}&startDate=${fromDateParam}&endDate=${toDateParam}`
				);

				const projectData = response.data || [];
				const initialProjects = projectData.map((project) => ({
					...project,
					projectTimingsDTOList: Array.from({ length: 7 }, (_, i) => {
						const date = new Date(fromDateParam);
						date.setDate(date.getDate() + i);
						const timing = project.projectTimingsDTOList.find(
							(t) => new Date(t.date).toDateString() === date.toDateString()
						);
						return {
							date: date.toISOString().split('T')[0],
							working_hours: timing ? timing.working_hours : 0,
						};
					}),
				}));
				setProjects(initialProjects);
			} catch (error) {
				console.error('Error adding the job:', error);

				let errorMessage = 'Error  while checking';

				if (error.response?.data) {
					if (error.response.data.detail) {
						errorMessage = error.response.data.detail;
					} else if (error.response.data.message) {
						errorMessage = error.response.data.message;
					}
				}

				toast.error(errorMessage);
			}
		};
		const fetchTimeOffData = async () => {
			try {
				const response = await axiosInstance.get(
					`hrmsapplication/createTimeSheets/getTimesheetsLeaves?employeeId=${employeeId}&fromDate=${fromDateParam}&toDate=${toDateParam}`
				);

				setTimeOffData(response.data || []);
			} catch (error) {
				console.error('Error adding the job:', error);

				let errorMessage = 'Error  while checking';

				if (error.response?.data) {
					if (error.response.data.detail) {
						errorMessage = error.response.data.detail;
					} else if (error.response.data.message) {
						errorMessage = error.response.data.message;
					}
				}

				toast.error(errorMessage);
			}
		};
		console.log(fetchTimeOffData);

		const fetchTopUpData = async () => {
			try {
				const response = await axiosInstance.get(
					`hrmsapplication/createTimeSheets/getTimeSheetsAttendance?employeeId=${employeeId}&startDate=${fromDateParam}&endDate=${toDateParam}`
				);

				setTopUpData(response.data || []);
			} catch (error) {
				console.error('Error adding the job:', error);
				let errorMessage = 'Error  while checking';
				if (error.response?.data) {
					if (error.response.data.detail) {
						errorMessage = error.response.data.detail;
					} else if (error.response.data.message) {
						errorMessage = error.response.data.message;
					}
				}

				toast.error(errorMessage);
			}
		};
		console.log(fetchTopUpData);
		fetchDefaultData();
		fetchTimeOffData();
		fetchTopUpData();
	}, [fromDateParam, toDateParam, employeeId]);
	const handleWorkingHoursChange = (projectIndex, dayIndex, value) => {
		if (/^\d*\.?\d*$/.test(value)) {
			setProjects((prevProjects) => {
				const updatedProjects = [...prevProjects];
				updatedProjects[projectIndex].projectTimingsDTOList[dayIndex] = {
					...updatedProjects[projectIndex].projectTimingsDTOList[dayIndex],
					working_hours: value || 0, // Retain the entered value or default to 0
				};
				return updatedProjects;
			});
		}
	};

	const isEditableDate = (timingDate) => {
		const dateToCheck = new Date(timingDate);
		return dateToCheck <= today;
	};

	const handleHomeClick = () => {
		const currentWeekStart = getWeekStartDate();
		setWeekStartDate(currentWeekStart);
		navigate(`/entrypage/${employeeId}`);
	};
	const handleProjectFieldChange = (projectIndex, field, value) => {
		const updatedProjects = [...projects];
		updatedProjects[projectIndex][field] = value;
		setProjects(updatedProjects);
	};
	const handleSave = async (projectIndex) => {
		try {
			const project = projects[projectIndex];
			const saveData = {
				employeeId,
				projectName: project.projectName,
				projectCode: project.projectCode,
				working_hours: parseFloat(
					project.projectTimingsDTOList.reduce(
						(total, timing) => total + parseFloat(timing.working_hours || 0),
						0
					)
				).toFixed(2),
			};

			console.log('Save Data:', saveData);

			let response;

			if (status === 'REJECTED') {
				const patchData = {
					employeeId,
					projectCode: project.projectCode,
					date: saveData.date,
					workingHours: saveData.working_hours,
				};

				response = await axiosInstance.patch(
					'hrmsapplication/createTimeSheets/update',
					patchData,
					{
						headers: { 'Content-Type': 'application/json' },
					}
				);

				console.log('PATCH Response:', response);

				if (response.status === 200 || response.status === 204) {
					toast.success('Time sheet updated successfully!');
				} else {
					toast.error('Failed to update the time sheet.');
				}
			} else {
				response = await axiosInstance.post(
					'hrmsapplication/createTimeSheets/create',
					saveData,
					{
						headers: { 'Content-Type': 'application/json' },
					}
				);

				console.log('POST Response:', response);

				if (response.status === 200 || response.status === 201) {
					toast.success('Time sheet saved successfully!');
				} else {
					toast.error('Failed to save the time sheet.');
				}
			}
		} catch (error) {
			console.error('Error saving/updating time sheet:', error);
			toast.error('Error saving/updating the time sheet.');
		}
	};

	const handleSubmit = async () => {
		try {
			const formattedfromDate = formatPostDate(fromDate);
			const formattedtoDate = formatPostDate(toDate);
			const postData = {
				employeeId: employeeId,
				fromDate: formattedfromDate,
				toDate: formattedtoDate,
				// swipeHours: swipeHours,
				totalHours: totalHours,
			};
			console.log('Post Data:', postData);
			const postUrl = 'hrmsapplication/timesheetapproval/';
			const postResponse = await axiosInstance.post(postUrl, postData, {
				headers: {
					'Content-Type': 'application/json',
				},
			});
			console.log('POST Response:', postResponse);
			if (postResponse.status === 200 || postResponse.status === 201) {
				toast.success('Data created successfully!');
				console.log('Data submitted successfully:', postData);
				navigate(`/entrypage/${employeeId}`, {
					state: postData,
				});
			} else {
				toast.error('kindly recheck the Form');
				console.error('Unexpected response status:', postResponse.status);
			}
		} catch (error) {
			console.error('Error adding the job:', error);
			let errorMessage = 'Error  while checking';
			if (error.response?.data) {
				if (error.response.data.detail) {
					errorMessage = error.response.data.detail;
				} else if (error.response.data.message) {
					errorMessage = error.response.data.message;
				}
			}

			toast.error(errorMessage);
		}
	};
	const today = new Date();
	return (
		<div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-200 p-3 rounded-lg shadow-sm mb-5">
				<div className="flex items-center mb-3 sm:mb-0">
					<a
						onClick={handleHomeClick}
						className="flex items-center space-x-1 cursor-pointer"
					>
						<AiTwotoneHome className="text-lg sm:text-3xl text-black" />
						<span className="text-base sm:text-xl font-medium text-black">Home</span>
					</a>
				</div>
				<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
					<label htmlFor="search" className="text-sm font-medium">
						Search
					</label>
					<input
						id="search"
						type="text"
						className="border border-gray-300 p-2 rounded-md w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="Search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>
			<div className="relative"></div>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-black text-sm sm:text-base">
					<thead>
						<tr className="bg-gray-300 text-black">
							<th className="p-2 text-left border border-black" scope="col">
								Project Code
							</th>
							<th className="p-2 text-left border border-black" scope="col">
								Project Name
							</th>
							<th className="p-2 text-left border border-black" scope="col">
								Billability Location
							</th>
							<th className="p-2 text-left border border-black" scope="col">
								Billability
							</th>
							{Array.from({ length: 7 }, (_, i) => {
								const date = new Date(weekStartDate);
								date.setDate(date.getDate() + i);
								const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
								const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

								return (
									<th key={i} className="p-2 text-left border border-black" scope="col">
										<div className="text-xs sm:text-sm ">{dayName}</div>
										<div className="text-xs sm:text-sm">{formattedDate}</div>
									</th>
								);
							})}
							<th className="p-2 text-left border border-black" scope="col">
								Total Hours
							</th>
							<th className="p-2 text-left border border-black" scope="col">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{projects.map((project, projectIndex) => (
							<tr key={projectIndex}>
								<td className="border p-2  border-black">
									<input
										type="text"
										value={project.projectCode}
										readOnly
										onChange={(e) =>
											handleProjectFieldChange(projectIndex, 'projectCode', e.target.value)
										}
										className="w-full p-1 border border-gray-300 text-xs sm:text-sm"
									/>
								</td>
								<td className="border border-black p-2">
									<input
										type="text"
										value={project.projectName}
										readOnly
										onChange={(e) =>
											handleProjectFieldChange(projectIndex, 'projectName', e.target.value)
										}
										className="w-full p-1 border border-gray-300 text-xs sm:text-sm"
									/>
								</td>
								<td className="border  border-black p-2">
									<input
										type="text"
										value={project.billableLocation}
										readOnly
										onChange={(e) =>
											handleProjectFieldChange(projectIndex, 'billableLocation', e.target.value)
										}
										className="w-full p-1 border border-gray-300 text-xs sm:text-sm"
									/>
								</td>
								<td className="border  border-black p-2">
									<input
										type="text"
										value={project.billability}
										readOnly
										onChange={(e) =>
											handleProjectFieldChange(projectIndex, 'billability', e.target.value)
										}
										className="w-full p-1 border border-gray-300 text-xs sm:text-sm"
									/>
								</td>
								{project.projectTimingsDTOList.map((timing, dayIndex) => {
									const isEditable = isEditableDate(timing.date);

									return (
										<td key={dayIndex} className="border  border-black p-2">
											<input
												type="text"
												value={timing.working_hours || ''}
												minLength={2}
												maxLength={2}
												onChange={(e) =>
													isEditable &&
													handleWorkingHoursChange(projectIndex, dayIndex, e.target.value)
												}
												className={`w-full p-1 border border-gray-300 text-xs sm:text-sm ${!isEditable ? 'bg-gray-200 cursor-not-allowed' : ''
													}`}
												readOnly={!isEditable}
											/>
										</td>
									);
								})}
								<td className="border  border-black  p-2 text-xs sm:text-sm">
									{project.projectTimingsDTOList
										.reduce(
											(total, timing) => total + (parseFloat(timing.working_hours) || 0),
											0
										)
										.toFixed(2)}
								</td>
								<td className="border  border-black p-2 text-center">
									<button
										className="bg-blue-500 text-white p-1 sm:p-2 rounded text-xs sm:text-sm"
										onClick={() => handleSave(projectIndex)}
									>
										Save
									</button>
								</td>
							</tr>
						))}
						{/* Top Up and Time Off Rows */}
						<tr>
							<td className="border  border-black p-2 font-bold" colSpan="4">
								Top Up
							</td>
							{Array.from({ length: 7 }).map((_, dayIndex) => {
								const currentDate = new Date(weekStartDate);
								currentDate.setDate(currentDate.getDate() + dayIndex);
								const formattedDate = currentDate.toISOString().split('T')[0];
								const topUp = topUpData.find(
									(item) => item.attendanceDate === formattedDate
								);

								return (
									<td key={dayIndex} className="border border-black p-2">
										<input
											type="text"
											value={topUp ? topUp.totalWorkingHours : ''}
											readOnly
											className="w-full p-1 border border-gray-300 bg-gray-200"
										/>
									</td>
								);
							})}
							<td className="border  border-black p-2"></td>
						</tr>

						<tr>
							<td className="border border-black p-2 font-bold" colSpan="4">
								Time Off
							</td>
							{Array.from({ length: 7 }).map((_, dayIndex) => {
								const currentDate = new Date(weekStartDate);
								currentDate.setDate(currentDate.getDate() + dayIndex);
								const formattedDate = currentDate.toISOString().split('T')[0];
								const leave = timeOffData.find(
									(leave) => leave.leaveDate === formattedDate
								);

								return (
									<td key={dayIndex} className="border border-black p-2">
										<input
											type="text"
											value={leave ? `${leave.leaveType}` : ''} // Show the leave type dynamically
											readOnly
											className="w-full p-1 border border-gray-300 bg-gray-200"
										/>
									</td>
								);
							})}
							<td className="border border-black p-2"></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="mt-4 sm:mt-6 flex justify-center">
				<button
					onClick={handleSubmit}
					className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md text-md sm:text-sm"
				>
					Submit
				</button>
			</div>
		</div>

	);
};
export default TimeEntryPage;
