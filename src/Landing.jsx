import SectionWrapper from "./hoc/SectionWrapper"
import { styles } from "./styles"
import { useState, useEffect } from "react";
import UnderlineText from "./UnderlineText";
import landingVid from "./assets/OELanding.webm"
import Number from "./Number";
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from 'three';
import arrow from "./assets/arrow.svg"

const StepCard = ({number, title, subtitle, isMobile = false}) => {
  return (
    <div className="flex flex-col items-center ">
      {!isMobile && (
        <>
        <Canvas gl={{ toneMapping: THREE.NoToneMapping }}>
        <OrthographicCamera makeDefault zoom={20} position={[0.3, -1, 5]} />

        <ambientLight intensity={0} /> 
        <directionalLight intensity={0} /> 
        <spotLight intensity={0} /> 
        
        <Number number={number} />
        </Canvas>
        <h1 className="text-3xl font-black text-green-500">{title}</h1>
        <div className="w-[310px] mt-2">
        <span className="font-medium ">{subtitle}</span>
        </div>
        </>
      )}
      {isMobile && (
                <>
                <Canvas gl={{ toneMapping: THREE.NoToneMapping }}>
                <OrthographicCamera makeDefault zoom={15} position={[0.3, -1, 5]} />
        
                <ambientLight intensity={0} /> 
                <directionalLight intensity={0} /> 
                <spotLight intensity={0} /> 
                
                <Number number={number} />
                </Canvas>
                <h1 className="text-2xl font-black text-green-500">{title}</h1>
                <div className="w-[310px] mt-2">
                <span className="font-medium text-sm ">{subtitle}</span>
                </div>
                </>
      )}
     
    </div>
  )

}

const Landing = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

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

   
    return(
    <div>
        <div className="flex flex-col items-center justify-center text-center ">
        <span className={`bg-green-500 bg-clip-text hidden lg:block text-transparent lg:mt-0 mt-10 leading-10 ${styles.heroHeadText}`}>Get your <UnderlineText text="free" /> classbook</span>
        <span className={`bg-green-500 block lg:hidden bg-clip-text text-transparent lg:mt-0 mt-10 leading-10 ${styles.heroHeadText}`}>Get your free classbook</span>

        <span className={`${styles.heroSubText} lg:px-24 px-10 text-white mt-4`}>Open Edu is a free tool for creating classbooks tailored to Central and Eastern Europe's education system.</span>
        <div className="lg:mt-0 lg:mb-0 mt-20 mb-40">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="transparent-video"
                    onLoadedData={() => setVideoLoaded(true)}
                    onError={() => setVideoLoaded(false)}
                >
                    <source src={landingVid} type="video/webm" />
                    Your browser does not support the video tag.
                </video>
                {!videoLoaded && (
                    <div className="flex items-center justify-center w-full h-[700px] bg-black">
                      &nbsp;
                    </div>
                )}
            </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
        <span className={`text-green-500  ${styles.heroHeadText}`}>How it works?</span>

        {!isMobile && (
           <>
           <div className="mt-20 mb-20 flex flex-row gap-10 justify-center items-start">
          <StepCard number="1" title="Create an account" subtitle="Don't worry - it's fast, easy and secure. Simply sign up with your email and set a secure password. Once your account is created, you'll be guided through the initial setup process."/>
          <img src={arrow} alt="Arrow" className="mt-6" />
          <StepCard number="2" title="Set up your school" subtitle="Once you've created an account, you'll need to configure your school, which includes setting up teachers, students, classes, and other essential details. We'll take care of account creation for everyone."/>
          <img src={arrow} alt="Arrow" className="mt-6" />
          <StepCard number="3" title="Done!" subtitle="Once everything is set up, launch the classbook! We'll send out emails to all users with their login credentials for accessing the classbook. Each student will now be able to view their grades in the new digital classbook."/>

           </div>
           </>
            
        )}

      
        {isMobile && (
          <>
          <div className="flex flex-col mt-20 gap-10">
          <StepCard number="1" title="Create an account" subtitle="Don't worry - it's fast, easy and secure. Simply sign up with your email and set a secure password. Once your account is created, you'll be guided through the initial setup process." isMobile='true'/>
          <StepCard number="2" title="Set up your school" subtitle="Once you've created an account, you'll need to configure your school, which includes setting up teachers, students, classes, and other essential details. We'll take care of account creation for everyone."  isMobile='true'/>
          <StepCard number="3" title="Done" subtitle="Once everything is set up, launch the classbook! We'll send out emails to all users with their login credentials for accessing the classbook. Each student will now be able to view their grades in the new digital classbook."  isMobile='true'/>


          </div>
          </>
        )}
        
                </div>   
    </div>
    )
}

export default SectionWrapper(Landing, "landing")