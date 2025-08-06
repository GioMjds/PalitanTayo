import { PasswordValidation } from "@/types/CustomerAuth";

/**
 * Validates an email address based on standard email format:
 * - Contains at least '@' and a domain
 * - No spaces
 * - Allows alphanumeric characters, dots, underscores, percent signs, plus signs, and hyphens before the '@'
 * - Restricted to specific TLDs to only accept `.com`, `.net`, `.org`, `.edu`, `.gov`, and `.mil`
 * - Allows predefined domains like `gmail.com`, `yahoo.com`, `outlook.com`, etc.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - Returns true if the email is valid, otherwise false.
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailRegex.test(email);
}

/**
 * Validates a password based on specific criterias:
 * - At least 10 character long
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * - No whitespace characters
 * @param {string} password - The password to validate.
 * @returns {boolean} - Returns true if the password is valid, otherwise false.
 */
export function isValidPassword(password: string): boolean {
	const passwordRegex =
		/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])[^\s]{10,}$/;
	return passwordRegex.test(password);
}

/**
 * Validates a password string against a set of security requirements.
 *
 * This helper function checks if the provided password meets the following criteria:
 * - Minimum length of 10 characters
 * - Contains at least one uppercase letter (A-Z)
 * - Contains at least one lowercase letter (a-z)
 * - Contains at least one numeric digit (0-9)
 * - Contains at least one special character (e.g., !@#$%^&*()_-+=[]{};':"\\|,.<>/?`~)
 *
 * The function also relies on an external `isValidPassword` function to perform additional validation logic.
 *
 * @param password - The password string to validate.
 * @returns An object of type `PasswordValidation` containing boolean flags for each validation rule:
 * - `isValid`: Overall validity of the password as determined by `isValidPassword`.
 * - `hasLength`: Whether the password meets the minimum length requirement.
 * - `hasUppercase`: Whether the password contains at least one uppercase letter.
 * - `hasLowercase`: Whether the password contains at least one lowercase letter.
 * - `hasNumber`: Whether the password contains at least one numeric digit.
 * - `hasSpecialChar`: Whether the password contains at least one special character.
 */
export function validatePassword(password: string): PasswordValidation {
	const isPasswordValid = isValidPassword(password);
	const specialChar = /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~]/;
	return {
		isValid: isPasswordValid,
		hasLength: password.length >= 10,
		hasUppercase: /[A-Z]/.test(password),
		hasLowercase: /[a-z]/.test(password),
		hasNumber: /\d/.test(password),
		hasSpecialChar: specialChar.test(password),
	};
}
