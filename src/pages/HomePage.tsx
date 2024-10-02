import Navbar from "../components/Navbar"
import { useEffect } from "react";
import HeroComponent from "../components/HeroComponent"
import CategoryListComponent from "../components/CategoryListComponent";
import { useNavigate } from "react-router-dom";
import {useSelector } from "react-redux";
import { RootState } from "../state/store";
function HomePage() {
  
  
const navigate = useNavigate()

const { user } = useSelector((state: RootState) => state.user);


useEffect(() => {
  if (user) {
    navigate("/home");
  }
}, [navigate, user]);

  return (
    <>
      <Navbar />
      <HeroComponent  radius='rounded-3xl' width="w-11/12" height="h-[450px]" color="bg-brand-color">
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

      <HeroComponent radius="rounded-none" width="w-11/12" height="min-h"  children={<CategoryListComponent/>} />
      {/* <HeroComponent radius="rounded-none" width="w-full" height="h-[450px]" color="bg-brand-color"  /> */}
    </>
  )
}

export default HomePage;
