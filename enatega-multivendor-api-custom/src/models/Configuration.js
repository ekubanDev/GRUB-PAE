const mongoose = require('mongoose')

const configurationSchema = new mongoose.Schema(
  {
    // Email (SMTP)
    email: String,
    emailName: String,
    password: String,
    enableEmail: { type: Boolean, default: false },

    // PayPal (legacy — kept for schema compat, not used in GRUB-PAE)
    clientId: String,
    clientSecret: String,
    sandbox: { type: Boolean, default: true },

    // Stripe (legacy — kept for schema compat, Paystack is the live provider)
    publishableKey: String,
    secretKey: String,

    // Currency — defaults to GHS for Ghana
    currency: { type: String, default: 'GHS' },
    currencySymbol: { type: String, default: '₵' },

    // Delivery
    deliveryRate: { type: Number, default: 0 },
    costType: { type: String, default: 'fixed' },

    // Twilio
    twilioAccountSid: String,
    twilioAuthToken: String,
    twilioPhoneNumber: String,
    twilioEnabled: { type: Boolean, default: false },
    twilioWhatsAppNumber: String,
    skipWhatsAppOTP: { type: Boolean, default: false },

    // Misc email
    formEmail: String,

    // SendGrid
    sendGridApiKey: String,
    sendGridEnabled: { type: Boolean, default: false },
    sendGridEmail: String,
    sendGridEmailName: String,
    sendGridPassword: String,

    // Sentry (6 DSNs)
    dashboardSentryUrl: String,
    webSentryUrl: String,
    apiSentryUrl: String,
    customerAppSentryUrl: String,
    restaurantAppSentryUrl: String,
    riderAppSentryUrl: String,

    // Google
    googleApiKey: String,
    googleMapLibraries: String,
    googleColor: String,

    // Cloudinary
    cloudinaryUploadUrl: String,
    cloudinaryApiKey: String,

    // Amplitude
    webAmplitudeApiKey: String,
    appAmplitudeApiKey: String,

    // Google OAuth
    webClientID: String,
    androidClientID: String,
    iOSClientID: String,
    expoClientID: String,

    // App links
    termsAndConditions: String,
    privacyPolicy: String,

    // Firebase Web SDK (served to frontends at runtime)
    firebaseKey: String,
    authDomain: String,
    projectId: String,
    storageBucket: String,
    msgSenderId: String,
    appId: String,
    measurementId: String,
    isPaidVersion: { type: Boolean, default: false },
    vapidKey: String,
    googlePlacesApiBaseUrl: String,

    // OTP config
    testOtp: String,
    skipEmailVerification: { type: Boolean, default: false },
    skipMobileVerification: { type: Boolean, default: false }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Configuration', configurationSchema)
