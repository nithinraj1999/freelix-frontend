import { z } from "zod";

export const signupValidation = (
    name: string,
    email: string,
    password: string,
    confirmPassword:string,
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
    } else if (password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    if (!confirmPassword || !confirmPassword.trim()) {
      validationErrors.confirmPassword = 'confirmPassword is required';
      isValid = false;
    } else if (confirmPassword.trim() !== confirmPassword) {
      validationErrors.confirmPassword = 'confirmPassword cannot start or end with whitespace';
      isValid = false;
    }
  
    return { isValid, validationErrors };
  };
   


 //----bid validation schema

// Helper to check for leading/trailing whitespace
const noLeadingOrTrailingWhitespace = z
  .string()
  .refine((val) => val.trim() === val, { message: "No leading or trailing whitespace" });

// Bid validation schema

export const bidSchema = z.object({
  bidAmount: z
  .string()
  .min(1, { message: "Bid amount is required" })
  .refine((val) => /^\S/.test(val), { message: "Bid amount cannot start with a space" })
  .refine((val) => val.trim().length > 0, { message: "Bid amount cannot be blank" })
  .refine((val) => {
    const numberValue = parseFloat(val);
    return !isNaN(numberValue) && numberValue > 0;
  }, { message: "Bid amount must be a positive number" }),
  
  deliveryDays: z
  .string()
  .min(1, { message: "Delivery days is required" })
  .refine((val) => /^\S/.test(val), { message: "Delivery days cannot start with a space" })
  .refine((val) => val.trim().length > 0, { message: "Delivery days cannot be blank" })
  .refine((val) => {
    const numberValue = parseFloat(val);
    return !isNaN(numberValue) && numberValue > 0;
  }, { message: "Delivery days must be a positive number" }),

  proposal: z
    .string()
    .min(1, { message: "Proposal is required" })
    .refine((val) => /^\S/.test(val), { message: "Proposal cannot start with a space" })
    .refine((val) => val.trim().length > 0, { message: "Proposal cannot be only blank spaces" }),
});




export const editBidSchema = z.object({
  bidAmount: z
    .string()
    .optional()
    .refine((val) => val !== undefined, { message: "Bid amount is required" })
    .refine((val) => /^\S/.test(val ?? ""), { message: "Bid amount cannot start with a space" })
    .refine((val) => val?.trim().length > 0, { message: "Bid amount cannot be blank" })
    .refine((val) => {
      const numberValue = parseFloat(val ?? "");
      return !isNaN(numberValue) && numberValue > 0;
    }, { message: "Bid amount must be a positive number" }),
  
  deliveryDays: z
    .string()
    .optional()
    .refine((val) => val !== undefined, { message: "Delivery days is required" })
    .refine((val) => /^\S/.test(val ?? ""), { message: "Delivery days cannot start with a space" })
    .refine((val) => val?.trim().length > 0, { message: "Delivery days cannot be blank" })
    .refine((val) => {
      const numberValue = parseFloat(val ?? "");
      return !isNaN(numberValue) && numberValue > 0;
    }, { message: "Delivery days must be a positive number" }),
  
  proposal: z
    .string()
    .optional()
    .refine((val) => val !== undefined, { message: "Proposal is required" })
    .refine((val) => /^\S/.test(val ?? ""), { message: "Proposal cannot start with a space" })
    .refine((val) => val?.trim().length > 0, { message: "Proposal cannot be only blank spaces" }),
});



