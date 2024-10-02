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

  return (
    <>
      <Navbar />
      <HeroComponent width="w-full" height="h-[450px]" color="bg-brand-color">
        <div className="mt-24 ml-20">
          <h1 className="text-white text-4xl font-bold">
            Instantly connect with
          </h1>
          <h1 className="text-white text-4xl font-bold">The ideal freelance</h1>
          <h1 className="text-white text-4xl font-bold">service for you</h1>
          <input placeholder="search services" className="h-10" />
          <button className="bg-black mt-10 h-10 text-white w-14">
            Search
          </button>
        </div>
      </HeroComponent>
      <HeroComponent width="w-full" height="h-[450px]">
        <div className="flex flex-col justify-center items-center w-full h-[150px] bg-green-600">
          <h2 className="text-2xl text-white font-semibold mb-4">
            Find the perfect freelancer for your project
          </h2>
          <button className="bg-black text-white py-3 px-6 rounded-lg transition duration-300">
            Post a Job
          </button>
        </div>
      </HeroComponent>
    </>
  );
};

export default UserLandingPage;
