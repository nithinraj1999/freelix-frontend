import FreelancerNavbar from "../../components/freelancer/FreelancerNavbar";
import Sidebar from "../../components/freelancer/SideBar";
import YourBid from "../../components/freelancer/bid/yourBid";

import React from 'react'

const MyBids = () => {
  return (
    <>
    <FreelancerNavbar/>
    <div className='flex'>
    <Sidebar/>
    <YourBid/>
    </div>
    
    </>
  )
}

export default MyBids
