/**
 * Strong Password Regex:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (@, #, $, %, ^, &, +, =, !, etc.)
 * - No whitespace
 */
export const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;

/**
 * Validates password strength
 * @param {string} password 
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
    return PASSWORD_REGEX.test(password);
};

/**
 * Returns descriptive error message for invalid password
 * @param {string} password 
 * @returns {string|null}
 */
export const getPasswordError = (password) => {
    if (!password) return 'Mật khẩu không được để trống';
    if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
    if (!/(?=.*[a-z])/.test(password)) return 'Mật khẩu phải chứa ít nhất một chữ cái thường';
    if (!/(?=.*[A-Z])/.test(password)) return 'Mật khẩu phải chứa ít nhất một chữ cái hoa';
    if (!/(?=.*[0-9])/.test(password)) return 'Mật khẩu phải chứa ít nhất một chữ số';
    if (!/(?=.*[@#$%^&+=!])/.test(password)) return 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (@, #, $, %, ...)';
    if (/\s/.test(password)) return 'Mật khẩu không được chứa khoảng trắng';
    return null;
};
