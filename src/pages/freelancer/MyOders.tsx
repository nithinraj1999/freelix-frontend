import React from 'react';

import FreelancerNavbar from '../../components/freelancer/FreelancerNavbar';
import OrderList from '../../components/freelancer/orders/OrderList';
import Sidebar from '../../components/freelancer/SideBar';
const MyOrders = () => {

  return (
    
  <>
  <FreelancerNavbar/>
  <div className='flex'>
    <Sidebar/>
    <OrderList/>
    </div>
  </>
  );
};

export default MyOrders;
