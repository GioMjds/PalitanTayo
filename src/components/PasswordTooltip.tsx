import { PasswordValidation } from "@/types/CustomerAuth";
import { motion } from "framer-motion";

export default function PasswordTooltip({ validation }: { validation: PasswordValidation }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-10 mt-2 w-64 p-3 bg-surface-primary rounded-lg shadow-lg border border-accent-dark"
        >
            <div className="tooltip-arrow"></div>
            <h4 className="text-sm font-medium text-primary mb-2">Password Requirements:</h4>
            <ul className="space-y-1 text-sm text-text-secondary">
                <li className={`flex items-center ${validation.hasLength ? 'text-success' : 'text-error'}`}>
                    {validation.hasLength ? '✓' : '✗'} At least 10 characters
                </li>
                <li className={`flex items-center ${validation.hasUppercase ? 'text-success' : 'text-error'}`}>
                    {validation.hasUppercase ? '✓' : '✗'} 1 uppercase letter
                </li>
                <li className={`flex items-center ${validation.hasLowercase ? 'text-success' : 'text-error'}`}>
                    {validation.hasLowercase ? '✓' : '✗'} 1 lowercase letter
                </li>
                <li className={`flex items-center ${validation.hasNumber ? 'text-success' : 'text-error'}`}>
                    {validation.hasNumber ? '✓' : '✗'} 1 number
                </li>
                <li className={`flex items-center ${validation.hasSpecialChar ? 'text-success' : 'text-error'}`}>
                    {validation.hasSpecialChar ? '✓' : '✗'} 1 special character
                </li>
            </ul>
        </motion.div>
    )
}