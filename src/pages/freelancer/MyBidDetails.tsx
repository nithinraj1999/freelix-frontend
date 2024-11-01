import FreelancerNavbar from "../../components/freelancer/FreelancerNavbar";
import Sidebar from "../../components/freelancer/SideBar";
import YourBidDetails from "../../components/freelancer/bid/YourBidDetails";

const MyBidsDetails = () => {
  return (
    <>
    <FreelancerNavbar/>
    <div className='flex'>
    <Sidebar/>
    <YourBidDetails/>
    </div>
    
    </>
  )
}

export default MyBidsDetails
