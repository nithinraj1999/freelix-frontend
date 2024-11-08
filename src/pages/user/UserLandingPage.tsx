import React from "react";
import Navbar from "../../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HeroComponent from "../../components/HeroComponent";
import { userLogout } from "../../state/slices/userSlice";

const UserLandingPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    
    
    if (!user) {
      navigate("/");
    } else if (user.isBlock) {
      dispatch(userLogout());
      navigate("/");
    }
  }, [user, navigate, dispatch]);


  const postJob = ()=>{
    navigate("/post-a-job")
  }
  return (
    // <>
    //   <Navbar />
    //   <div className='flex justify-center'>
    //   <div className="justify-center mt-10 w-full h-[450px] bg-brand-color">
        
    //     <div className="mt-24 ml-20">
    //       <h1 className="text-white text-4xl font-bold">
    //         Instantly connect with
    //       </h1>
    //       <h1 className="text-white text-4xl font-bold">The ideal freelance</h1>
    //       <h1 className="text-white text-4xl font-bold">service for you</h1>
    //       <input placeholder="search services" className="h-10 w-[300px] px-4" />
    //       <button className="bg-black mt-10 h-10 text-white w-20">
    //         Search
    //       </button>
    //     </div>
      
    //   </div>
    // </div>
     
    //   <div className='flex justify-center'>
    //   <div className="h-[450px] w-full justify-center mt-10 ">
    //   <div className="flex flex-col justify-center items-center w-full h-[150px] bg-green-600">
    //       <h2 className="text-2xl text-white font-semibold mb-4">
    //         Find the perfect freelancer for your project
    //       </h2>
    //       <button className="bg-black text-white py-3 px-6 rounded-lg transition duration-300" onClick={postJob}>
    //         Post a Job
    //       </button>
    //     </div>
    //   </div>
    // </div>
    //   <div className="bg-black w-full h-[500px]">

    //   </div>
    // </>
    <>
  <Navbar />

  {/* Hero Section */}
  <div className="flex justify-center">
    <div className="w-full h-[450px] bg-brand-color flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-4xl font-bold mb-4">Instantly connect with</h1>
        <h1 className="text-white text-4xl font-bold">The ideal freelance service for you</h1>
        
        <div className="mt-8 flex justify-center items-center gap-4">
          <input
            placeholder="Search services"
            className="h-10 w-[300px] px-4 rounded-md outline-none"
          />
          <button className="bg-black h-10 text-white px-6 rounded-md">
            Search
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Call to Action Section */}
  <div className="flex justify-center ">
    <div className="w-full h-[150px] bg-green-600 flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl text-white font-semibold mb-4">
        Find the perfect freelancer for your project
      </h2>
      <button
        className="bg-black text-white py-3 px-6 rounded-lg transition duration-300 hover:bg-gray-800"
        onClick={postJob}
      >
        Post a Job
      </button>
    </div>
  </div>

  {/* Placeholder Section */}
  <div className="bg-black w-full h-[500px] flex items-center justify-center relative">
  <img
    src="https://res.cloudinary.com/dhir9n7dj/image/upload/v1730803155/business-8458541_1280_uxw50s.jpg" // replace with the actual image path or URL
    alt="Professional woman connecting with freelancers"
    className="w-full h-full object-cover opacity-60"
  />
  <div className="absolute text-center text-white">
    <h2 className="text-3xl font-bold mb-2">Empowering Your Projects</h2>
    <p className="text-lg">Connect with skilled freelancers to bring your vision to life.</p>
  </div>
</div>

</>

  );
};

export default UserLandingPage;
