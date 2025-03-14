import React, { useState, useEffect } from "react";
import CheckIn from "../components/CheckIn";
import ExportDropdown from "../components/ExportDropDown";
import {
	getAttendance,
	getUsers,
	getCourses,
	createAttendanceList,
} from "../api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Attendance = () => {
	const [levels] = useState(["100L", "200L", "300L", "400L", "500L"]);
	const [semesters] = useState(["first", "second"]);
	const [selectedLevel, setSelectedLevel] = useState("");
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedSemester, setSelectedSemester] = useState("");
	const [courses, setCourses] = useState([]);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [attendance, setAttendance] = useState([]);

	const fetchCourses = async () => {
		if (selectedLevel && selectedSemester) {
			try {
				const response = await getCourses(
					selectedLevel,
					selectedSemester
				);
				setCourses(response.data);
			} catch (err) {
				console.error("Error fetching courses:", err);
				toast.error("Failed to fetch courses.");
			}
		}
	};

	const createAttendance = async () => {
		if (selectedCourse) {
			try {
				//console.log("course code", selectedCourse);
				await createAttendanceList(selectedCourse);
				fetchAttendance();
			} catch (err) {
				console.error("Error creating attendance list:", err);
				toast.error("Failed to create attendance list.");
			}
		}
	};

	const fetchAttendance = async () => {
		if (selectedCourse && selectedDate) {
			try {
				console.log("course code", selectedCourse);
				const response = await getAttendance(
					selectedCourse,
					selectedDate
				);
				setAttendance(response.data);
			} catch (err) {
				toast.error("Failed to fetch attendance records.");
			}
		}
	};

	useEffect(() => {
		fetchCourses();
	}, [selectedLevel, selectedSemester]);

	return (
		<div className="w-full h-[800px] p-5 rounded-xl grid grid-cols-2 gap-5">
			<div className="w-full">
				<h2 className="text-2xl font-semibold mb-4 text-gray-700">
					Attendance Check-In
				</h2>
				<div className="mb-4">
					<select
						value={selectedLevel}
						onChange={(e) => setSelectedLevel(e.target.value)}
						className="mr-4 p-2 border rounded"
					>
						<option value="">Select Level</option>
						{levels.map((level) => (
							<option key={level} value={level}>
								{level}
							</option>
						))}
					</select>
					<select
						value={selectedSemester}
						onChange={(e) => setSelectedSemester(e.target.value)}
						className="mr-4 p-2 border rounded"
					>
						<option value="">Select Semester</option>
						{semesters.map((semester) => (
							<option key={semester} value={semester}>
								{semester}
							</option>
						))}
					</select>
					<select
						value={selectedCourse}
						onChange={(e) => setSelectedCourse(e.target.value)}
						className="p-2 border rounded"
					>
						<option value="">Select Course</option>
						{courses.map((course) => (
							<option key={course._id} value={course.courseCode}>
								{course.courseName}
							</option>
						))}
					</select>
					<button
						onClick={createAttendance}
						className="ml-4 p-2 bg-blue-500 text-white rounded"
					>
						Create Attendance List
					</button>
				</div>
				<CheckIn onMarkAttendance={fetchAttendance} />
			</div>
			<section className="w-full">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">
					{selectedCourse
						? `${selectedCourse} Attendance List`
						: "Attendance List"}
				</h2>

				<div className="flex items-center gap-4 mb-4">
					<select
						className="border p-2 rounded-md"
						onChange={(e) => setSelectedCourse(e.target.value)}
					>
						<option value="">Select Course</option>
						{courses.map((course) => (
							<option key={course._id} value={course.courseCode}>
								{course.courseName}
							</option>
						))}
					</select>

					<input
						type="date"
						className="border p-2 rounded-md"
						onChange={(e) => setSelectedDate(e.target.value)}
					/>

					<button
						onClick={fetchAttendance}
						className="bg-blue-500 text-white px-4 py-2 rounded-md"
					>
						Fetch Attendance
					</button>
				</div>

				<div className="bg-white shadow rounded-lg p-4">
					{attendance.length === 0 ? (
						<p className="text-center text-gray-500">
							No attendance records yet.
						</p>
					) : (
						<table className="min-w-full leading-normal">
							<thead>
								<tr>
									<th>User Name</th>
									<th>Mat. Number</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{attendance.map((record) => (
									<tr key={record._id}>
										<td>
											{record.student?.name || "Unknown"}
										</td>
										<td>
											{record.student?.mat_num ||
												"Unknown"}
										</td>
										<td>{record.status || "Absent"}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</section>
		</div>
	);
};

export default Attendance;
