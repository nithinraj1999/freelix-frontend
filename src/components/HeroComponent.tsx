
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
        
        
       {children}
      </div>
    </div>
  )
}

export default HeroComponent;
