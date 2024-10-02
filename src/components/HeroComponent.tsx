
//  interface for the props
interface HeroComponentProps {
  radius?: string; //  string prop for border radius
  width?:string;
  height?:string;
  color?:string;
  children?: React.ReactNode; // Accepting children prop for nested components

}

function HeroComponent({ radius,width,height,color,children }: HeroComponentProps) {
  return (
    <div className='flex justify-center'>
      <div className={`${height} ${color} ${width} justify-center mt-10 ${radius}`}>
        {/* <div className="mt-24 ml-20">
        <h1 className="text-white text-3xl font-bold">Instantly connect with</h1>
        <h1 className="text-white text-3xl font-bold">The ideal freelance</h1>
        <h1 className="text-white text-3xl font-bold">service for you</h1>
        <input placeholder="search services "/>
        <button className="bg-black mt-10">Search</button>
        </div> */}
        
       {children}
      </div>
    </div>
  )
}

export default HeroComponent;
