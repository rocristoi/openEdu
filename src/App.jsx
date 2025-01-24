import { BrowserRouter, Route, Routes } from 'react-router'
import Landing from './Landing'
import Navbar from './Navbar'
import Footer from './Footer'
import Register from './Register'
import Login from './Login'
import Dashboard from './Dashboard'
import { PrivateRoute } from './hoc/PrivateRoute'


const App = () => {

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <div className={` w-full h-full `}>
              <div className='bg-black '>
            <Navbar/>
            <Landing/>
             </div>
             <div className='bg-black shadow outline outline-green-500'>
             <Footer />
             </div>
            </div>
            }/>
            <Route path="/register" element={
            <div>
              <Register />
            </div>
            }/>
            <Route path="/login" element={
            <div>
              <Login />
            </div>
            }/>
            <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div className='bg-black'>
                <Dashboard />
                </div>
              </PrivateRoute>
            }
          />
           <Route path="/terms" element={
          <div className="bg-black min-h-screen p-6 flex flex-col items-center">
              <div className="max-w-4xl w-full bg-gray-800 shadow-lg rounded-lg p-8">
                <h1 className="text-3xl font-bold text-blue-500 text-center mb-4">Terms and Conditions</h1>
                <p className="text-sm text-gray-400 text-center mb-6">
                  Last Updated: January 21, 2025
                </p>
                <section className="mb-6 ">
              <h2 className="text-xl font-semibold text-green-500 mb-2">Introduction</h2>
              <p className="text-white leading-relaxed">
                Welcome to <strong>openEdu</strong>. By using our web app, you agree to comply with these Terms and Conditions. Please read them carefully. As of the date of these terms, this application has been developed solely by a single individual. 
                <span className="text-green-500"> We are fully committed to aligning with European and Romanian data protection regulations to safeguard your rights and data.</span>
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-green-500 mb-2">Data Collection and Use</h2>
              <p className="text-white leading-relaxed">
                We collect and store user-created data (such as Names and Emails), user-added data (such as Grades and Absences added to users) account details, passwords, and other relevant data to improve user experience and functionality. 
                <span className="text-green-500"> All data is handled in compliance with the General Data Protection Regulation (GDPR) and Romanian data protection laws.</span> 
                &nbsp; You retain full rights to access, update, or delete your data at any time by contacting us directly.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-green-500 mb-2">User Responsibilities</h2>
              <p className="text-white leading-relaxed">
                Users are responsible for maintaining the security of their accounts and passwords. It is strictly prohibited to share sensitive account information with others. 
                <span className="text-green-500"> Additionally, any illegal access, modification, or misuse of this platform or its data is prohibited and discouraged. </span> 
                This application has built-in unintended access detection capabilities, clearly demonstrated in the open-source code. These measures ensure unauthorized activities are easily detected.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-green-500 mb-2">Disclaimer</h2>
              <p className="text-white leading-relaxed">
                openEdu is provided on an "as-is" basis, without guarantees of any kind. We are not liable for any losses or damages resulting from the use or misuse of our services. 
                <span className="text-green-500"> Please note: as the sole developer of this platform, there may be unforeseen bugs. While we take every precaution to ensure data safety, users are advised to avoid uploading sensitive information until this disclaimer is removed.</span>
              </p>
            </section>

            <footer className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                If you have any questions or concerns, feel free to reach out to the developer at <a href="mailto:cristi@cristoi.ro" className="text-blue-500 underline">cristi@cristoi.ro</a>.
              </p>
            </footer>

              </div>
            </div>
                
                } />

        <Route path="/privacy" element={
         <div className="bg-black min-h-screen p-6 flex flex-col items-center">
         <div className="max-w-4xl w-full bg-gray-800 shadow-lg rounded-lg p-8">
           <h1 className="text-3xl font-bold text-blue-500 text-center mb-4">Privacy Policy</h1>
           <p className="text-sm text-gray-400 text-center mb-6">
             Last Updated: January 21, 2025
           </p>
       
           <section className="mb-6">
  <h2 className="text-xl font-semibold text-blue-500 mb-2">Introduction</h2>
  <p className="text-white leading-relaxed">
    At <strong>openEdu</strong>, we prioritize your privacy and comply with the General Data Protection Regulation (GDPR) and Romanian data protection laws. 
    <span className="text-green-500">This Privacy Policy outlines how we collect, use, and protect your data, ensuring transparency in all aspects.</span> 
    By using our platform, you agree to these terms. openEdu is designed to serve as a digital classbook where teachers can add grades, absences, and other data that can be accessed by students.
  </p>
</section>

<section className="mb-6">
  <h2 className="text-xl font-semibold text-blue-500 mb-2">Data Collection</h2>
  <p className="text-white leading-relaxed">
    We collect and store the following information:
  </p>
  <ul className="list-disc list-inside text-white leading-relaxed">
    <li><span className="text-green-500">Teacher-added data</span> such as grades, absences, and class notes</li>
    <li>Student names, email addresses, and profile details</li>
    <li>Password information (encrypted)</li>
    <li>Authentication tokens for secure access</li>
  </ul>
  <p className="mt-2 text-white leading-relaxed">
    <span className="text-green-500">Firebase Authentication</span> is used to securely manage user sign-ins.
  </p>
</section>

<section className="mb-6">
  <h2 className="text-xl font-semibold text-blue-500 mb-2">Data Usage</h2>
  <p className="text-white leading-relaxed">
    Collected data is used exclusively for:
  </p>
  <ul className="list-disc list-inside text-white leading-relaxed">
    <li><span className="text-green-500">Providing core functionalities</span> such as digital gradebooks and attendance tracking</li>
    <li>Maintaining and improving the platform's performance</li>
    <li>Ensuring the security and integrity of user accounts</li>
  </ul>
</section>

<section className="mb-6">
  <h2 className="text-xl font-semibold text-blue-500 mb-2">Data Protection</h2>
  <p className="text-white leading-relaxed">
    We are committed to safeguarding your information through:
  </p>
  <ul className="list-disc list-inside text-white leading-relaxed">
    <li><span className="text-green-500">Encryption</span> of sensitive data, such as passwords and personal information</li>
    <li>Access control mechanisms to prevent unauthorized access</li>
    <li>Regular security updates and system patches</li>
  </ul>
</section>

<section className="mb-6">
  <h2 className="text-xl font-semibold text-blue-500 mb-2">User Rights</h2>
  <p className="text-white leading-relaxed">
    As per GDPR, users have the following rights:
  </p>
  <ul className="list-disc list-inside text-white leading-relaxed">
    <li><span className="text-green-500">Access their personal data</span> recorded on the platform</li>
    <li><span className="text-green-500">Request corrections or deletions</span> of inaccurate data</li>
    <li><span className="text-green-500">Withdraw consent</span> for data processing</li>
    <li><span className="text-green-500">Lodge a complaint</span> with your local data protection authority</li>
  </ul>
  <p className="mt-2 text-white leading-relaxed">
    To exercise these rights, contact us at <a href="mailto:cristi@cristoi.ro" className="text-blue-500 underline">cristi@cristoi.ro</a>.
  </p>
</section>

<section className="mb-6">
  <h2 className="text-xl font-semibold text-blue-500 mb-2">Cookies and Tracking</h2>
  <p className="text-white leading-relaxed">
    <span className="text-green-500">openEdu uses essential cookies</span> for maintaining session functionality and ensuring a secure experience. We do not use tracking or advertising cookies.
  </p>
</section>

<section className="mb-6">
  <h2 className="text-xl font-semibold text-blue-500 mb-2">Open-Source Commitment</h2>
  <p className="text-white leading-relaxed">
    This application is open-source, and the code is publicly available on GitHub. 
    <span className="text-green-500">We believe in full transparency and invite you to view our codebase</span> for insights into how your data is handled. Visit the repository <a href="https://github.com/rocristoi/openEdu" className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">here</a>.
  </p>
</section>

<footer className="text-center mt-6">
  <p className="text-gray-400 text-sm">
    For questions or concerns, reach out at <a href="mailto:cristi@cristoi.ro" className="text-blue-500 underline">cristi@cristoi.ro</a>.
  </p>
</footer>

         </div>
       </div>
       
                
                } />
        </Routes>
      </BrowserRouter>
  )
}

export default App
