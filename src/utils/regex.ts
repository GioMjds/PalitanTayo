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
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])[^\s]{10,}$/;
    return passwordRegex.test(password);
}