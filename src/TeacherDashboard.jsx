import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInfo } from "react-icons/fa6";
import { BsQuestion } from "react-icons/bs";
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { IoIosAddCircleOutline } from "react-icons/io";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { CiCircleMinus } from "react-icons/ci";
import apiUrl from './config';
import axios from 'axios';

const TeacherDashboard = ({data, user, userDashboard, handleCloseUserDashboard}) => {
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  const [motivateAbsenceModal, setMotivateAbsenceModal] = useState(false);
  const [excuseModal, setExcuseModal] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [motivateAbsenceDialog, setMotivateAbsenceDialog] = useState([false,])
  const [isHtStudentInfoModalOpen, setHtStudentInfoModalOpen] = useState(false); 
  const [activeOption, setActiveOption] = useState(1);
  const [htClass, setHtClass] = useState({});
  const [absenceDialog, setAbsenceDialog] = useState([false, ]);
  const [gradeDialog, setGradeDialog] = useState([false, ]);
  const [reasonInput, setReasonInput] = useState('Not Specified');
  const [gradeInput, setGradeInput] = useState('')
  const [commentInput, setCommentInput] = useState('Null')
  const [motivateReasonInput, setMotivateReasonInput] = useState('');
  const [selected, setSelected] = useState("HT Class");
  const [activeNotification, setActiveNotification] = useState(null);

  const excuseAbsences = async (studentId, startDate, endDate, reason) => {
    setExcuseModal(false);
    setSelectedStudent();

      let finalData = {
        studentId,
        startDate,
        endDate,
        reason,
      }


      try {
        const idToken = await  auth.currentUser.getIdToken(true);
        const response = await axios.post(`${apiUrl}/excusePeriod`, finalData, {
          headers: { 
            Authorization: `Bearer ${idToken}`,
            'Content-Type': 'application/json', 
          },
        });
        if (response.status >= 200 && response.status < 300) {
          if(response.data.excusedAbsences == 0) {
            notify('Absences Already Excused', `There are no absences to excuse in this interval.`, 'SUCCESS')
          } else {
            notify('Absences Excused', `Excused a total of ${response.data.excusedAbsences} absences for this student.`, 'SUCCESS')
          }
        } else {
          notify('Failed', `Absences were not removed. Contact your administrator.`, 'FAIL')
        }
      } catch (err) {
        notify('Failed', `Absences were not removed. Contact OpenEdu team.`, 'FAIL')
      } finally {
        setStartDate();
        setEndDate();
        setReasonInput('Not specified');
      }

  }


  const handleMotivateAbsence = async (absence, reason) => {
    setMotivateAbsenceDialog([false,])
    setHtStudentInfoModalOpen(false);
    setMotivateAbsenceModal(false);
    setSelectedStudent();
    setMotivateReasonInput();
    let finalData = {
      absence,
      reason
    }

    try {
      const idToken = await  auth.currentUser.getIdToken(true);
      const response = await axios.post(`${apiUrl}/excuse`, finalData, {
        headers: { 
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json', 
        },
      });

      if (response.status >= 200 && response.status < 300) {
        notify('Absence Excused', `Absence Was Removed succsesfully`, 'SUCCESS')
      } else {
        notify('Failed', `Absence Was not removed. Contact your administrator.`, 'FAIL')
      }
    } catch (err) {
      notify('Failed', `Absence Was not removed. Contact OpenEdu team.`, 'FAIL')
    } finally {

    }

  }

  const notify = (title, subtitle, type) => {
    if(type == 'SUCCESS') {
      setActiveNotification(['green', title, subtitle])
      setTimeout(() => {
        setActiveNotification(null);
    }, 6000);
    } else {
      setActiveNotification(['red', title, subtitle])
      setTimeout(() => {
        setActiveNotification(null);
    }, 6000);
    }
  }

  const handleHtInfoClick = (student) => {
    setSelectedStudent(student);
    setHtStudentInfoModalOpen(true);
  }

  const handleStudentClick = (student, subject) => {
    setSelectedStudent(student);
    setSelectedSubject(subject);
    setIsStudentModalOpen(true);
  };

  const handleAddAbsence = async (studentId, subjectId, name) => {
    let finalData = {
      studentId,
      subjectId,
      reason: reasonInput,
    }
    try {
      const idToken = await  auth.currentUser.getIdToken(true);
      const response = await axios.post(`${apiUrl}/addAbsence`, finalData, {
        headers: { 
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json', 
        },
      });

      if (response.status >= 200 && response.status < 300) {
        notify('Absence Added', `Absence Was Added succsesfully to ${name}`, 'SUCCESS')
      } else {
        notify('Failed', `Absence Was not added to ${name}. Contact your administrator.`, 'FAIL')
      }
    } catch (err) {
      notify('Failed', `Absence Was not added to ${name}. Contact OpenEdu team.`, 'FAIL')
    } finally {
      setAbsenceDialog([false,]);
      setReasonInput('Not Specified');
    }

  }


  const handleAddGrade = async (studentId, subjectId, name) => {
    if(!gradeInput) return;
    let finalData = {
      studentId,
      subjectId,
      grade: parseInt(gradeInput),
      comment: commentInput,
    }
    try {
      const idToken = await  auth.currentUser.getIdToken(true);
      const response = await axios.post(`${apiUrl}/addGrade`, finalData, {
        headers: { 
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json', 
        },
      });

      if (response.status >= 200 && response.status < 300) {
        notify('Grade Added', `Grade Was Added Succsesfully to ${name}`, 'SUCCESS')
      } else {
        notify('Failed', `Grade Was not added to ${name}. Contact your administrator.`, 'FAIL')
      }
    } catch (err) {
      notify('Failed', `Grade Was not added to ${name}. Contact OpenEdu team.`, 'FAIL')
    } finally {
      setGradeDialog([false,]);
      setCommentInput('Null');
      setGradeInput('')
    }

  }

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {
    let htClassInfo = data.classes.find(clasa => clasa.head_teacher_id == data.teacherInfo[0].teacher_id);
    setHtClass(htClassInfo);
  });

  const closeModal = () => {
    setIsStudentModalOpen(false);
    setSelectedStudent(null);
    setSelectedSubject(null);
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



  const calculateSubjectAverage = (studentId, subjectId) => {
    const filteredGrades = (data.grades).filter(grade => grade.student_id === studentId && parseInt(grade.subject) == subjectId);
    
    if (filteredGrades.length === 0) {
      return 0;
    }
  
    const total = filteredGrades.reduce((sum, grade) => sum + parseFloat(grade.grade), 0);
    const unfTotal = total / filteredGrades.length;
    return (Math.round(unfTotal * 100) / 100).toFixed(2);
  };

  return (
    <div className="bg-black text-white  min-h-screen font-sans ">
      <div className="container mx-auto mt-20 px-8 py-12 ">


          <div
            className="bg-gray-800 p-8 rounded-lg shadow-xl transition transform  flex flex-col lg:flex-row justify-between "
          >
            <div className="flex flex-col w-full lg:w-3/5 mb-4 lg:mb-0">
                <h1 className="font-semibold text-2xl">Good to see you, {user.displayName}</h1>
                <span className="mt-2">
                    Welcome to the <strong className="text-green-500">Teacher Dashboard</strong>! Here, you can manage <strong className="text-green-500"> your students'</strong> <strong className="text-green-500">grades, </strong><strong className="text-green-500">absences</strong> and more.  
                    <br />
                    As you know, with great power comes <strong className="text-green-500">great responsibility</strong>. Please handle your actions with care, as <strong className="text-green-500">changes cannot be undone</strong>.
                    If you have any questions, please reach out to the <a href="mailto:cristi@cristoi.ro" className="underline text-green-500">School Administrator</a>.
                    </span>
            </div>

            <div className="flex flex-col text-end">
            <h2 className="text-2xl font-semibold text-green-500">More Info</h2>
            <ul className="mt-2 space-y-0 text-lg text-gray-300">
              <li><strong>School Name:</strong> {data.schoolInfo[0].school_name}</li>
              <li>
                <strong>Head Teacher at Class </strong> 
                    {data.classes.find(clasa => clasa.head_teacher_id == data.teacherInfo[0].teacher_id)?.class_name}
                </li>
            </ul>
            </div>
          </div>

          <div className="w-full flex flex-row gap-10 items-center justify-center mt-10 text-lg"
          >

      <div
        onClick={() => setSelected("HT Class")}
        className="flex flex-col items-center cursor-pointer"
      >
        <motion.span
          animate={{
            color: selected === "HT Class" ? "#22c55e" : "#fff", 
          }}
          transition={{ duration: 0.3 }}
          className="font-bold"
        >
          HT Class
        </motion.span>
        <motion.div
          className="w-full h-1 bg-green-500"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: selected === "HT Class" ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            originX: 0,
          }}
        />
      </div>

      <div
        onClick={() => setSelected("Other Classes")}
        className="flex flex-col items-center cursor-pointer"
      >
        <motion.span
          animate={{
            color: selected === "Other Classes" ? "#22c55e" : "#fff",
          }}
          transition={{ duration: 0.3 }}
          className="font-bold"
        >
          Other Classes
        </motion.span>
        <motion.div
          className="w-full h-1 bg-green-500"
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: selected === "Other Classes" ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            originX: 0,
          }}
        />
      </div>
    </div>

        <div className="mt-10 flex flex-col gap-10"
        >
         {selected == 'HT Class' ? (
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-800 p-8 rounded-lg shadow-xl transition transform "
          >
          <h2 className="text-2xl font-semibold text-green-500">Class {htClass.class_name} (HT Subject)</h2>
          <span>Has {data.students.filter(student => student.class_id == htClass.class_id).length} students</span>
          <div className="mt-4 space-y-4">
              {data.students
              .filter(student => student.class_id === htClass.class_id)
              .sort((a, b) => a.name.localeCompare(b.name)) 
              .map(student => (
              <div
              key={student.name}
              className="flex justify-between hover:bg-gray-700 p-4 rounded  transition items-center"
            >
              <div>
                <strong>{student.name}</strong>
                <br />
                <span className="text-gray-400">Average: {calculateAverageGrade(student.student_id)}</span>
              </div>
              <div className="flex flex-row gap-8 items-center">
              <div className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                setSelectedStudent(student);
                setExcuseModal(true);
              }}>
                  <CiCircleMinus className="w-[25px] h-[25px]" />
                  <span className="text-sm">Excuse</span>
                </div>
              <div className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                setSelectedStudent(student);
                setMotivateAbsenceModal(true);
              }}
              >
                  <CiCircleMinus className="w-[25px] h-[25px]" />
                  <span className="text-sm">Mtv. Abs.</span>
                </div>
                <div className="flex flex-col items-center cursor-pointer"
                onClick={() => handleHtInfoClick(student)}
                >
                  <AiOutlineInfoCircle className="w-[25px] h-[25px]" />
                  <span className="text-sm">View Inf.</span>

                </div>




              </div>
            </div>
              ))}
          </div>
          </motion.div>
         ) : (
          data.teacherSubject.map(subject => (
            <div >
              <motion.span className="w-full text-start text-4xl  font-bold text-green-500"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.4}}
              >{subject.subject}</motion.span>
              {data.classes.map(clasa => (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-gray-800 p-8 rounded-lg shadow-xl transition transform mt-10"
            >
            <h2 className="text-2xl font-semibold text-green-500">Class {clasa.class_name} {`(${subject.subject})`}</h2>
            <span>Has {data.students.filter(student => student.class_id == clasa.class_id).length} students</span>
            <div className="mt-4 space-y-4">
                {data.students
                .filter(student => student.class_id === clasa.class_id)
                .sort((a, b) => a.name.localeCompare(b.name)) 
                .map(student => (
                <div
                key={student.name}
                className="flex justify-between hover:bg-gray-700 p-4 rounded transition items-center"
              >
                <div>
                  <strong>{student.name}</strong>
                  <br />
                </div>
  
                <div className="flex flex-row gap-8 items-center">
                  <div className="flex flex-col items-center cursor-pointer"
                  onClick={() => setAbsenceDialog([true, student, subject])}
                  >
                    <IoIosAddCircleOutline className="w-[25px] h-[25px]" />
                    <span className="text-sm">Add Abs.</span>
                  </div>
  
                  <div className="flex flex-col items-center cursor-pointer"
                  onClick={() => setGradeDialog([true, student, subject])}
                  >
                    <IoIosAddCircleOutline className="w-[25px] h-[25px]" />
                    <span className="text-sm">Add Grd.</span>
                  </div>
                  <div className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleStudentClick(student, subject)}
                  >
                    <AiOutlineInfoCircle className="w-[25px] h-[25px]" />
                    <span className="text-sm">View Inf.</span>
  
                  </div>
  
  
                </div>
              </div>
                ))}
            </div>
            </motion.div>
              ))}
            </div>
          ))
         )}
         
        </div>

        <AnimatePresence>
        {isStudentModalOpen && selectedStudent != null && selectedSubject != null && (
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
              <p className="text-lg mt-2">Average ({selectedSubject.subject}): {calculateSubjectAverage(selectedStudent.student_id, selectedSubject.id)}</p>


              <h3 className="mt-4 font-semibold text-green-500">Grades</h3>
              <ul
                    className="mt-2 space-y-2 text-gray-300 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700"
                    >
                    {(data.grades
                        .filter(grade => grade.student_id === selectedStudent.student_id && parseInt(grade.subject) === selectedSubject.id)
                    ).map((grade, index) => (
                        <li key={index} className="flex justify-between items-center px-2">
                        <strong>{`${grade.grade} | '${grade.comments}'`}</strong>
                        <div className="flex flex-col text-right">
                            <span className="text-gray-400">
                            You
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

                    <h3 className="mt-4 font-semibold text-green-500">Absences ({selectedSubject.subject})</h3>
                    <h2 className="font-medium text-gray-500">
                    {data.absences.filter(
                        absence => absence.student_id === selectedStudent.student_id && parseInt(absence.subject_id) == selectedSubject.id && absence.status === 'EXCUSED'
                    ).length}{' '}
                    Motivated /{' '}
                    {data.absences.filter(
                        absence => absence.student_id === selectedStudent.student_id && parseInt(absence.subject_id) == selectedSubject.id && absence.status === 'PENDING'
                    ).length}{' '}
                    Not Motivated
                    </h2>
                    <ul
                    className="mt-2 space-y-2 text-gray-300 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700"
                    >
                    {(data.absences
                        .filter(absence => absence.student_id === selectedStudent.student_id && parseInt(absence.subject_id) == selectedSubject.id )
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
                            })}:
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


                {absenceDialog[0] && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
                    initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
                    animate={{ backdropFilter: "blur(10px)", opacity: 1 }}
                    exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                    className="bg-gray-800 text-white rounded-lg shadow-2xl max-w-2xl p-6"
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    >
                    <div className="flex flex-col  bg-gray-800 rounded-lg px-4 py-2">
                        <h1 className="text-xl font-bold ">Add Absence for {(absenceDialog[1]).name}</h1>
                      <div className="mt-2 flex flex-col gap-2 mb-4 ">
                        <span className="mt-2 text-xs">Reason:</span>
                        <input
                       type="text"
                       value={reasonInput}
                       onChange={(e) => setReasonInput(e.target.value)}
                       placeholder="Not Specified"
                       className="rounded-md  wtext-green-500 bg-[#1e1e1e] border border-green-500 p-2 w-full focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50 placeholder-green-400 transition"
                   />
                    </div>
                    <div className="flex flex-row gap-2">
                   <button className="w-2/3 rounded-md p-2 text-md bg-green-500 hover:bg-green-600 transition"
                   onClick={() => handleAddAbsence((absenceDialog[1]).student_id, (absenceDialog[2]).id, (absenceDialog[1]).name)}
                   >Add Absence</button>
                    <button className="w-1/3 rounded-md p-2 text-md bg-black "
                   onClick={() => {
                    setAbsenceDialog([false,]);
                    setReasonInput('Not Specified');
                   }}
                   >Cancel</button>
                   </div>
                    </div>
                    </motion.div>
                </motion.div>
                )}


          {gradeDialog[0] && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70"
                    initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
                    animate={{ backdropFilter: "blur(10px)", opacity: 1 }}
                    exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >

                    <motion.div
                    className="bg-gray-800 text-white rounded-lg shadow-2xl max-w-2xl p-6"
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    >
                    <div className="flex flex-col  bg-gray-800 rounded-lg px-4 py-2">
                        <h1 className="text-xl font-bold ">Add Grade for {(gradeDialog[1]).name}</h1>
                      <div className="mt-2 flex flex-col gap-2 mb-4 ">
                        <div className="w-full flex flex-row gap-2">
                          <div className="w-1/3">
                        <span className="mt-2 text-xs w-1/3">Grade:</span>
                          </div>
                          <div className="w-2/3">
                          <span className="mt-2 text-xs w-1/3">Comment:</span>
                          </div>
                        </div>
                        <div className="w-full flex flex-row gap-2">
                        <input
                       type="number"
                       value={gradeInput}
                       onChange={(e) => {
                        const value = e.target.value;
                        if (!value || (value > 0 && value <= 10)) {
                          setGradeInput(value);
                        }
                      }}
                       placeholder="Grade"
                       className="rounded-md  wtext-green-500 bg-[#1e1e1e] border border-green-500 p-2 w-1/3 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50 placeholder-green-400 transition"
                      />
                      <input
                       type="text"
                       value={commentInput}
                       onChange={(e) => setCommentInput(e.target.value)}
                       placeholder="Not Specified"
                       className="rounded-md  wtext-green-500 bg-[#1e1e1e] border border-green-500 p-2 w-2/3 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50 placeholder-green-400 transition"
                      />
                        </div>
                        
                    </div>
                    <div className="flex flex-row gap-2">
                   <button className="w-2/3 rounded-md p-2 text-md bg-green-500 hover:bg-green-600 transition"
                   onClick={() => handleAddGrade((gradeDialog[1]).student_id, (gradeDialog[2]).id, (gradeDialog[1]).name)}
                   >Add Grade</button>
                    <button className="w-1/3 rounded-md p-2 text-md bg-black "
                   onClick={() => {
                    setGradeDialog([false,]);
                    setCommentInput('Null');
                    setGradeInput('');
                   }}
                   >Cancel</button>
                   </div>
                    </div>
                    </motion.div>
                </motion.div>
                )}

                {isHtStudentInfoModalOpen && (
                  <motion.div
                  className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 flex flex-row gap-10"
                  initial={{ backdropFilter: "blur(0px)", opacity: 0, x: 0 }}
                  animate={{ backdropFilter: "blur(10px)", opacity: 1, x: motivateAbsenceDialog[0] ? '-20' : '0' }}
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
  
  
                <h3 className="mt-4 font-semibold text-green-500 underline">Grades</h3>
                <ul
                      className="mt-2 space-y-2 text-gray-300 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700"
                      >
                     {data.teachers.filter(ts => 
                        data.grades
                          .filter(grade => grade.student_id === selectedStudent.student_id) 
                          .filter(grade => grade.teacher_id === ts.teacher_id) 
                      ).sort((a, b) => a.subject.localeCompare(b.subject)) 
                      .map(ts => {
                        const subjectId = ts.id;
                        const subjectName = ts.subject;
                        
                        const filteredGrades = data.grades
                          .filter(grade => 
                            parseInt(grade.subject) === subjectId && grade.student_id === selectedStudent.student_id
                          )
                          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                          if (filteredGrades.length === 0) {
                            return null;
                          }
                        return (
                          <div key={subjectId} className="flex flex-col">
                            <span className="text-md font-semibold text-green-500">{subjectName}</span>

                            <ul>
                              {filteredGrades.map((grade, index) => (
                                <li key={index} className="flex justify-between items-center">
                                  <strong>{`${grade.grade}`}</strong>
                                  <strong className="text-sm">{`'${grade.comments}'`}</strong>

                                  <div className="flex flex-col text-right">
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
                          </div>
                        );
                      })}

                      </ul>
  
                      <h3 className="mt-4 font-semibold text-green-500 underline">Absences</h3>
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
                      <h2 className="font-medium text-sm text-gray-500">
                        Click on any absence to motivate.
                      </h2>
                      <ul
                      className="mt-2 space-y-2 text-gray-300 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700"
                      >
                         {data.teachers.filter(ts => 
                        data.absences
                          .filter(absence => absence.student_id === selectedStudent.student_id) 
                          .filter(absence => absence.teacher_id === ts.teacher_id)).map(ts => {
                            const subjectId = ts.id;
                            const subjectName = ts.subject;
                            const filteredAbsences = (data.absences).filter(absence => parseInt(absence.subject_id) === subjectId && absence.student_id === selectedStudent.student_id);
                            if (filteredAbsences.length === 0) {
                              return null;
                            }
                              return(
                                <div key={subjectId} className="flex flex-col">
                                <span className="text-md font-semibold text-green-500">{subjectName}</span>
                                <span className="text-md font-semibold text-green-500"></span>

                                <ul>
                                  {filteredAbsences.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((absence, index) => (
                                    <li key={index} className="flex justify-between">
                                    <motion.div className={`flex flex-row items-center gap-2 ${ absence.status === 'PENDING' ? 'cursor-pointer' : ''}`}
                                    initial={{color: 'rgb(255,255,255)'}}
                                    whileHover={{color: absence.status === 'PENDING' ? 'rgb(76, 175, 80)' : 'rgb(255,255,255)' }}
                                    onClick={() => absence.status === 'PENDING' ? setMotivateAbsenceDialog([true, absence, subjectName]) : ''}
                                    >
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
                                        })}:
                                        </strong>
                                    </motion.div>
                                    <span className="text-gray-400">{absence.reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              );
                      })}
                      </ul>
  
  
                <button
                  onClick={() => {
                    setHtStudentInfoModalOpen(false);
                    setSelectedStudent();
                    setMotivateAbsenceDialog([false,]);
                  }}
                  className="mt-6 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition"
                >
                  Close
                </button>
              </motion.div>
              {motivateAbsenceDialog[0] && (
              <motion.div
              className="bg-gray-800 rounded-lg p-6 pb-8 max-w-lg shadow-lg max-h-lg relative"
              layout
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 10 }}
            >
              <button
              onClick={() => setMotivateAbsenceDialog([false,])}
                className="absolute top-3 right-5 bg-transparent text-white text-l font-bold focus:outline-none"
              >
                ✕
              </button>

              <div className="flex flex-col items-center mt-5 px-5 ">
              <h1 className="text-2xl font-black text-green-500">Motivate Absence</h1>
              <h2 className="text-sm mb-5">Motivate absence for {selectedStudent.name}?</h2>
              <div className="flex flex-col items-center">
                <h1 className="font-bold">Details</h1>
                <ul>
                  <li>Date: {new Date(motivateAbsenceDialog[1].created_at).toLocaleString("en-US", {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour12: false,
                                      })}
                  </li>
                  <li>Subject: {motivateAbsenceDialog[2]}</li>
                </ul>
              </div>
              <div className="flex flex-col items-center mt-4">
                <span>Enter a reason:</span>
                <input
                       type="text"
                       value={motivateReasonInput}
                       onChange={(e) => setMotivateReasonInput(e.target.value)}
                       placeholder="Reason for excusing"
                       className="rounded-md  wtext-green-500 bg-[#1e1e1e] border border-green-500 p-2 w-full focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50 placeholder-green-400 transition"
                   />

              </div>

              <button className="px-4 py-2 bg-green-500 text-white font-bold text-md rounded-lg mt-4"
              onClick={() => handleMotivateAbsence(motivateAbsenceDialog[1], motivateReasonInput )}
              >Motivate</button>

              </div>
            </motion.div>
              )}

            </motion.div>
          )}
          {motivateAbsenceModal && (
                  <motion.div
                  className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 flex flex-row gap-10"
                  initial={{ backdropFilter: "blur(0px)", opacity: 0, x: 0 }}
                  animate={{ backdropFilter: "blur(10px)", opacity: 1, x: motivateAbsenceDialog[0] ? '-20' : '0' }}
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
  
                      <h3 className="mt-4 text-xl font-semibold text-green-500">Absences</h3>
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
                      <h2 className="font-medium text-sm text-gray-500">
                        Click on any absence to motivate.
                      </h2>
                      <ul
                      className="mt-2 space-y-2 text-gray-300 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700"
                      >
                         {data.teachers.filter(ts => 
                        data.absences
                          .filter(absence => absence.student_id === selectedStudent.student_id) 
                          .filter(absence => absence.teacher_id === ts.teacher_id)).map(ts => {
                            const subjectId = ts.id;
                            const subjectName = ts.subject;
                            const filteredAbsences = (data.absences).filter(absence => parseInt(absence.subject_id) === subjectId && absence.student_id === selectedStudent.student_id);
                              return(
                                <div key={subjectId} className="flex flex-col">
                                <span className="text-lg font-semibold text-green-500">{subjectName}</span>
                                <span className="text-md font-semibold text-green-500"></span>

                                <ul>
                                  {filteredAbsences.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((absence, index) => (
                                    <li key={index} className="flex justify-between">
                                    <motion.div className={`flex flex-row items-center gap-2 ${ absence.status === 'PENDING' ? 'cursor-pointer' : ''}`}
                                    initial={{color: 'rgb(255,255,255)'}}
                                    whileHover={{color: absence.status === 'PENDING' ? 'rgb(76, 175, 80)' : 'rgb(255,255,255)' }}
                                    onClick={() => absence.status === 'PENDING' ? setMotivateAbsenceDialog([true, absence, subjectName]) : ''}
                                    >
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
                                        })}:
                                        </strong>
                                    </motion.div>
                                    <span className="text-gray-400">{absence.reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              );
                      })}
                      </ul>
  
  
                <button
                  onClick={() => {
                    setMotivateAbsenceModal(false);                    
                    setMotivateAbsenceDialog([false,]);
                    setSelectedStudent();
                  }}
                  className="mt-6 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition"
                >
                  Close
                </button>
              </motion.div>
              {motivateAbsenceDialog[0] && (
              <motion.div
              className="bg-gray-800 rounded-lg p-6 pb-8 max-w-lg shadow-lg max-h-lg relative"
              layout
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 10 }}
            >
              <button
              onClick={() => setMotivateAbsenceDialog([false,])}
                className="absolute top-3 right-5 bg-transparent text-white text-l font-bold focus:outline-none"
              >
                ✕
              </button>

              <div className="flex flex-col items-center mt-5 px-5 ">
              <h1 className="text-2xl font-black text-green-500">Motivate Absence</h1>
              <h2 className="text-sm mb-5">Motivate absence for {selectedStudent.name}?</h2>
              <div className="flex flex-col items-center">
                <h1 className="font-bold">Details</h1>
                <ul>
                  <li>Date: {new Date(motivateAbsenceDialog[1].created_at).toLocaleString("en-US", {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour12: false,
                                      })}
                  </li>
                  <li>Subject: {motivateAbsenceDialog[2]}</li>
                </ul>
              </div>
              <div className="flex flex-col items-center mt-4">
                <span>Enter a reason:</span>
                <input
                       type="text"
                       value={motivateReasonInput}
                       onChange={(e) => setMotivateReasonInput(e.target.value)}
                       placeholder="Reason for excusing"
                       className="rounded-md  wtext-green-500 bg-[#1e1e1e] border border-green-500 p-2 w-full focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50 placeholder-green-400 transition"
                   />

              </div>

              <button className="px-4 py-2 bg-green-500 text-white font-bold text-md rounded-lg mt-4"
              onClick={() => handleMotivateAbsence(motivateAbsenceDialog[1], motivateReasonInput )}
              >Motivate</button>

              </div>
            </motion.div>
              )}

            </motion.div>
          )}


        {excuseModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 flex flex-row gap-10"
            initial={{ backdropFilter: "blur(0px)", opacity: 0, x: 0 }}
            animate={{
              backdropFilter: "blur(10px)",
              opacity: 1,
              x: motivateAbsenceDialog[0] ? "-20" : "0",
            }}
            exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gray-800 text-white p-8 rounded-lg shadow-xl max-w-lg w-full"
              layout
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
            >
              <h2 className="text-2xl font-semibold text-green-500">{selectedStudent.name}</h2>
              <h3 className="mt-4 text-xl font-semibold text-green-500">Excuse Absences</h3>
              <h2 className="font-medium text-gray-500">
                {data.absences.filter(
                  (absence) =>
                    absence.student_id === selectedStudent.student_id &&
                    absence.status === "EXCUSED"
                ).length}{" "}
                Motivated /{" "}
                {data.absences.filter(
                  (absence) =>
                    absence.student_id === selectedStudent.student_id &&
                    absence.status === "PENDING"
                ).length}{" "}
                Not Motivated
              </h2>
              <h2 className="font-medium text-sm text-gray-500">
                Set a period to excuse this student, along with a reason.
              </h2>

              <div className="mt-4">
                <label htmlFor="reason" className="text-sm font-medium text-gray-400">
                  Reason:
                </label>
                <textarea
                  id="reason"
                  className="w-full mt-2 p-2 bg-gray-700 text-white rounded-md"
                  placeholder="Enter reason for excusing absences"
                  rows={3}
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                />
              </div>

              <div className="mt-4 flex gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="text-sm font-medium text-gray-400"
                  >
                    Start Date:
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="w-full mt-2 p-2 bg-gray-700 text-white rounded-md"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="text-sm font-medium text-gray-400">
                    End Date:
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="w-full mt-2 p-2 bg-gray-700 text-white rounded-md"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4 items-center mt-6">
              <button
                onClick={() => {
                  excuseAbsences(selectedStudent.student_id, startDate, endDate, reasonInput);
                  setExcuseModal(false);
                  setSelectedStudent();
                }}
                className=" px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-500 transition"
              >
                Submit
              </button>

              <button
                onClick={() => {
                  setExcuseModal(false);
                  setStartDate();
                  setEndDate();
                  setReasonInput('Not specified');
                  setSelectedStudent();
                }}
                className=" px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition"
              >
                Close
              </button>
              </div>
            </motion.div>
          </motion.div>
        )}



        </AnimatePresence>

      </div>
      <AnimatePresence>
  {activeNotification && (activeNotification[0] == 'green' ? (
    <motion.div
      className="fixed right-5 bottom-5 max-w-[400px] bg-green-500 rounded-xl"
      initial={{ opacity: '0%' }}
      animate={{ opacity: '100%' }}
      exit={{ opacity: '0%' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="w-full flex flex-col p-4">
        <h1 className="font-bold text-md">{activeNotification[1]}</h1>
        <span className="font-semibold">{activeNotification[2]}</span>
      </div>
      <motion.div
        className="h-[10px] w-full bg-green-600 rounded-bl-xl"
        initial={{ width: '0%' }}
        animate={{ width: '95%' }}
        transition={{ duration: 6, ease: 'easeInOut' }}
      >
        &nbsp;
      </motion.div>
    </motion.div>
  ) : (
    <motion.div
      className="fixed right-5 bottom-5 max-w-[400px] bg-red-500 rounded-xl"
      initial={{ opacity: '0%' }}
      animate={{ opacity: '100%' }}
      exit={{ opacity: '0%' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="w-full flex flex-col p-4">
        <h1 className="font-bold text-md">{activeNotification[1]}</h1>
        <span className="font-semibold">{activeNotification[2]}</span>
      </div>
      <motion.div
        className="h-[10px] w-full bg-red-600 rounded-bl-xl"
        initial={{ width: '0%' }}
        animate={{ width: '95%' }}
        transition={{ duration: 6, ease: 'easeInOut' }}
      >
        &nbsp;
      </motion.div>
    </motion.div>
  ))}
</AnimatePresence>

      
      
    </div>
  );
};

export default TeacherDashboard;
