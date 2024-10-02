import Modal from "./ModalComponent";
import { useState } from "react";
import { registerUser } from "../api/user/authUser";
import { signupValidation } from "../utils/validation";
import { useNavigate } from "react-router-dom";

const SignupComponent: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({}); // For storing validation errors
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // Start loading
      setLoading(true);

      const { isValid, validationErrors } = signupValidation(
        name,
        email,
        password,
        parseInt(phoneNumber)
      );

      if (!isValid) {
        setErrors(validationErrors);
        setLoading(false); // Stop loading if validation fails
        return;
      }

      // If validation passes, proceed with registration
      const data = {
        name,
        email,
        password,
        phone: parseInt(phoneNumber), // Convert back to number
      };

      const response = await registerUser(data);
      const userID = response.userID;
      
      
      // Stop loading after success
      setLoading(false);

      // Navigate to verification page
      navigate(`/verification?id=${userID}`);
    } catch (error) {
      console.error(error);
      setLoading(false); // Stop loading in case of an error
    }
  };

  const handleClickOnSignin = ()=>{
    navigate('/login')
  }
  return (
    <>
      <Modal title="Sign Up" image="https://res.cloudinary.com/dhir9n7dj/image/upload/v1726150553/steptodown.com774020_my7gko.jpg">
        <div>
          <div>
            <div className="py-4 px-5 flex items-center">
              {/* <span className="text-sm cursor-pointer">Back</span> */}
            </div>
          </div>
          <div className="px-5 py-2 space-y-4">
            <div>
              <h1 className="font-medium">Name</h1>
              <input
                type="text"
                value={name}
                className="border-2 w-full h-10 font-medium rounded-md px-3"
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name}</span>
              )}{" "}
            </div>

            <div>
              <h1 className="font-medium">Email</h1>
              <input
                type="email"
                value={email}
                className="border-2 w-full h-10 font-medium rounded-md px-3"
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email}</span>
              )}{" "}
            </div>

            <div>
              <h1 className="font-medium">Password</h1>
              <input
                type="password"
                value={password}
                className="border-2 w-full h-10 font-medium rounded-md px-3"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password}</span>
              )}{" "}
            </div>

            <div>
              <h1 className="font-medium">Phone Number</h1>
              <input
                type="tel"
                value={phoneNumber}
                className="border-2 w-full h-10 font-medium rounded-md px-3"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {errors.phoneNumber && (
                <span className="text-red-500">{errors.phoneNumber}</span>
              )}{" "}
            </div>

            {/* Show loading spinner or button */}
            {loading ? (
              <div className="flex justify-center">
                {/* You can use any loading spinner here */}
                <div className="loader" />
                <p>Loading...</p>
              </div>
            ) : (
              <button
                className="border-2 w-full h-10 font-medium rounded-md"
                onClick={handleRegister}
                disabled={loading} // Disable button during loading
              >
                Continue
              </button>
              
            )}
            <h1>Already have account?<span className="underline cursor-pointer" onClick={handleClickOnSignin}>sign in</span></h1>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SignupComponent;
