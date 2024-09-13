// Modal.tsx
import React,{useEffect} from 'react';
import { MdClose } from 'react-icons/md';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }
  
  const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {


    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
  
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, [isOpen]);
  
    if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[55%] h-[600px] bg-white rounded-xl z-40 overflow-hidden">

        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <MdClose className="text-slate-300 w-8 h-8 cursor-pointer" onClick={onClose} aria-label="Close Modal" />
        </div>

        {/* Modal Body */}
        <div className="flex h-full">
          <div className="w-[50%] h-full overflow-hidden relative">
            <img
              className="object-cover w-full h-full"
              src="https://res.cloudinary.com/dhir9n7dj/image/upload/v1726150553/steptodown.com774020_my7gko.jpg"
              alt="Fiverr"
            />
            {/* <div className="absolute inset-0 bg-blue-500 opacity-70"></div> */}
          </div>
          <div className="w-[50%] h-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
