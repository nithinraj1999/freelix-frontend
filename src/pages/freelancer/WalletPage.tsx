import React from 'react'
import FreelancerNavbar from '../../components/freelancer/FreelancerNavbar'
import Sidebar from '../../components/freelancer/SideBar'
import Wallet from '../../components/freelancer/wallet/wallet'
const WalletPage = () => {
  return (
    <>
    <FreelancerNavbar/>
    <div className='flex'>
    <Sidebar/>
    <Wallet/>
    </div>
    
    </>
  )
}

export default WalletPage
