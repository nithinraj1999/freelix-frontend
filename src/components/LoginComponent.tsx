import { useState, useEffect } from "react";
import Modal from "./ModalComponent";
import { loginUser } from "../api/user/authUser";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../state/slices/userSlice";
import { RootState } from "../state/store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [navigate, user]);

  const handleLogin = async () => {
    const data = {
      email,
      password,
    };

    const response = await loginUser(data);

    if (response && response.success && response.user) {
      dispatch(userLogin(response.user));
      navigate("/home");
    } else {
      console.error(response);
      toast.error("Incorrect email or password", {
        position: "top-right", // Use the string directly
      });
    }
  };
  const handleClickOnsignup = async () => {
    navigate("/signup");
  };

  const forgetPassword = async () => {
    navigate("/forgot-password");
  };

  const successlogin =async (credentialResponse:any) => {
    const details = jwtDecode(credentialResponse.credential);
    console.log(details);
    console.log(credentialResponse);
  }
  

  return (
    <>
      <Modal
        title="Sign In"
        image="https://res.cloudinary.com/dhir9n7dj/image/upload/v1726150553/steptodown.com774020_my7gko.jpg"
      >
        <div>
          <div className="py-4 px-5 flex items-center">
            {/* <span className="text-sm cursor-pointer">Back</span> */}
          </div>
          <h1 className="text-2xl px-5 font-bold">
            {/* Continue with Email or Username */}
            Continue with Email
          </h1>

          <div className="px-5 py-5 space-y-3.5">
            <h1>Email or username</h1>
            <input
              type="text"
              className="border-2 w-full h-10 font-medium rounded-md px-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <h1>Password</h1>
            <input
              type="password"
              className="border-2 w-full h-10 font-medium rounded-md px-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <h1
              className="text-right underline cursor-pointer"
              onClick={forgetPassword}
            >
              Forgot password?
            </h1>
            <button
              className="w-full h-10 font-white bg-black text-white"
              onClick={handleLogin}
            >
              login
            </button>
            
            <GoogleLogin
             onSuccess={successlogin}
             onError={() => {
               console.log("Login Failed");
             }}
           />
            <h1>
              Dont have an account?{" "}
              <span
                className="underline cursor-pointer"
                onClick={handleClickOnsignup}
              >
                signup
              </span>{" "}
            </h1>
           
          </div>
          
        </div>
      </Modal>
      <ToastContainer />
      
    </>
  );
}

export default LoginComponent;
