export interface PasswordValidation {
    isValid: boolean;
    hasLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
}