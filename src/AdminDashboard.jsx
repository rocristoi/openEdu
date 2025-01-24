import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInfo } from "react-icons/fa6";
import { BsQuestion } from "react-icons/bs";
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const AdminDashboard = ({data, user, userDashboard, handleCloseUserDashboard}) => {
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeOption, setActiveOption] = useState(1);

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const closeModal = () => {
    setIsStudentModalOpen(false);
    setSelectedStudent(null);
    setSelectedClass(null);
    setIsClassModalOpen(false);
  };

  const handleClassClick = (clasa) => {
    setSelectedClass(clasa);
    setIsClassModalOpen(true);
  };

  const calculateAverageGrade = (studentId) => {
    const filteredGrades = (data.grades).filter(grade => grade.student_id === studentId);
    
    if (filteredGrades.length === 0) {
      return 0;
    }
  
    const total = filteredGrades.reduce((sum, grade) => sum + parseFloat(grade.grade), 0);
    const unfTotal = total / filteredGrades.length;
    return (Math.round(unfTotal * 100) / 100).toFixed(2);
  };

  return (
    <div className="bg-black text-white  min-h-screen font-sans">
      <div className="container mx-auto mt-20 px-8 py-12">


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-800 p-8 rounded-lg shadow-xl transition transform  flex flex-col lg:flex-row justify-between"
          >
            <div className="flex flex-col w-full lg:w-3/5 mb-4 lg:mb-0">
                <h1 className="font-semibold text-2xl">Good to see you, {user.displayName.split(' ')[0]}</h1>
                <span className="mt-2">
                    Welcome to the <strong className="text-green-500">Admin Dashboard</strong>! Here, you can manage <strong className="text-green-500">students</strong>, <strong className="text-green-500">teachers</strong>, and <strong className="text-green-500">classes</strong>.  
                    <br />
                    As you know, with great power comes <strong className="text-green-500">great responsibility</strong>. Please handle your actions with care, as <strong className="text-green-500">changes cannot be undone</strong>.
                    If you have any questions, don't hesitate to reach out to the <a href="mailto:cristi@cristoi.ro" className="underline text-green-500">OpenEdu Dev</a>.
                    </span>
            </div>

            <div className="flex flex-col text-end">
            <h2 className="text-2xl font-semibold text-green-500">School Info</h2>
            <ul className="mt-2 space-y-0 text-lg text-gray-300">
              <li><strong>Name:</strong> {data.schoolInfo[0].school_name}</li>
              <li>
                <strong>Creation Date:</strong> 
                &nbsp; {new Date(data.schoolInfo[0].created_at).toLocaleString("en-US", {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true, 
                })}
                </li>
            </ul>
            </div>
          </motion.div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* School Info */}

          {/* Teachers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gray-800 p-8 rounded-lg shadow-xl transition transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-green-500">Teachers</h2>
 
         <div className="mt-4 space-y-4">
                {data.teachers.map(teacher => (
                <div
                key={teacher.name}
                className="flex justify-between hover:bg-gray-700 p-4 rounded cursor-pointer transition"
              >
                <div>
                  <strong>{teacher.name}</strong>
                  <br />
                  <span className="text-gray-400">{teacher.email}</span>
                </div>
              </div>
                ))}
            </div>
          </motion.div>

          {/* Students */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gray-800 p-8 rounded-lg shadow-xl transition transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-green-500">Students</h2>
            <div className="mt-4 space-y-4">
                {data.students.map(student => (
                <div
                key={student.name}
                className="flex justify-between hover:bg-gray-700 p-4 rounded cursor-pointer transition"
                onClick={() => handleStudentClick(student)}
              >
                <div>
                  <strong>{student.name}</strong>
                  <br />
                  <span className="text-gray-400">{student.email}</span>
                </div>
                <div className="text-gray-500">Avg: {calculateAverageGrade(student.student_id)}</div>
              </div>
                ))}
            </div>
          </motion.div>

          {/* Classes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-gray-800 p-8 rounded-lg shadow-xl transition transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold text-green-500">Classes</h2>
            <div className="mt-4 space-y-4">
                {data.classes.map(clasa => (
                <div
                key={clasa.class_name}
                className="flex justify-between hover:bg-gray-700 p-4 rounded cursor-pointer transition"
                onClick={() => handleClassClick(clasa)}
              >
                <div>
                  <strong>Class {clasa.class_name}</strong>
                  <br />
                  <span className="text-gray-400">HT: {data.teachers.find(teacher => teacher.teacher_id === clasa.head_teacher_id)?.name}</span>
                </div>
              </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* Modal: Student Details */}
        <AnimatePresence>
        {isStudentModalOpen && (
                <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 "
                initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
                animate={{ backdropFilter: "blur(10px)", opacity: 1 }}
                exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
                transition={{ duration: 0.3 }}
                >     
                <motion.div
                className="bg-gray-800 text-white p-8 rounded-lg shadow-xl max-w-lg w-full"
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1}}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                >
              <h2 className="text-2xl font-semibold text-green-500">{selectedStudent.name}</h2>
              <p className="text-lg mt-4">{selectedStudent.email}</p>
              <p className="text-lg mt-2">Average: {calculateAverageGrade(selectedStudent.student_id)}</p>


              <h3 className="mt-4 font-semibold text-green-500">Grades</h3>
              <ul
                    className="mt-2 space-y-2 text-gray-300 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700"
                    >
                    {(data.grades
                        .filter(grade => grade.student_id === selectedStudent.student_id)
                    ).map((grade, index) => (
                        <li key={index} className="flex justify-between items-center">
                        <strong>{`${grade.grade} | ${(data.teacherSubjects).find(subject => subject.id == parseInt(grade.subject)).subject} | '${grade.comments}'`}</strong>
                        <div className="flex flex-col text-right">
                            <span className="text-gray-400">
                            {data.teachers.find(teacher => teacher.teacher_id === grade.teacher_id)?.name}
                            </span>
                            <span className="text-xs">
                            {new Date(grade.created_at).toLocaleString("en-US", {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour12: false,
                            })}
                            </span>
                        </div>
                        </li>
                    ))}
                    </ul>

                    <h3 className="mt-4 font-semibold text-green-500">Absences</h3>
                    <h2 className="font-medium text-gray-500">
                    {data.absences.filter(
                        absence => absence.student_id === selectedStudent.student_id && absence.status === 'EXCUSED'
                    ).length}{' '}
                    Motivated /{' '}
                    {data.absences.filter(
                        absence => absence.student_id === selectedStudent.student_id && absence.status === 'PENDING'
                    ).length}{' '}
                    Not Motivated
                    </h2>
                    <ul
                    className="mt-2 space-y-2 text-gray-300 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700"
                    >
                    {(data.absences
                        .filter(absence => absence.student_id === selectedStudent.student_id)
                    ).map((absence, index) => (
                        <li key={index} className="flex justify-between">
                        <div className="flex flex-row items-center gap-2">
                            <div
                            className={`rounded-full ${
                                absence.status === 'PENDING' ? 'bg-red-500' : 'bg-green-500'
                            } h-1 w-[5px]`}
                            ></div>
                            <strong>
                            {new Date(absence.created_at).toLocaleString("en-US", {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: false,
                            })} {`(${(data.teacherSubjects).find(subject => subject.id == parseInt(absence.subject_id)).subject})`}:
                            </strong>
                        </div>
                        <span className="text-gray-400">{absence.reason}</span>
                        </li>
                    ))}
                    </ul>


              <button
                onClick={closeModal}
                className="mt-6 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

         {/* Modal: Class Details */}
         <AnimatePresence>
        {isClassModalOpen && (
                <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 "
                initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
                animate={{ backdropFilter: "blur(10px)", opacity: 1 }}
                exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
                transition={{ duration: 0.3 }}
                >     
                <motion.div
                className="bg-gray-800 text-white p-8 rounded-lg shadow-xl max-w-lg w-full"
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1}}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                >
              <h2 className="text-2xl font-semibold text-green-500">Class {selectedClass.class_name}</h2>
              <p className="text-lg mt-4">Head Teacher: {data.teachers.find(teacher => teacher.teacher_id === selectedClass.head_teacher_id)?.name}</p>
              <p className="text-lg mt-2">Has {data.students.filter(student => student.class_id === selectedClass.class_id)?.length} students</p>


              <h3 className="mt-4 font-semibold text-green-500">Students</h3>
              <ul
                    className="mt-2 space-y-2 text-gray-300 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700"
                    >
                    {(data.students
                        .filter(student => student.class_id === selectedClass.class_id)
                    ).map((student, index) => (
                        <li key={index} className="flex justify-between items-center">
                            <div className="flex flex-col text-start">
                            <strong>{student.name}</strong>
                            <span className="text-xs">Average: {calculateAverageGrade(student.student_id)}</span>
                            </div>
                        <span>{student.email}</span>
                        </li>
                    ))}
                    </ul>


              <button
                onClick={closeModal}
                className="mt-6 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>


        <AnimatePresence>

        {userDashboard && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
                    initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
                    animate={{ backdropFilter: "blur(10px)", opacity: 1 }}
                    exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                    className="bg-gray-800 text-white rounded-lg shadow-2xl max-w-2xl w-full"
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    >
                    {/* Popup Header */}
                    <div className="flex justify-between items-center bg-gray-900 rounded-t-lg px-4 py-2">
                        <span className="font-bold text-lg">User Dashboard</span>
                        <button
                        className="text-red-400 hover:text-red-600"
                        onClick={handleCloseUserDashboard}
                        >
                        ✖
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="flex h-[300px]">
                        {/* Sidebar */}
                        <div className="w-1/3 bg-gray-900 rounded-l-lg flex flex-col">
                        <motion.div
                            className="h-2/5 flex flex-col items-center justify-center rounded-tl-lg cursor-pointer transition-colors"
                            animate={{
                            backgroundColor: activeOption === 1 ? "#1F2937" : "#111827",
                            }}
                            whileHover={{ backgroundColor: "#1F2937" }}
                            onClick={() => setActiveOption(1)}
                        >
                            <FaInfo className="w-4 h-4" />
                            <span className="text-sm font-bold">Account Info</span>
                        </motion.div>

                        <motion.div
                            className="h-2/5 flex flex-col items-center justify-center cursor-pointer transition-colors"
                            animate={{
                            backgroundColor: activeOption === 2 ? "#1F2937" : "#111827",
                            }}
                            whileHover={{ backgroundColor: "#1F2937" }}
                            onClick={() => setActiveOption(2)}
                        >
                            <BsQuestion className="w-5 h-5" />
                            <span className="text-sm font-bold">About</span>
                        </motion.div>

                        <button
                            className="mt-auto bg-gray-900 h-1/5 hover:bg-gray-800 text-white font-bold py-2 rounded-bl-lg cursor-pointer transition"
                            onClick={logoutUser}
                        >
                            Log Out
                        </button>
                        </div>

                        {/* Main Content */}
                        <div className="w-2/3">
                        {activeOption === 1 ? (
                            <div className="flex flex-col p-6">
                            <div className="text-center mb-4">
                                <span className="font-bold text-xl">Account Data</span>
                            </div>
                            <div className="mt-2 flex flex-col">
                                
                                <span>Display Name: {user.displayName}</span>
                                <span>Email: {user.email}</span>
                                <span
                                className="cursor-pointer text-blue-400 hover:underline"
                                onClick={() => navigator.clipboard.writeText(user.uid)}
                                >
                                UID: Click to copy
                                </span>
                                <span className="mt-16 text-xs">* UID may be used to troubleshoot some errors, staff will ask for it instead of email addresses for security reasons.</span>
                            </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full p-9">
                            <p className="text-gray-400 text-xl">Why openEdu?</p>
                            <p className="mt-2">Open Edu is entirely developed by a high school student from Romania. The goal was to create a straightforward, open-source platform that is free for schools in need of such software but lack the budget to afford one. This project is open source, you may <a href="https://github.com/rocristoi/openEdu" className="underline">contribute on github.</a></p>
                            </div>
                        )}
                        </div>
                    </div>
                    </motion.div>
                </motion.div>
                )}

        </AnimatePresence>

      </div>
    </div>
  );
};

export default AdminDashboard;
