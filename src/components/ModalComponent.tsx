
// export default Modal;
import React from "react";

interface ContainerProps {
  title: string;
  children: React.ReactNode;
  image:string

}

const Modal: React.FC<ContainerProps> = ({ title, children,image }) => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-[55%] h-[600px] bg-white rounded-xl overflow-hidden mx-auto my-10">
        {/* Container Content */}
        <div className="flex h-full">
          <div className="w-[50%] h-full overflow-hidden relative">
            <img
              className="object-cover w-full h-full"
              src={image}
              alt="Fiverr"
            />
          </div>
          <div className="w-[50%] h-full overflow-hidden">
            {/* Title */}
            <div className="p-2 ">
              <h2 className="text-lg font-bold px-5">{title}</h2>
            </div>

            {/* Content */}
            <div className="p-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
