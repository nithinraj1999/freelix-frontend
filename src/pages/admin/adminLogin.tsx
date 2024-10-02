import { useState,useEffect } from "react";
import Modal from "../../components/ModalComponent";
import { loginAdmin } from "../../api/admin/authAdmin";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../../state/slices/adminSlice";
import { RootState } from "../../state/store";
function AdminLogin() {

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

const navigate = useNavigate()


const dispatch= useDispatch()
const { admin } = useSelector((state: RootState) => state.admin);

const handleLogin = async()=>{
  const data = {
    email,
    password
  }
  const response = await loginAdmin(data)

  if (response && response.success && response.admin) {
    dispatch(adminLogin(response.admin));  
    navigate('/admin',{ replace: true }); 
  } else {
    navigate('/admin/login'); 
  }
}


  return (
    <>
      <Modal title="" image="https://res.cloudinary.com/dhir9n7dj/image/upload/v1726150296/steptodown.com958314_mlej2a.jpg">
        <div>
            
          <div className="py-4 px-5 flex items-center">
            {/* <span className="text-sm cursor-pointer">Back</span> */}
            <div>
                <h1 className="text-2xl ">Admin Login</h1>
            </div>
          </div>
          

          <div className="px-5 py-5 space-y-3.5">
            <h1>Email</h1>
            <input
              type="text"
              className="border-2 w-full h-10 font-medium rounded-md px-2"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <h1>Password</h1>
            <input
              type="password"
              className="border-2 w-full h-10 font-medium rounded-md px-2"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            
            <button className="w-full h-10 font-white bg-black text-white" onClick={handleLogin}>
              login
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default AdminLogin;
