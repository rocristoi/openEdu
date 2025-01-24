import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInfo } from "react-icons/fa6";
import { BsQuestion } from "react-icons/bs";
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const StudentDashboard = ({data, user, userDashboard, handleCloseUserDashboard}) => {


  const [activeOption, setActiveOption] = useState(1);
  const [selected, setSelected] = useState("Grades");

        const [isMobile, setIsMobile] = useState(false);
  
        useEffect(() => {
          const checkMobile = () => {
            if (window.innerWidth <= 768) {
              setIsMobile(true); 
            } else {
              setIsMobile(false);
            }
          };
      
          checkMobile();
      
          window.addEventListener('resize', checkMobile);
      
          return () => {
            window.removeEventListener('resize', checkMobile);
          };
        }, []); 

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  function calculateSubjectAverage(subjectGrades) {
    const total = subjectGrades.reduce(
      (sum, grade) => sum + parseFloat(grade.grade),
      0
    );
    return (total / subjectGrades.length).toFixed(2);
  }
  function calculateOverallAverage(grades) {

    let total = 0;
    grades.map(grade => {
      total = total + parseInt(grade.grade)
    })
    return (total / grades.length).toFixed(2);
  }
  

  function getUniqueSubjects(grades) {
    return [...new Set(grades.map((item) => item.subject))].sort();
  }
  function getGradesBySubject(grades, subject) {
    return grades
      .filter((item) => item.subject === subject)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }
  function calculateExcusedPercentage() {
    const total = data.absences.length;
    const excused = data.absences.filter((a) => a.status === "EXCUSED").length;
    return Math.round((excused / total) * 100);
  }
  function calculateExcused(absences) {
    return absences.filter((a) => a.status === "EXCUSED" ).length;
  }
  function calculatePending(absences) {
    return absences.filter((a) => a.status === "PENDING").length;
  }
  
  
  return (
    <div className="bg-black text-white  min-h-screen  font-sans">
      <div className="container mx-auto mt-20 px-8 py-12">


          <div
            className="bg-gray-800 p-8 rounded-lg shadow-xl transition transform  flex flex-col lg:flex-row justify-between"
          >
            <div className="flex flex-col w-full lg:w-3/5 mb-4 lg:mb-0">
                <h1 className="font-semibold text-2xl">Good to see you, {user.displayName}</h1>
                <span className="mt-2">
                  Welcome to the <strong className="text-green-500">Student Dashboard</strong>! Here, you can access your <strong className="text-green-500">grades</strong> and keep track of your <strong className="text-green-500">attendance</strong>.  
                
                  This platform is designed to support your learning journey, so make the most of it and take <strong className="text-green-500">responsibility</strong> for your progress. Remember, your success depends on your dedication and efforts.
                  If you have any questions or face any issues, feel free to contact the <span  className="underline text-green-500">School Administrator</span>.
              </span>
            </div>

            <div className="flex flex-col text-end">
            <h2 className="text-2xl font-semibold text-green-500">More Info</h2>
            <ul className="mt-2 space-y-0 text-lg text-gray-300">
              <li><strong>School Name:</strong> {data.schoolName}</li>
              <li>
                You are assigned to class &nbsp; 
                    <strong>{data.className}</strong>
                </li>
            </ul>
            </div>
          </div>
          {!isMobile && (
              
          <div className="w-full flex flex-row gap-10 items-center justify-center mt-10 text-lg"
          >
    

      <div
        onClick={() => setSelected("Grades")}
        className="flex flex-col items-center cursor-pointer"
      >
        <motion.span
          animate={{
            color: selected === "Grades" ? "#22c55e" : "#fff", 
          }}
          transition={{ duration: 0.3 }}
          className="font-bold"
        >
          Grades
        </motion.span>
        <motion.div
          className="w-full h-1 bg-green-500"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: selected === "Grades" ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            originX: 0,
          }}
        />
      </div>

      <div
        onClick={() => setSelected("Absences")}
        className="flex flex-col items-center cursor-pointer"
      >
        <motion.span
          animate={{
            color: selected === "Absences" ? "#22c55e" : "#fff",
          }}
          transition={{ duration: 0.3 }}
          className="font-bold"
        >
          Absences
        </motion.span>
        <motion.div
          className="w-full h-1 bg-green-500"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: selected === "Absences" ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            originX: 0,
          }}
        />
      </div>
    </div>
            )}

        <div className="mt-10 flex flex-col gap-10"
        >
         {selected == 'Grades' ? (
          <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4 }}
  className="bg-gray-800 p-8 rounded-lg shadow-2xl transform"
>
  <h2 className="text-3xl font-extrabold text-green-400 mb-4">
    Student Grades Overview
  </h2>

  <div className="mt-6 bg-gray-700 p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-bold text-green-300 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 mr-2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 11.25V8.25m0 8.25h.007m-.007-8.25h.007m0 8.25h.007M3 21h18M3 3h18m-4.5 18v-6m-3 6v-4.5m-3 4.5V13.5M9 3v4.5M6 3v6M3 3v6m18-6v6m0 12h-4.5m4.5 0H18"
        />
      </svg>
      Overall Statistics
    </h3>
    <div className="flex items-center justify-between mt-4 text-gray-200">
      <div className="flex flex-col items-center">
        <div className="text-4xl font-bold text-green-400">
          {calculateOverallAverage(data.grades)}
        </div>
        <span className="text-sm">Average Grade</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="text-4xl font-bold text-green-400">
          {getUniqueSubjects(data.grades).length}
        </div>
        <span className="text-sm">Subjects</span>
      </div>
    </div>
  </div>

  <div className="mt-10">
    <h3 className="text-xl font-bold text-green-300 flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 mr-2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 18.75V4.125a2.625 2.625 0 012.625-2.625H19.5a2.625 2.625 0 012.625 2.625v14.625m0 0L3 18.75m19.125 0V21a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-2.25"
        />
      </svg>
      Subjects and Grades
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {getUniqueSubjects(data.grades).map((subject) => (
        <div
          key={subject}
          className="p-6 bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition"
        >
            <h4 className="text-lg font-semibold text-green-400">{subject}</h4>
          <ul className="mt-2 text-gray-300 space-y-2">
            {getGradesBySubject(data.grades, subject).map((grade, gIdx) => (
              <li key={gIdx} className="flex justify-between">
                <div>
                  <strong className="text-gray-400">Grade:</strong>{" "}
                  <span>{grade.grade}</span>{" "}
                  <em className="text-gray-500">({grade.comments})</em>
                </div>
                <small className="text-gray-500">
                  {new Date(grade.created_at).toLocaleDateString()}
                </small>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <strong className="text-green-400">Average:</strong>{" "}
            <span className="text-lg font-bold">
              {calculateSubjectAverage(getGradesBySubject(data.grades, subject))}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</motion.div>



         ) : (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-800 p-8 rounded-lg shadow-2xl transform"
        >
          <h2 className="text-3xl font-extrabold text-green-400 mb-4">
            Class Absence Overview
          </h2>
        
          <div className="mt-6 bg-gray-700 p-4 lg:p-6rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-green-300 flex items-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8.25h-4.5a2.25 2.25 0 00-2.25 2.25v2.25m0 0H4.5M15 "
                />
              </svg>
              Absences
            </h3>
            <div className="flex flex-col items-center lg:flex-row lg:justify-around mt-6">
            <div className="flex justify-center items-center w-1/2 lg:w-auto mb-6 lg:mb-10">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <circle
                    className="text-gray-300"
                    strokeWidth="4"
                    fill="transparent"
                    cx="18"
                    cy="18"
                    r="16"
                    style={{ strokeDasharray: "100, 100", strokeDashoffset: "0" }}
                  />
                  <circle
                    className="text-green-500"
                    strokeWidth="4"
                    fill="transparent"
                    stroke="#4CAF50"
                    cx="18"
                    cy="18"
                    r="16"
                    style={{
                      strokeDasharray: `${calculateExcusedPercentage()} 0`,
                      strokeDashoffset: "25",
                    }}
                  />
                  <circle
                    className="text-red-500"
                    strokeWidth="4"
                    stroke="red"
                    fill="transparent"
                    cx="18"
                    cy="18"
                    r="16"
                    style={{
                      strokeDasharray: `${100 - calculateExcusedPercentage()} ${calculateExcusedPercentage()}`,
                      strokeDashoffset: "25",
                    }}
                  />
                </svg>

                <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                  <span className={`${calculateExcusedPercentage() > 70 ? 'text-green-500' : 'text-red-500'} text-lg font-bold`}>
                    {calculateExcusedPercentage()}%
                  </span>
                </div>
              </div>
            </div>

            <div className="text-gray-300 space-y-0 lg:space-y-2 text-center lg:text-end mt-4 lg:mt-0">
              <div>
                <strong className="text-green-500">Excused:</strong> {calculateExcused(data.absences)}
              </div>
              <div>
                <strong className="text-red-500">Pending:</strong> {calculatePending(data.absences)}
              </div>
              <div>
                <strong className="text-green-400">Total Absences:</strong> {data.absences.length}
              </div>
            </div>
          </div>

          </div>
        
          <div className="mt-10">
            <h3 className="text-xl font-bold text-green-300 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8.25h-4.5a2.25 2.25 0 00-2.25 2.25v2.25m0 0H4.5M15 "
                />
              </svg>
              Absence Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {data.absences.map((absence, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-lg shadow-md ${
                    absence.status === "EXCUSED"
                      ? "bg-green-700"
                      : "bg-red-700"
                  }`}
                >
                  <h4 className="text-lg font-semibold text-gray-100 flex items-center">
                    {absence.subject}{" "}
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                        absence.status === "EXCUSED"
                          ? "bg-green-400 text-gray-800"
                          : "bg-red-400 text-gray-800"
                      }`}
                    >
                      {absence.status}
                    </span>
                  </h4>
                  <p className="text-gray-300 mt-2">
                    <strong>Reason:</strong> {absence.reason}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {new Date(absence.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
         )}
         
        </div>

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

                    <div className="flex h-[300px]">
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
    {isMobile && (

    <div className="mt-10 mb-10">&nbsp;</div>
    )}
    {isMobile && (
  <div className="absolute bottom-0 left-0 right-0 w-full h-[8%] bg-black flex flex-row items-center justify-center p-6 gap-14 rounded-t-xl border-t border-t-4 border-green-500">
          <div
        onClick={() => setSelected("Grades")}
        className="flex flex-col items-center cursor-pointer"
      >
        <motion.span
          animate={{
            color: selected === "Grades" ? "#22c55e" : "#fff", 
          }}
          transition={{ duration: 0.3 }}
          className="font-bold"
        >
          Grades
        </motion.span>
        <motion.div
          className="w-full h-1 bg-green-500"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: selected === "Grades" ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            originX: 0,
          }}
        />
      </div>

          <div className="h-full w-1 bg-gray-400"></div>
      <div
        onClick={() => setSelected("Absences")}
        className="flex flex-col items-center cursor-pointer"
      >
        <motion.span
          animate={{
            color: selected === "Absences" ? "#22c55e" : "#fff",
          }}
          transition={{ duration: 0.3 }}
          className="font-bold"
        >
          Absences
        </motion.span>
        <motion.div
          className="w-full h-1 bg-green-500"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: selected === "Absences" ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            originX: 0,
          }}
        />
      </div>
  </div>
)}
    </div>
  );
};

export default StudentDashboard;
