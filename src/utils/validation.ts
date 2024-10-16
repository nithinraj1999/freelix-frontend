export const signupValidation = (
    name: string,
    email: string,
    password: string,
    phoneNumber: number
  ): { isValid: boolean; validationErrors: Record<string, string> } => {
      
    let isValid = true;
    const validationErrors: Record<string, string> = {};
  
    // Name validation
    if (!name || !name.trim()) {
      validationErrors.name = 'Name is required';
      isValid = false;
    } else if (name.trim() !== name) {
      validationErrors.name = 'Name cannot start or end with whitespace';
      isValid = false;
    } else if (!/^[a-zA-Z ]+$/.test(name.trim())) {
      validationErrors.name = 'Name should only contain letters and spaces';
      isValid = false;
    }
  
    // Email validation
    if (!email || !email.trim()) {
      validationErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      validationErrors.email = 'Email is invalid';
      isValid = false;
    } else if (email !== email.trim()) {
      validationErrors.email = 'Email cannot start or end with whitespace';
      isValid = false;
    }
  
    // Phone number validation
    const phoneStr = phoneNumber.toString(); // Convert number to string for trimming and regex validation
    if (!phoneStr || !phoneStr.trim()) {
      validationErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (phoneStr.trim() !== phoneStr) {
      validationErrors.phoneNumber = 'Phone number cannot start or end with whitespace';
      isValid = false;
    } else if (!/^\d{10}$/.test(phoneStr.trim())) {
      validationErrors.phoneNumber = 'Phone number should be 10 digits';
      isValid = false;
    }
  
    // Password validation
    if (!password || !password.trim()) {
      validationErrors.password = 'Password is required';
      isValid = false;
    } else if (password.trim() !== password) {
      validationErrors.password = 'Password cannot start or end with whitespace';
      isValid = false;
    }
  
    return { isValid, validationErrors };
  };
   