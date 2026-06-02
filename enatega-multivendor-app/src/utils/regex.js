export const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
export const passRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/
export const nameRegex = /^[\p{L}][\p{L}\s'-]+$/u
// Accepts 7–15 digit local/international numbers — covers all West African formats
export const phoneRegex = /^\d{7,15}$/
// Ghana: 9-digit local (02x/05x) or without leading zero
export const ghanaPhoneRegex = /^(0[235][0-9]{8}|[235][0-9]{8})$/
// West Africa full international: GH +233, NG +234, CI +225, SN +221
export const westAfricaPhoneRegex = /^(\+?233[0-9]{9}|\+?234[0-9]{10}|\+?225[0-9]{10}|\+?221[0-9]{9}|0[0-9]{9})$/


// Handlers
export const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
  }