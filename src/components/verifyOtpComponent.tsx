import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "./ModalComponent";
import { verifyOTP } from "../api/user/authUser";
import { resendOTP } from "../api/user/authUser";
import { useLocation } from 'react-router-dom';

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [showResend, setShowResend] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(120); 
  const [resendTrigger, setResendTrigger] = useState<boolean>(false); // NEW STATE FOR RESEND TRIGGER
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); 

  const navigate = useNavigate()

  const location = useLocation();

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input field if the entered value is valid
    if (value && !isNaN(Number(value)) && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Move back to the previous input field if the input is empty
    if (value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join(""); 
    // const userID = new URLSearchParams(window.location.search).get('id'); 
    const {email } = location.state 

    const data = {
      otp: otpValue,
      email: email
    };

    const response = await verifyOTP(data);
    console.log("res...",response);
    
    if(response.success){
      
      navigate('/login', { state: { showSignupSuccess: true } });

    } else {
      toast.error('Wrong OTP, please try again!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      console.log("resend otp");
      const {email } = location.state 
      const data = { email };
      const response = await resendOTP(data);
  
  
      if (response) {
        // Reset timer and trigger resend action
        setTimer(120); 
        setShowResend(false);
        setResendTrigger(!resendTrigger); // CHANGE THIS TO TRIGGER TIMER RESET
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error("Error in resending OTP:", error);
    }
  };

  //  Update the timer every second
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      setShowResend(true);
    }
  }, [timer, resendTrigger]); // DEPEND ON BOTH TIMER AND RESEND TRIGGER

  // Format the timer display (MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <Modal title="Verify OTP" image="https://res.cloudinary.com/dhir9n7dj/image/upload/v1726150553/steptodown.com774020_my7gko.jpg">
        {/* OTP Inputs */}
        <div>
          <p>Please check the email sent to you</p>
        </div>
        <div className="flex justify-center space-x-4 px-5 py-10">
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)} // Assign ref to each input
              className="border-2 w-12 h-12 text-center text-xl rounded-md"
              maxLength={1}
              type="text"
              value={value}
              onChange={(e) => handleOtpChange(e.target.value, index)} // Update OTP on change
            />
          ))}
        </div>
        {/* Timer */}
        <div className="text-center text-sm text-gray-500 mb-4">
          {timer > 0 ? (
            <p>Resend OTP available in: {formatTime(timer)}</p>
          ) : (
            <p>Time expired</p>
          )}
        </div>
        <div className="text-center">
          <button className="w-full bg-black h-10 text-white" onClick={handleVerify}>
            Verify
          </button>
          {/* Resend OTP Link */}
          {showResend && (
            <div className="mt-4">
              <span className="text-blue-500 cursor-pointer" onClick={handleResendOtp}>
                Resend OTP
              </span>
            </div>
          )}
        </div>
        <ToastContainer />
      </Modal>
    </>
  );
};

export default VerifyOtp;
