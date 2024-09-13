import Navbar from "../components/Navbar"
import HeroComponent from "../components/HeroComponent"
import CategoryListComponent from "../components/CategoryListComponent";
function HomePage() {
  return (
    <>
      <Navbar />
      <HeroComponent  radius='rounded-3xl' width="w-11/12" height="h-[450px]" color="bg-brand-color"/>
      <HeroComponent radius="rounded-none" width="w-11/12" height="min-h"  children={<CategoryListComponent/>} />
      <HeroComponent radius="rounded-none" width="w-full" height="h-[450px]" color="bg-brand-color"  />


    </>
  )
}

export default HomePage;
