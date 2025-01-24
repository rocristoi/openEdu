import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import apiUrl from './config';
import { lineWobble } from 'ldrs'
import { useNavigate } from "react-router";
import * as XLSX from 'xlsx';
import uploadSVG from "./assets/upload.svg"
import anim1 from './assets/anim1.webm';
import Classes from './assets/Classes.webm';
import Students from './assets/Students.webm';
import Subjects from './assets/Subjects.webm';
import Teacher from './assets/Teacher.webm';
import AdminDashboard from './AdminDashboard';
import DashNavbar from './DashNavbar';


import './Dashboard.css'
import TeacherDashboard from './TeacherDashboard';
import StudentDashboard from './StudentDashboard';


const SetupScreen = ({number, displayName, changeCurrentStep}) => {
  const [schoolName, setSchoolName] = useState('');
  const [teachers, setTeachers] = useState({});
  const [classes, setClasses] = useState({});
  const [className, setClassName] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [feedback, setFeedback] = useState('')
  const [students, setStudents] = useState({});
  const [studentFeedback, setStudentFeedback] = useState([false, 'Waiting file upload'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState([false,"This process takes some time, please be patient!"])

  const navigate = useNavigate(); 

  const handleSendData = async () => {
    setLoading(true);
    let finalData = {
      schoolName,
      teachers,
      classes,
      students
    }

    try {
      const idToken = await  auth.currentUser.getIdToken(true);
        const response = await axios.post(`${apiUrl}/newSchool`, finalData, {
        headers: { 
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json', 
        },
      });
      if (response.status >= 200 && response.status < 300) {
        setLoading(false);
        window.location.reload();
      } else {
          setError([true, "There seems to be a problem with the server. Please contact the website owner."]);
      }

    } catch (err) {
      setError([true, "There seems to be a problem with the server. Please contact the website owner."]);
    } finally {
      setLoading(false);
    }

  }

  const handleInputChange = (e) => {
    updateSchoolName(e.target.value)
  }
  
  const nextStep = () => {
    changeCurrentStep(number + 1)
    console.log(teachers)
  }
  
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const parsedTeachers = {};
        for (let i = 2; i < rows.length; i++) {
          const [name, email, subjects] = rows[i];
          if (name && email && subjects) {
            let processedSubjects = subjects.split(',') 
            parsedTeachers[name] = {
              email,
              processedSubjects
            };
          }
        }
        setTeachers(parsedTeachers);
      };
      
      reader.readAsArrayBuffer(file);
    }
  };


  const checkStudentInput = (studentsData) => {
    let canContinue = true;
  
    Object.entries(studentsData).forEach(([name, details]) => {
      if (!(details.clasa in classes)) {
        setStudentFeedback([false, `Class ${details.clasa} from the student ${name} isn't in the classes list!`]);
        canContinue = false;
      }
    });
  
    if (canContinue) {
      setStudentFeedback([true, `No errors. Found ${Object.keys(studentsData).length} students.`]);
    }
  };
  
  const handleStudentsFileUpload = (file) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
        const expectedHeaders = ["Student's Name", "Student's Email", "Class"];
        const fileHeaders = rows[1]; 
  
        if (!fileHeaders || fileHeaders.length < expectedHeaders.length || 
          !expectedHeaders.every((header, index) => fileHeaders[index] === header)) {
          setStudentFeedback([false, `Invalid file format. Please ensure you're using the correct file!`]);
          return;
        }
  
        const parsedStudents = {};
        for (let i = 2; i < rows.length; i++) { 
          const [name, email, clasa] = rows[i];
          if (name && email && clasa) {
            parsedStudents[name] = {
                email,
                clasa
            };
          }
        }
  
        setStudents(parsedStudents);
        checkStudentInput(parsedStudents); 
      };
  
      reader.readAsArrayBuffer(file);
      document.getElementById('studentInput').value = ''; // Replace with your file input ID

    }
  };
  

  const handleStudentDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
  
    const file = event.dataTransfer.files[0];
  
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      handleStudentsFileUpload(file);
    } else {
      alert('Please drop a valid Excel file (.xlsx)');
    }
}

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
  
    const file = event.dataTransfer.files[0];
  
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      handleFileUpload(file);
    } else {
      alert('Please drop a valid Excel file (.xlsx)');
    }
  };





  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      handleFileUpload(file);
    } else {
      alert('Please drop a valid Excel file (.xlsx)');
    }
  };

  
  const handleStudentFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      handleStudentsFileUpload(file);
    } else {
      alert('Please drop a valid Excel file (.xlsx)');
    }
  };

  const handleAddClassClick = () => {
        if(className == '' || selectedTeacher == '') {
            setFeedback(`Please complete the ${className == '' ? 'Class Name' : 'Head Teacher'} field`)
            setTimeout(() => {
                setFeedback('');
            }, 2000);
            return
        };
        if( className in classes) {
            setFeedback(`Class ${className} already exists!`)
            setTimeout(() => {
                setFeedback('');
            }, 2000);
            return
        }

        setClasses((prevClasses) => ({
            ...prevClasses,
            [className]: selectedTeacher,
        }));
        
        
        setFeedback(`Added class ${className} & assigned ${selectedTeacher} as the head teacher.`)
        setClassName('');
        setSelectedTeacher('')
        setTimeout(() => {
            setFeedback('');
        }, 2000);
  }


  switch (number) {
    case 1:
      return(
        <motion.div className='bg-[#121212] w-[90%] h-[90%] rounded-xl relative '
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
           <div className='w-full h-12 flex flex-row gap-5 items-center justify-center'>
               <div className='flex flex-col items-center'>
                   <div className='rounded-full bg-green-500 h-1 w-40'></div>
                   <span className='text-xs mt-1 font-bold'>School Setup</span>
                   </div>
                   <div className='flex flex-col items-center'>
                   <div className='rounded-full bg-gray-800 h-1 w-40'></div>
                   <span className='text-xs mt-1 font-bold'>Teachers Setup</span>
                   </div>
                   <div className='flex flex-col items-center'>
                   <div className='rounded-full bg-gray-800 h-1 w-40'></div>
                   <span className='text-xs mt-1 font-bold'>Classes Setup</span>
                   </div>
                   <div className='flex flex-col items-center'>
                   <div className='rounded-full bg-gray-800 h-1 w-40'></div>
                   <span className='text-xs mt-1 font-bold'>Students Setup</span>
                   </div>
           </div>
   
   
       <div className="flex flex-row py-12 px-20 ">
   
           <div className="w-4/5 flex flex-col relative">
               <h1 className="text-4xl font-medium tracking-tight">Welcome, {displayName || 'User'}</h1>
               <p className="mt-2 text-gray-300 leading-6">
                   Seems like it's your first time here. We'll walk you through the initial setup.
               </p>
               <div className="w-1/2">
                   <p className="mt-4 text-gray-300 leading-6">
                       This process takes some time, so please read everything carefully before proceeding, since{" "}
                       <span className="text-green-500 font-semibold">it cannot be altered later.</span> Each administrator will have a maximum of{" "}
                       <span className="text-green-500 font-semibold">one school</span> assigned to their account.
                   </p>
               </div>
               <p className="mt-6 text-gray-300 font-medium">Please make sure you've done the following:</p>
               <div className="w-1/2 flex flex-col">
                   <p className="mt-4 text-gray-300">✅ You've read the{" "}
                       <span
                           className="text-green-500 cursor-pointer underline hover:text-green-400 transition"
                           onClick={() => navigate('/terms')}
                       >
                           terms and conditions
                       </span>
                   </p>
                   <p className="mt-4 text-gray-300">✅ You've read the{" "}
                       <span
                           className="text-green-500 cursor-pointer underline hover:text-green-400 transition"
                           onClick={() => navigate('/privacy')}
                       >
                           privacy policy
                       </span>
                   </p>
                   <p className="mt-4 text-gray-300">✅ You have at least{" "}
                       <span
                           className="text-green-500 cursor-pointer hover:text-green-400 transition"
                       >
                           30 minutes
                       </span>
                   </p>
               </div>
   
               <div className="mt-10 flex flex-col">
                   <h1 className="text-2xl font-bold text-gray-100">First things first</h1>
                   <span className="mt-2 text-gray-300">What's the name of your school?</span>
                   <input
                       type="text"
                       value={schoolName}
                       onChange={(e) => setSchoolName(e.target.value)}
                       placeholder="School Name"
                       className="rounded-xl mt-4 text-green-500 bg-[#1e1e1e] border border-green-500 p-2 w-64 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50 placeholder-green-400 transition"
                   />
               </div>
   
   
           </div>
           <div className="w-1/5">
                       <video
                           autoPlay
                           loop
                           muted
                           playsInline
                           className="transparent-video "
                       >
                           <source src={anim1} type="video/webm" />
                           Your browser does not support the video tag.
                       </video>
           </div>
           </div>
            {schoolName == '' ? (
            <button
                className="absolute bottom-12 left-20 bg-gray-500 text-black font-bold px-6 py-2 rounded-lg shadow-md  hover:shadow-lg cursor-not-allowed"
            >
                Proceed
            </button>
            ) : (
                <button
                onClick={ nextStep}
                className="absolute bottom-12 left-20 bg-green-500 text-black font-bold px-6 py-2 rounded-lg shadow-md hover:bg-green-400 hover:shadow-lg transition"
            >
                Proceed
            </button>
            )}



       </motion.div>
      )
    case 2:
      return(
        <motion.div className='bg-[#121212] w-[90%] h-[90%] rounded-xl relative '
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
           <div className='w-full h-12 flex flex-row gap-5 items-center justify-center'>
               <div className='flex flex-col items-center'>
                   <div className='rounded-full bg-green-500 h-1 w-40'></div>
                   <span className='text-xs mt-1 font-bold'>School Setup</span>
                   </div>
                   <div className='flex flex-col items-center'>
                   <div className='rounded-full bg-gray-800 h-1 w-40'>
                      <motion.div className='h-full w-full bg-green-500'
                      initial={{width: '0%'}}
                      animate={{width: '100%'}}
                      transition={{duration: 1.5, ease: 'easeInOut'}}
                      ></motion.div>
                   </div>
                   <span className='text-xs mt-1 font-bold'>Teachers Setup</span>
                   </div>
                   <div className='flex flex-col items-center'>
                   <div className='rounded-full bg-gray-800 h-1 w-40'></div>
                   <span className='text-xs mt-1 font-bold'>Classes Setup</span>
                   </div>
                   <div className='flex flex-col items-center'>
                   <div className='rounded-full bg-gray-800 h-1 w-40'></div>
                   <span className='text-xs mt-1 font-bold'>Students Setup</span>
                   </div>
           </div>
   
   
       <motion.div className="flex flex-row py-12 px-20"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1, transition: { duration: 1 } }}
               exit={{ opacity: 0, transition: { duration: 1 } }}
       >
   
           <div className="w-4/5 flex flex-col relative">
               <h1 className="text-4xl font-medium tracking-tight">Who teaches?</h1>
               <p className="mt-2 text-gray-300 leading-6">
                   Let's set up your teachers. We've made a video to make it easier to understand.
               </p>
               <iframe className='rounded-xl mt-5' width="560" height="315" src="https://www.youtube.com/embed/kYuVkmTwg6M?si=Wmgtl60rSI54lejN" ></iframe>
               <div className='flex flex-row gap-4 mt-10'>
               <a href="/Teachers Setup for OpenEDU.xlsx" download>
               <button className='hover:bg-green-600  transition bg-green-500 rounded-xl border text-xlg  border-green-500 text-black font-bold  w-60 h-24 '>
                
                Download File</button></a>
                <div className='flex flex-col items-center gap-2'>
                         <div
                        className={`flex flex-col items-center justify-center w-60 h-24 border-2 ${
                            isDragging ? 'border-green-500' : 'border-gray-500'
                        } bg-black rounded-xl cursor-pointer`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        >

                       <img src={uploadSVG} alt="upload" className='w-7 h-7 '/>
                        <p className="text-green-500 font-bold">Drop file here</p>
                        </div>

                    <div>
                    <label className=" text-gray-300 font-bold cursor-pointer">
                            Or click here to upload
                            <input
                            type="file"
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={handleFileSelect}
                            />
                        </label>
                              </div>
        </div>





               </div>
           </div>
           <div className="w-1/5">
                       <video
                           autoPlay
                           loop
                           muted
                           playsInline
                           className="transparent-video "
                       >
                           <source src={Teacher} type="video/webm" />
                           Your browser does not support the video tag.
                       </video>
           </div>
           {Object.keys(teachers).length > 0 ? (
                <button
                onClick={nextStep}
                className="absolute bottom-12 left-20 bg-green-500 text-black font-bold px-6 py-2 rounded-lg shadow-md hover:bg-green-400 hover:shadow-lg transition"
            >
                Proceed
            </button>
           ) : (
            <button
            className="absolute cursor-not-allowed bottom-12 left-20 bg-gray-500 text-black font-bold px-6 py-2 rounded-lg shadow-md "
        >
            Proceed
        </button>
           )}

           </motion.div>
       </motion.div>
      )
    case 3:
        return(

          <motion.div className='bg-[#121212] w-[90%] h-[90%] rounded-xl relative '
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          key={number}
          >

             <div className='w-full h-12 flex flex-row gap-5 items-center justify-center'>
                 <div className='flex flex-col items-center'>
                     <div className='rounded-full bg-green-500 h-1 w-40'></div>
                     <span className='text-xs mt-1 font-bold'>School Setup</span>
                     </div>
                     <div className='flex flex-col items-center'>
                     <div className='rounded-full bg-green-500 h-1 w-40'>
                     </div>
                     <span className='text-xs mt-1 font-bold'>Teachers Setup</span>
                     </div>
                     <div className='flex flex-col items-center'>
                     <div className='rounded-full bg-gray-800 h-1 w-40'>
                     <motion.div className='h-full w-full bg-green-500'
                            initial={{width: '0%'}}
                            animate={{width: '100%'}}
                            transition={{duration: 1.5, ease: 'easeInOut'}}
                            ></motion.div>
                     </div>
                     <span className='text-xs mt-1 font-bold'>Classes Setup</span>
                     </div>
                     <div className='flex flex-col items-center'>
                     <div className='rounded-full bg-gray-800 h-1 w-40'></div>
                     <span className='text-xs mt-1 font-bold'>Students Setup</span>
                     </div>
             </div>
     
     
         <motion.div className="flex flex-row py-12 px-20"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1, transition: { duration: 1 } }}
                 exit={{ opacity: 0, transition: { duration: 1 } }}
         >
     
             <div className="w-4/5 flex flex-col relative">
                 <h1 className="text-4xl font-medium tracking-tight">About your classes</h1>
                 <p className="mt-2 text-gray-300 leading-6">
                     Let's set up your classes. It is mandatory that each class has a Head Teacher.
                 </p>
                 <p className='text-gray-300 leading-6'>From here, we can conclude that you currently can not have more than <span className='text-green-500 font-semibold'>{Object.keys(teachers).length} classes</span> in your school.</p>
                 <div className="w-1/2">
                     <p className="mt-4 text-gray-300 leading-6">
                         To add a class, simply complete the fields below, choosing your desired Class Name and Head Teacher.
                     </p>
                 </div>
                <div className='flex flex-row gap-8 mt-10 items-center '>
                    <div className='flex flex-col items-center justify-center gap-1'>
                        <span className='text-sm'>Class Name</span>
                <input
                       type="text"
                       value={className}
                       onChange={(e) => setClassName(e.target.value)}
                       placeholder="Class"
                       className="rounded-xl placeholder-white  text-green-500 bg-[#1e1e1e] border border-green-500 h-10 p-2 w-27 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50 placeholder-green-400 transition"
                   />
                   </div>
                   <div className='flex flex-col items-center justify-center gap-1'>
                   <span className='text-sm'>Head Teacher</span>

                                <select
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                className="bg-[#1e1e1e] rounded-xl text-sm h-10 w-40 focus:outline-none px-2 border border-green-500"
                                >
                                <option value={selectedTeacher}>Select a Teacher</option>
                                {Object.keys(teachers).map((teacher, index) => (
                                    <option key={index} value={teacher}>
                                    {teacher}
                                    </option>
                                ))}
                                </select>
                                </div>
                    
                    <button className='bg-green-500 p-5 h-10 rounded-xl mt-6 flex items-center justify-center font-bold'
                    onClick={handleAddClassClick}
                    >
                        Add
                    </button>
                </div>
                <span className='mt-2 text-green-500 text-sm'>{feedback}</span>
     
     
             </div>
             <div className="w-1/5">
                         <video
                             autoPlay
                             loop
                             muted
                             playsInline
                             className="transparent-video "
                         >
                             <source src={Classes} type="video/webm" />
                             Your browser does not support the video tag.
                         </video>
             </div>
             {Object.keys(classes).length > 0 ? (
                        <button
                        onClick={nextStep}
                        className="absolute bottom-12 left-20 bg-green-500 text-black font-bold px-6 py-2 rounded-lg shadow-md hover:bg-green-400 hover:shadow-lg transition"
                    >
                        Proceed
                    </button>
                ) : (
                    <button
                    className="absolute cursor-not-allowed bottom-12 left-20 bg-gray-500 text-black font-bold px-6 py-2 rounded-lg shadow-md "
                >
                    Proceed
                </button>
                )}
             </motion.div>
         </motion.div>
      )
    case 4:
        return(
            <motion.div className='bg-[#121212] w-[90%] h-[90%] rounded-xl relative '
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            key={number}

            >
               <div className='w-full h-12 flex flex-row gap-5 items-center justify-center'>
                   <div className='flex flex-col items-center'>
                       <div className='rounded-full bg-green-500 h-1 w-40'></div>
                       <span className='text-xs mt-1 font-bold'>School Setup</span>
                       </div>
                       <div className='flex flex-col items-center'>
                       <div className='rounded-full bg-green-500 h-1 w-40'>
                       </div>
                       <span className='text-xs mt-1 font-bold'>Teachers Setup</span>
                       </div>
                       <div className='flex flex-col items-center'>
                       <div className='rounded-full bg-green-500 h-1 w-40'>
                       </div>
                       <span className='text-xs mt-1 font-bold'>Classes Setup</span>
                       </div>
                       <div className='flex flex-col items-center'>
                       <div className='rounded-full bg-gray-800 h-1 w-40'>
                       <motion.div className='h-full w-full bg-green-500'
                          initial={{width: '0%'}}
                          animate={{width: '100%'}}
                          transition={{duration: 1.5, ease: 'easeInOut'}}
                          ></motion.div>
                       </div>
                       <span className='text-xs mt-1 font-bold'>Students Setup</span>
                       </div>
               </div>
       
       
               <motion.div className="flex flex-row py-12 px-20"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1, transition: { duration: 1 } }}
               exit={{ opacity: 0, transition: { duration: 1 } }}
       >
   
           <div className="w-4/5 flex flex-col relative">
               <h1 className="text-4xl font-medium tracking-tight">Who learns?</h1>
               <p className="mt-2 text-gray-300 leading-6">
                   Let's set up your students. The process is simillar to the teachers one.
               </p>
               <p className="mt-2 text-gray-300 leading-6">
                Download the excel file below and edit it. For each student, you will <br />have to set up their <span className='text-green-500'>name, email</span> and <span className='text-green-500'>class</span>.
                Any error with your file <br />will be noted below. Please make sure to use the same class names <br />you used in the previous step.
               </p>

               <p className="mt-2 text-gray-300 leading-6">
                This is the last step, after this, your school will enter the <span className='text-green-500'>creation process</span> <br />
                This means that you won't be able to change settings for this school  <br /> anymore (so make sure you've completed all informations correctly) <br />
               </p>
               <span className='mt-2 text-md font-semibold text-green-500'>{studentFeedback[1]}</span>

               <div className='flex flex-row gap-4 mt-10'>
               <a href="/Students Setup for OpenEDU.xlsx" download>
               <button className='hover:bg-green-600  transition bg-green-500 rounded-xl border text-xlg  border-green-500 text-black font-bold  w-60 h-24 '>
                
                Download File</button></a>
                <div className='flex flex-col items-center gap-2'>
                         <div
                        className={`flex flex-col items-center justify-center w-60 h-24 border-2 ${
                            isDragging ? 'border-green-500' : 'border-gray-500'
                        } bg-black rounded-xl cursor-pointer`}
                        onDrop={handleStudentDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        >

                       <img src={uploadSVG} alt="upload" className='w-7 h-7 '/>
                        <p className="text-green-500 font-bold">Drop file here</p>
                        </div>

                    <div>
                    <label className=" text-gray-300 font-bold cursor-pointer">
                            Or click here to upload
                            <input
                            type="file"
                            accept=".xlsx, .xls"
                            className="hidden"
                            id='studentInput'
                            onChange={handleStudentFileSelect}
                            />
                        </label>
                              </div>
                              
        </div>




               </div>
           </div>
           <div className="w-1/5">
                       <video
                           autoPlay
                           loop
                           muted
                           playsInline
                           className="transparent-video "
                       >
                           <source src={Students} type="video/webm" />
                           Your browser does not support the video tag.
                       </video>
           </div>
           {studentFeedback[0] ? (
                <button
                onClick={nextStep}
                className="absolute bottom-12 left-20 bg-green-500 text-black font-bold px-6 py-2 rounded-lg shadow-md hover:bg-green-400 hover:shadow-lg transition"
            >
                Proceed
            </button>
           ) : (
            <button
            className="absolute cursor-not-allowed bottom-12 left-20 bg-gray-500 text-black font-bold px-6 py-2 rounded-lg shadow-md "
        >
            Proceed
        </button>
           )}

           </motion.div>
           </motion.div>
    )
    case 5:
      return(
          <motion.div className='bg-[#121212] w-[90%] h-[90%] rounded-xl relative '
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          key={number}

          >
             <div className='w-full h-12 flex flex-row gap-5 items-center justify-center'>
                 <div className='flex flex-col items-center'>
                     <div className='rounded-full bg-green-500 h-1 w-40'></div>
                     <span className='text-xs mt-1 font-bold'>School Setup</span>
                     </div>
                     <div className='flex flex-col items-center'>
                     <div className='rounded-full bg-green-500 h-1 w-40'>
                     </div>
                     <span className='text-xs mt-1 font-bold'>Teachers Setup</span>
                     </div>
                     <div className='flex flex-col items-center'>
                     <div className='rounded-full bg-green-500 h-1 w-40'>
                     </div>
                     <span className='text-xs mt-1 font-bold'>Classes Setup</span>
                     </div>
                     <div className='flex flex-col items-center'>
                     <div className='rounded-full bg-green-500 h-1 w-40'>
                     </div>
                     <span className='text-xs mt-1 font-bold'>Students Setup</span>
                     </div>
             </div>
     
     
             <motion.div className="flex flex-row py-12 px-20"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1, transition: { duration: 1 } }}
             exit={{ opacity: 0, transition: { duration: 1 } }}
     >
 
         <div className="w-4/5 flex flex-col relative">
             <h1 className="text-4xl font-medium tracking-tight">Are you sure?</h1>
             <p className="mt-2 text-gray-300 leading-6">
                 This will create the School. This action can't be reverted.
             </p>
               <div className="w-1/2 flex flex-col mb-2">
                   <p className="mt-4 text-gray-300">✅ You've created {" "}
                       <span
                           className="text-green-500 cursor-pointer underline hover:text-green-400 transition"
                       >
                           {Object.keys(classes).length} class(es)
                       </span>
                   </p>
                   <p className="mt-4 text-gray-300">✅ You've added{" "}
                       <span
                           className="text-green-500 cursor-pointer underline hover:text-green-400 transition"
                       >
                           {Object.keys(teachers).length} teacher(s)
                       </span>
                   </p>
                   <p className="mt-4 text-gray-300">✅ You set up{" "}
                       <span
                           className="text-green-500 cursor-pointer underline hover:text-green-400 transition"
                       >
                           {Object.keys(students).length} student(s)
                       </span>
                   </p>
               </div>
               <p className="mt-2 text-gray-300 leading-6">
              By clicking 'Proceed' you agree to allow us to store <span className='text-green-500'>students' and teachers' data</span> <br />and send emails to them in order to set up their accounts. Please ensure <br /> all provided information is accurate and adheres to our data policies.
                </p>
              <span className='text-gray-500 mt-2'>{error[1]}</span>
                          
         </div>
         <div className="w-1/5">
                     <video
                         autoPlay
                         loop
                         muted
                         playsInline
                         className="transparent-video "
                     >
                         <source src={Subjects} type="video/webm" />
                         Your browser does not support the video tag.
                     </video>
         </div>
         {loading ? (
          <button
          onClick={handleSendData}
          className="absolute bottom-12 left-20 bg-gray-500 text-black font-bold px-6 py-2 rounded-lg shadow-md hover:bg-green-400 hover:shadow-lg transition"
      >
        Loading
        </button>
         ) : (
          <button
          onClick={handleSendData}
          className="absolute bottom-12 left-20 bg-green-500 text-black font-bold px-6 py-2 rounded-lg shadow-md hover:bg-green-400 hover:shadow-lg transition"
      >
        Proceed
        </button>
         )}


         </motion.div>
         </motion.div>
  )       
  }
}


const Dashboard = () => {
  lineWobble.register()
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedRole, setFetchedRole] = useState(null);
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState({});
  const [userDashboard, setUserDahboard] = useState(false);

  const handleOpenUserDashboard = () => setUserDahboard(true);
  const handleCloseUserDashboard = () => setUserDahboard(false);
  const [displayName, setDisplayName] = useState(user?.displayName);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await auth.currentUser.reload();
        setDisplayName(auth.currentUser.displayName);
      } catch (err) {
        console.error(err);
      }
    };
  
    if (user) {
      fetchUserData();
    }
  }, [user]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const idToken = await auth.currentUser.getIdToken(true);
        const response = await axios.get(`${apiUrl}/userInfo`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        
        setFetchedRole(response.data.message);
        setData(response.data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch timetable data');
      } finally {
        await auth.currentUser.reload();
        setLoading(false);
      }
    };
  
    let interval;
    if (user) {
      fetchData();
      interval = setInterval(() => {
        fetchData();
      }, 10000); 
    }
  
    return () => {
      if (interval) {
        clearInterval(interval); 
      }
    };
  }, [user]); 



  return (
<div className="h-screen w-screen flex flex-col ">
  <AnimatePresence>
    {loading && (
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-opacity-100 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
      >
       <l-line-wobble
            size="80"
            stroke="5"
            bg-opacity="0.1"
            speed="1.75" 
            color="#00bf62" 
            ></l-line-wobble>
      </motion.div>
    )}
  </AnimatePresence>
  
  <AnimatePresence>

  {!loading && (
  fetchedRole === 'newAdmin' ? (
<div className="h-screen w-screen flex items-center justify-center">

<AnimatePresence mode="wait">

    <SetupScreen
      number={currentStep}
      displayName={displayName}
      changeCurrentStep = {(step) => setCurrentStep(step)}
      />
</AnimatePresence>
</div>


  ) : fetchedRole === 'Admin' ? (
    <div className=" flex flex-col">
      <DashNavbar user={user} onAccountClick={handleOpenUserDashboard} type='Admin'/>
      <AdminDashboard data={data} user={user} userDashboard={userDashboard} handleCloseUserDashboard={handleCloseUserDashboard}/>
    </div>
  ) : fetchedRole === 'Student' ? (
    <div className=" flex flex-col overflow-x-hidden">
        <DashNavbar user={user} onAccountClick={handleOpenUserDashboard} type='Student'/>
        <StudentDashboard data={data} user={user} userDashboard={userDashboard} handleCloseUserDashboard={handleCloseUserDashboard} />
    </div>
  ) : fetchedRole === 'Teacher' ? (
    <div className=" flex flex-col">
        <DashNavbar user={user} onAccountClick={handleOpenUserDashboard} type='Teacher'/>
        <TeacherDashboard data={data} user={user} userDashboard={userDashboard} handleCloseUserDashboard={handleCloseUserDashboard} />
    </div>
  ) : (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
    <span className='text-3xl font-bold text-red-500'>#OE400</span>
    <div className='flex flex-row items-center gap-2'>
    <span className='text-xl'>This is an error</span>
    <div className='h-full w-1 bg-gray-600 '></div>
    <span className='text-xl'>Contact the <a href='mailto:cristi@cristoi.ro'className='underline text-green-500'>OpenEdu team.</a></span>

    </div>
  </div>
  )
)}
  </AnimatePresence>

  
</div>
  );
};

export default Dashboard;
