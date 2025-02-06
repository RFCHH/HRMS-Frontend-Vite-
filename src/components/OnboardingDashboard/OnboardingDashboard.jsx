import React from 'react'
import { useNavigate } from 'react-router-dom'

function OnboardingDashboard() {
    const Navigate = useNavigate()
    const handleLogOut =() => {
        Navigate('/')
    }
    const handlePersonalDetails =() => {
      Navigate('/')
    }
  return (
    <>
    <div>OnboardingDashboard</div>
   <button className='bg-blue-600 border border-blue-600 p-2' onClick={handleLogOut}>LogOut</button>
   <button className='bg-blue-600 border border-blue-600 p-2' onClick={handlePersonalDetails}>PersonalDetails</button>
    </>
    
  )
}

export default OnboardingDashboard