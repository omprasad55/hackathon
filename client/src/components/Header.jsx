import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import { AppContent } from '../context/AppContext'



const Header = () => {

      const { userData } = useContext(AppContent)
    const { isLoggedin } = useContext(AppContent);

      
    

    const handleGetStarted = () => {


    if (isLoggedin) {
      navigate('/eligibility-form'); 
    } else {
      navigate('/login');
    }
  };

    const navigate = useNavigate()

    

    return (
        <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
            <img src={assets.header_img} alt=""
                className='w-30 h-38 mb-6' />

            <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name :'Friend'} 
                <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
            </h1>

            <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>
                Welcome to MediSetu
            </h2>

            <p className='mb-8 max-w-md'>
                Let's start with a quick tour and we will find nearby lowcost or government medical cares for you!
            </p>

            <button  onClick={handleGetStarted}
            className='border corder-grey-500 rounded-full px-8 py-2.5 hover:bg-gray-100 cursor-pointer transition-all'>
                Get Started
            </button>

            <div className='bg-slate-100 p-8 m-10 rounded-lg shadow-lg w-150 text-sm mb-6'>
                <h2 className='text-2xl font-semibold text-center mb-4'>What is MediSetu ?</h2>
                <p className='text-center mb-6 text-1xl'>
                    MediSetu is a compassionate and user-friendly website designed to bridge the gap between underprivileged individuals and quality medical care. It helps users—especially those from economically weaker sections—find the best possible healthcare services that suit their financial capabilities. By collecting basic information such as age, gender, location, income level, and medical needs, MediSetu intelligently matches users with government schemes, charitable hospitals, and affordable treatment options tailored to their situation. The platform also provides detailed information on scheme eligibility, benefits, and required documentation, making it easier for users to access support. With a mission to ensure that no one is denied medical help due to financial constraints, MediSetu stands as a reliable digital gateway to accessible healthcare.
                </p>
            </div>


             <div className='bg-slate-100 p-8 m-10 rounded-lg shadow-lg w-150 text-sm mb-6'>
                <h2 className='text-2xl font-semibold text-center mb-4'>Why chose MediSetu ?</h2>
                <p className='text-center mb-6 text-1xl'>
                    MediSetu stands out as a vital platform for those who struggle to afford proper medical care. Unlike generic healthcare websites, MediSetu is built with a purpose—to serve the financially underprivileged by connecting them with the most suitable and affordable healthcare services and government schemes. It offers a simple and accessible interface, making it easy for anyone to use regardless of education or technical skills. With intelligent matching based on user-provided details such as income, location, and medical needs, MediSetu ensures personalized recommendations for treatment options, nearby charitable hospitals, and eligible health schemes. Most importantly, it saves time, reduces confusion, and gives hope to those who may otherwise be unaware of the support available to them. Choosing MediSetu means choosing care, dignity, and a healthier future—regardless of financial status.                </p>
            </div>  
        
        </div>
    )
}

export default Header
