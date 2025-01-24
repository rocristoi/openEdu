import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import navLogo from './assets/logo_small.png';
import { MdOutlineAccountCircle } from "react-icons/md";

const DashNavbar = ({user, onAccountClick, type}) => {
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



      if(isMobile) {
        return (
          <motion.nav className={"transition-all w-full flex flex-row justify-center items-center items-center h-24 fixed top-0 z-50 px-10"}
          style={{
            backgroundColor:  'rgb(0, 0, 0)', 
          }}
          >
              <div className='flex flex-row items-center justify-between w-[1200px]'>
          <div className="flex flex-row items-center">
              <img
              src={navLogo}
              alt="logo"
              className="w-20 h-20 object-contain"
              />

          </div>
                      <div className='flex flex-row gap-4'>
                      <div className="text-blue-500 flex flex-row justify-center items-center gap-10 ">
          

                      </div>
                      <div className="text-amber-50 flex flex-row justify-center items-center gap-10 ">
                          <span className='font-bold  text-right leading-4 text-[15px]'
                          onClick={onAccountClick}
                          ><MdOutlineAccountCircle color='#48BB78' className='w-7 h-7'/></span>

                      </div>
                      </div>
                      </div>
                      </motion.nav>
        )
      } else {
        return (
          <motion.nav className={"transition-all w-full flex flex-row justify-center items-center items-center h-24 fixed top-0 z-50"}
          style={{
            backgroundColor:  'rgb(0, 0, 0)', 
          }}
          >
              <div className='flex flex-row items-center justify-between w-[1400px]'>
          <div className="flex flex-row items-center gap-4">
              <img
              src={navLogo}
              alt="logo"
              className="w-20 h-20 object-contain"
              />

          </div>
                      <div className='flex flex-row gap-4'>
                      <div className="text-green-500 flex flex-row justify-center items-center gap-10 ">
          <div
            className="text-center text-right"
          >
            {type == 'Admin' ? (<h1 className="text-xl font-bold text-green-500">OpenEdu Admin Dashboard</h1>) : type == 'Teacher' ? (<h1 className="text-xl font-bold text-green-500">OpenEdu Teacher Dashboard</h1>) : (<h1 className="text-xl font-bold text-green-500">OpenEdu Student Dashboard</h1>) }
            <p className="text-md  text-gray-400">An intuitive way to manage school data</p>
          </div>
          <motion.div className='flex flex-col items-center cursor-pointer text-xs'
          initial={{scale: 1}}
          whileHover={{scale: 1.04}}
          whileTap={{scale: 0.97}}
          onClick={onAccountClick}
          >
          <MdOutlineAccountCircle color='#48BB78' className='w-7 h-7'/>
          <span className='font-black'>{user.displayName}</span>
          </motion.div>


                      </div>

                      </div>
                      </div>
                      </motion.nav>


)
      }
 
}

export default DashNavbar;