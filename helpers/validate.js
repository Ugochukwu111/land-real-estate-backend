import validator from "validator";

/**
 * @function validateRegisterUserFields
 * @description Acts as a strict gatekeeper for the user registration flow. It validates 
 * the structural integrity and business rules of the incoming payload (email formatting, 
 * phone number length/prefix, password strength, etc.) before any database operations occur.
 * * @relation This helper is tightly coupled with the `registerUser` controller. 
 * It expects the controller to extract and pre-format the fields (e.g., using .trim() 
 * and .toLowerCase()) BEFORE passing them in as arguments.
 * * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object (used to instantly dispatch 400 errors).
 * @param {string} email - The pre-formatted user email string.
 * @param {string} password - The raw user password string.
 * @param {string} phoneNumber - The pre-formatted Nigerian phone number (must start with '234').
 * @param {boolean} termsAndCondition - Boolean indicating if the user accepted the T&Cs.
 * * @returns {boolean | Object} Returns strictly `true` if all validations pass. 
 * If a validation fails, it sends an HTTP 400 response to the client and returns the 
 * Express response object.
 * * @important Because this function returns an Express response object upon failure (which is "truthy"), 
 * the parent controller MUST check for strict equality to prevent server crashes. 
 * Example usage in controller: `if (isValid !== true) return;`
 */

export function validateRegisterUserFields(
  req,
  res,
  email,
  password,
  phoneNumber,
  termsAndCondition,
) {
  const isOnlyNumbers = (str) => /^\d+$/.test(str);

  if (!email || !password || !phoneNumber || termsAndCondition !== true) {
    return res.status(400).json({ error: "all fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "must be an email" });
  }
  if (!phoneNumber.startsWith("234")) {
    return res.status(400).json({ error: "must  start with 234" });
  } else if (phoneNumber.length !== 13) {
    return res
      .status(400)
      .json({ error: "length must be 13, starting with 234" });
  } else if (!isOnlyNumbers(phoneNumber)) {
    return res.status(400).json({ error: "phone number : only numbers allowed" });
  }
  if (password.length <= 7) {
    return res.status(400).json({ error: "password is too short" });
  }
  if (!/[a-z]/i.test(password)) {
    return res.status(400).json({ error: "password must contain at least an alphabet" });
  }

  return true;
}
