const { gql } = require('apollo-server-express')

const typeDefs = gql`
  scalar Upload

  # ─── Auth ────────────────────────────────────────────────────────────────────

  type AuthData {
    userId: String
    token: String
    tokenExpiration: Int
    name: String
    email: String
    phone: String
    isActive: Boolean
    isNewUser: Boolean
    userType: String
    restaurants: [RestaurantInfo]
    permissions: [String]
    userTypeId: String
    image: String
  }

  # ─── Location ────────────────────────────────────────────────────────────────

  type Location {
    coordinates: [Float]
  }

  type CircleBounds {
    radius: Float
    # TODO: confirm if lat/lng or coordinates array
  }

  input CoordinatesInput {
    latitude: Float!
    longitude: Float!
  }

  input CircleBoundsInput {
    radius: Float
  }

  # ─── Configuration ───────────────────────────────────────────────────────────

  type Configuration {
    _id: ID
    email: String
    emailName: String
    password: String
    enableEmail: Boolean
    clientId: String
    clientSecret: String
    sandbox: Boolean
    publishableKey: String
    secretKey: String
    currency: String
    currencySymbol: String
    deliveryRate: Float
    twilioAccountSid: String
    twilioAuthToken: String
    twilioPhoneNumber: String
    twilioEnabled: Boolean
    skipWhatsAppOTP: Boolean
    twilioWhatsAppNumber: String
    formEmail: String
    sendGridApiKey: String
    sendGridEnabled: Boolean
    sendGridEmail: String
    sendGridEmailName: String
    sendGridPassword: String
    dashboardSentryUrl: String
    webSentryUrl: String
    apiSentryUrl: String
    customerAppSentryUrl: String
    restaurantAppSentryUrl: String
    riderAppSentryUrl: String
    googleApiKey: String
    cloudinaryUploadUrl: String
    cloudinaryApiKey: String
    webAmplitudeApiKey: String
    appAmplitudeApiKey: String
    webClientID: String
    androidClientID: String
    iOSClientID: String
    expoClientID: String
    googleMapLibraries: String
    googleColor: String
    termsAndConditions: String
    privacyPolicy: String
    testOtp: String
    firebaseKey: String
    authDomain: String
    projectId: String
    storageBucket: String
    msgSenderId: String
    appId: String
    measurementId: String
    isPaidVersion: Boolean
    skipEmailVerification: Boolean
    skipMobileVerification: Boolean
    costType: String
    vapidKey: String
    googlePlacesApiBaseUrl: String
  }

  input EmailConfigurationInput {
    email: String!
    emailName: String
    password: String!
    enableEmail: Boolean
  }

  input FormEmailConfigurationInput {
    formEmail: String!
  }

  input SendGridConfigurationInput {
    sendGridApiKey: String!
    sendGridEnabled: Boolean
    sendGridEmail: String
    sendGridEmailName: String
    sendGridPassword: String
  }

  input FirebaseConfigurationInput {
    firebaseKey: String
    authDomain: String
    projectId: String
    storageBucket: String
    msgSenderId: String
    appId: String
    measurementId: String
    vapidKey: String
  }

  input SentryConfigurationInput {
    dashboardSentryUrl: String
    webSentryUrl: String
    apiSentryUrl: String
    customerAppSentryUrl: String
    restaurantAppSentryUrl: String
    riderAppSentryUrl: String
  }

  input GoogleApiKeyConfigurationInput {
    googleApiKey: String!
  }

  input CloudinaryConfigurationInput {
    cloudinaryUploadUrl: String!
    cloudinaryApiKey: String!
  }

  input AmplitudeApiKeyConfigurationInput {
    webAmplitudeApiKey: String
    appAmplitudeApiKey: String
  }

  input GoogleClientIDConfigurationInput {
    webClientID: String
    androidClientID: String
    iOSClientID: String
    expoClientID: String
  }

  input WebConfigurationInput {
    googleMapLibraries: String
    googleColor: String
  }

  input AppConfigurationsInput {
    termsAndConditions: String
    privacyPolicy: String
    testOtp: String
  }

  input DeliveryCostConfigurationInput {
    deliveryRate: Float
    costType: String
  }

  input PaypalConfigurationInput {
    clientId: String
    clientSecret: String
    sandbox: Boolean
  }

  input StripeConfigurationInput {
    publishableKey: String
    secretKey: String
  }

  # Paystack replaces Stripe/PayPal as the primary payment provider
  input PaystackConfigurationInput {
    paystackPublicKey: String
    paystackSecretKey: String
  }

  input TwilioConfigurationInput {
    twilioAccountSid: String
    twilioAuthToken: String
    twilioPhoneNumber: String
    twilioEnabled: Boolean
    twilioWhatsAppNumber: String
    skipWhatsAppOTP: Boolean
  }

  input VerificationConfigurationInput {
    skipEmailVerification: Boolean
    skipMobileVerification: Boolean
    skipWhatsAppOTP: Boolean
  }

  input CurrencyConfigurationInput {
    currency: String!
    currencySymbol: String!
  }

  # ─── User ────────────────────────────────────────────────────────────────────

  type User {
    _id: ID!
    name: String
    email: String
    phone: String
    phoneIsVerified: Boolean
    emailIsVerified: Boolean
    password: String
    isActive: Boolean
    isOrderNotification: Boolean
    isOfferNotification: Boolean
    notificationToken: String
    addresses: [Address]
    favourite: [String]
    userType: String
    appleId: String
    createdAt: String
    updatedAt: String
  }

  type UserExistResult {
    userType: String
    _id: ID
    email: String
    phone: String
  }

  input UserInput {
    phone: String
    email: String
    password: String
    name: String
    notificationToken: String
    appleId: String
    emailIsVerified: Boolean
    isPhoneExists: Boolean
  }

  input UpdateUserInput {
    name: String!
    phone: String
    phoneIsVerified: Boolean
    emailIsVerified: Boolean
  }

  # ─── Address ─────────────────────────────────────────────────────────────────

  type Address {
    _id: ID
    id: ID
    deliveryAddress: String
    details: String
    label: String
    location: Location
    selected: Boolean
  }

  input AddressInput {
    _id: ID
    id: ID
    deliveryAddress: String
    details: String
    label: String
    latitude: Float
    longitude: Float
    selected: Boolean
  }

  # ─── Rider ───────────────────────────────────────────────────────────────────

  type Rider {
    _id: ID!
    name: String
    email: String
    username: String
    password: String
    phone: String
    image: String
    available: Boolean
    isActive: Boolean
    location: Location
    zone: Zone
    notificationToken: String
    currentWalletAmount: Float
    totalWalletAmount: Float
    withdrawnWalletAmount: Float
    accountNumber: String
    createdAt: String
    updatedAt: String
  }

  # ─── Restaurant ──────────────────────────────────────────────────────────────

  type RestaurantInfo {
    _id: ID
    orderId: String
    name: String
    image: String
    address: String
  }

  type Restaurant {
    _id: ID!
    orderId: String
    orderPrefix: String
    name: String
    image: String
    logo: String
    address: String
    location: Location
    deliveryBounds: Location
    categories: [Category]
    options: [Option]
    addons: [Addon]
    reviewData: ReviewData
    zone: Zone
    username: String
    password: String
    deliveryTime: Int
    minimumOrder: Float
    sections: [String]
    rating: Float
    isActive: Boolean
    isAvailable: Boolean
    openingTimes: [OpeningTime]
    slug: String
    stripeDetailsSubmitted: Boolean
    commissionRate: Float
    owner: Owner
    tax: Float
    notificationToken: String
    enableNotification: Boolean
    shopType: String
    cuisines: [String]
    phone: String
    restaurantUrl: String
    keywords: [String]
    tags: [String]
    reviewCount: Int
    reviewAverage: Float
    postCode: String
    city: String
  }

  type RestaurantPreview {
    _id: ID!
    orderId: String
    orderPrefix: String
    name: String
    image: String
    logo: String
    address: String
    username: String
    password: String
    deliveryTime: Int
    minimumOrder: Float
    sections: [String]
    rating: Float
    isActive: Boolean
    isAvailable: Boolean
    slug: String
    stripeDetailsSubmitted: Boolean
    commissionRate: Float
    tax: Float
    notificationToken: String
    enableNotification: Boolean
    shopType: String
    cuisines: [String]
    keywords: [String]
    tags: [String]
    reviewCount: Int
    reviewAverage: Float
    location: Location
    openingTimes: [OpeningTime]
    distanceWithCurrentLocation: Float
    freeDelivery: Boolean
    acceptVouchers: Boolean
  }

  type Owner {
    _id: ID
    email: String
    isActive: Boolean
  }

  type OpeningTime {
    day: String
    times: [TimeSlot]
  }

  type TimeSlot {
    startTime: [String]
    endTime: [String]
  }

  input RestaurantInput {
    name: String!
    image: String
    logo: String
    address: String
    deliveryTime: Int
    minimumOrder: Float
    tax: Float
    shopType: String
    cuisines: [String]
    phone: String
    orderPrefix: String
    username: String
    password: String
    commissionRate: Float
    location: CoordinatesInput
  }

  # ─── Category ────────────────────────────────────────────────────────────────

  type Category {
    _id: ID!
    title: String
    description: String
    image: String
    foods: [Food]
    createdAt: String
    updatedAt: String
  }

  type SubCategory {
    _id: ID!
    title: String
    parentCategoryId: String
  }

  # ─── Food ────────────────────────────────────────────────────────────────────

  type Food {
    _id: ID!
    title: String
    description: String
    image: String
    subCategory: String
    variations: [Variation]
    isActive: Boolean
    isOutOfStock: Boolean
    createdAt: String
    updatedAt: String
  }

  type Variation {
    _id: ID!
    title: String
    price: Float
    discounted: Float
    addons: [String]
    isOutOfStock: Boolean
  }

  type Option {
    _id: ID!
    title: String
    description: String
    price: Float
  }

  type Addon {
    _id: ID!
    options: [String]
    title: String
    description: String
    quantityMinimum: Int
    quantityMaximum: Int
  }

  type AddonFull {
    _id: ID!
    options: [Option]
    title: String
    description: String
    quantityMinimum: Int
    quantityMaximum: Int
  }

  # ─── Order ───────────────────────────────────────────────────────────────────

  type Order {
    _id: ID!
    orderId: String
    id: ID
    restaurant: Restaurant
    deliveryAddress: Address
    items: [OrderItem]
    user: User
    rider: Rider
    review: Review
    paymentMethod: String
    paidAmount: Float
    orderAmount: Float
    orderStatus: String
    paymentStatus: String
    reason: String
    isActive: Boolean
    createdAt: String
    updatedAt: String
    tipping: Float
    taxationAmount: Float
    deliveryCharges: Float
    completionTime: String
    orderDate: String
    expectedTime: String
    preparationTime: String
    isPickedUp: Boolean
    acceptedAt: String
    pickedAt: String
    deliveredAt: String
    cancelledAt: String
    assignedAt: String
    isRinged: Boolean
    isRiderRinged: Boolean
    instructions: String
    discountAmount: Float
    status: String
  }

  type OrderItem {
    _id: ID
    id: ID
    title: String
    food: String
    description: String
    image: String
    quantity: Int
    variation: Variation
    addons: [AddonFull]
    specialInstructions: String
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  input OrderInput {
    food: String!
    quantity: Int!
    variation: String!
    addons: [String]
    specialInstructions: String
  }

  # ─── Review ──────────────────────────────────────────────────────────────────

  type Review {
    _id: ID!
    order: Order
    restaurant: Restaurant
    user: User
    rating: Int
    description: String
    isActive: Boolean
    createdAt: String
    updatedAt: String
  }

  type ReviewData {
    reviews: [Review]
    ratings: Float
    total: Int
  }

  type ReviewsByRestaurantResult {
    reviews: [Review]
    ratings: Float
    total: Int
  }

  input ReviewInput {
    order: String!
    rating: Int!
    description: String
  }

  # ─── Zone ────────────────────────────────────────────────────────────────────

  type Zone {
    _id: ID!
    title: String
    description: String
    location: Location
    isActive: Boolean
    tax: Float
  }

  # ─── Coupon ──────────────────────────────────────────────────────────────────

  type Coupon {
    _id: ID!
    title: String
    discount: Float
    enabled: Boolean
  }

  type CouponResult {
    coupon: Coupon
    message: String
    success: Boolean
  }

  # ─── Cuisine ─────────────────────────────────────────────────────────────────

  type Cuisine {
    _id: ID!
    name: String
    description: String
    image: String
    shopType: String
  }

  # ─── ShopType ────────────────────────────────────────────────────────────────

  type ShopType {
    _id: ID!
    name: String
    image: String
    slug: String
    isActive: Boolean
  }

  type ShopTypeResult {
    data: [ShopType]
  }

  # ─── Banner ──────────────────────────────────────────────────────────────────

  type Banner {
    _id: ID!
    title: String
    description: String
    action: String
    screen: String
    file: String
    parameters: String
  }

  # ─── Tipping / Taxation ──────────────────────────────────────────────────────

  type Tipping {
    _id: ID!
    tipVariations: [Float]
    enabled: Boolean
  }

  type Taxation {
    _id: ID!
    taxationCharges: Float
    enabled: Boolean
  }

  # ─── Notification ────────────────────────────────────────────────────────────

  type Notification {
    _id: ID!
    title: String
    body: String
    data: String
    read: Boolean
    user: String
    createdAt: String
  }

  # ─── Support Ticket ──────────────────────────────────────────────────────────

  type SupportTicket {
    _id: ID!
    subject: String
    description: String
    status: String
    user: String
    email: String
    createdAt: String
  }

  # ─── Withdraw Request ────────────────────────────────────────────────────────

  type WithdrawRequest {
    _id: ID!
    rider: Rider
    requestAmount: Float
    requestTime: String
    status: String
  }

  # ─── Chat ────────────────────────────────────────────────────────────────────

  type ChatMessage {
    id: ID
    message: String
    user: ChatUser
    createdAt: String
  }

  type ChatUser {
    id: ID
    name: String
  }

  input ChatMessageInput {
    message: String!
    user: String
  }

  type ChatMessageResult {
    success: Boolean
    message: String
    data: ChatMessage
  }

  # ─── App Version ─────────────────────────────────────────────────────────────

  type AppVersions {
    customerAppVersion: AppVersion
    riderAppVersion: String
    restaurantAppVersion: String
  }

  type AppVersion {
    android: String
    ios: String
  }

  # ─── Nearby Restaurants Result ───────────────────────────────────────────────

  type Offer {
    _id: ID
    name: String
    tag: String
    restaurants: [String]
  }

  type Section {
    _id: ID
    name: String
    restaurants: [String]
  }

  type NearByRestaurantsResult {
    offers: [Offer]
    sections: [Section]
    restaurants: [Restaurant]
  }

  type NearByRestaurantsPreviewResult {
    offers: [Offer]
    sections: [Section]
    restaurants: [RestaurantPreview]
  }

  # ─── Category Details (mobile) ───────────────────────────────────────────────

  type CategoryDetails {
    id: ID
    category_name: String
    url: String
    food_id: String
  }

  # ─── Geolocation ─────────────────────────────────────────────────────────────

  type City {
    id: ID
    name: String
    latitude: Float
    longitude: Float
  }

  type Country {
    cities: [City]
  }

  # ─── Metrics / Security ──────────────────────────────────────────────────────

  type MetricsGeneralResult {
    experience: String
    hehe: String
  }

  # ─── Generic Results ─────────────────────────────────────────────────────────

  type Result {
    result: Boolean
  }

  type SuccessMessage {
    success: Boolean
    message: String
  }

  type DeliveryBoundsResult {
    success: Boolean
    message: String
    data: Restaurant
  }

  # ─── Queries ─────────────────────────────────────────────────────────────────

  type Query {
    # Public / customer
    configuration: Configuration
    nearByRestaurants(latitude: Float, longitude: Float, shopType: String): NearByRestaurantsResult
    nearByRestaurantsPreview(latitude: Float, longitude: Float, shopType: String): NearByRestaurantsPreviewResult
    topRatedVendors(latitude: Float!, longitude: Float!): [Restaurant]
    topRatedVendorsPreview(latitude: Float!, longitude: Float!): [RestaurantPreview]
    recentOrderRestaurants(latitude: Float!, longitude: Float!): [Restaurant]
    recentOrderRestaurantsPreview(latitude: Float!, longitude: Float!): [RestaurantPreview]
    mostOrderedRestaurants(latitude: Float!, longitude: Float!, shopType: String): [Restaurant]
    mostOrderedRestaurantsPreview(latitude: Float!, longitude: Float!, shopType: String): [RestaurantPreview]
    restaurant(id: String): Restaurant
    restaurants(page: Int, rows: Int, search: String): [Restaurant]
    cuisines: [Cuisine]
    nearByRestaurantsCuisines(latitude: Float!, longitude: Float!, shopType: String!): [Cuisine]
    banners: [Banner]
    zones: [Zone]
    taxes: [Taxation]
    tips: [Tipping]
    getVersions: AppVersions
    fetchAllShopTypes: ShopTypeResult
    subCategories: [SubCategory]
    subCategoriesByParentId(parentCategoryId: String!): [SubCategory]
    getCountryByIso(iso: String!): Country
    fetchCategoryDetailsByStoreIdForMobile(storeId: String!): [CategoryDetails]
    popularFoodItems(restaurantId: String!): [Food]
    popularItems(restaurantId: String!): [PopularItemCount]
    relatedItems(itemId: String!, restaurantId: String!): [String]
    chat(order: ID!): [ChatMessage]
    reviewsByRestaurant(restaurant: String!): ReviewsByRestaurantResult

    # Auth-required customer
    profile: User
    orders(offset: Int): [Order]
    order(id: String!): Order
    rider(id: String): Rider
    userFavourite(latitude: Float, longitude: Float): [Restaurant]
    users: [User]

    # Admin
    getDashboardTotal(endingDate: String, startingDate: String, restaurant: String): DashboardTotal
    getDashboardSales(endingDate: String, startingDate: String, restaurant: String): [DashboardSale]
    getDashboardOrders(endingDate: String, startingDate: String, restaurant: String): [DashboardOrder]
    getAllOrders(page: Int, rows: Int, search: String, restaurant: String): AllOrdersResult
    getOrdersByDateRange(startingDate: String!, endingDate: String!, restaurant: String): [Order]
    riders(page: Int, rows: Int): [Rider]
    coupons: [Coupon]
    vendors(page: Int, rows: Int, search: String): [Vendor]
    vendorsByRestaurant(restaurantId: ID!): [Vendor]
    supportTickets: [SupportTicket]
    withdrawRequests: [WithdrawRequest]
    riderEarnings(riderId: ID!): [Earning]
    notifications(page: Int): NotificationResult
    earnings(restaurant: String, startingDate: String, endingDate: String): EarningsResult
    auditLogs: [AuditLog]
    appVersions: AppVersionsData
  }

  # ─── Mutations ───────────────────────────────────────────────────────────────

  type Mutation {
    # Auth
    login(email: String, password: String, type: String!, appleId: String, name: String, notificationToken: String): AuthData
    createUser(userInput: UserInput!): AuthData
    ownerLogin(email: String!, password: String!): AuthData

    # User management
    updateUser(updateUserInput: UpdateUserInput!): User
    updateNotificationStatus(offerNotification: Boolean!, orderNotification: Boolean!): User
    pushToken(token: String): User
    changePassword(oldPassword: String!, newPassword: String!): Boolean
    forgotPassword(email: String!): Result
    resetPassword(password: String!, email: String!): Result
    emailExist(email: String!): UserExistResult
    phoneExist(phone: String!): UserExistResult
    sendOtpToEmail(email: String!): Result
    sendOtpToPhoneNumber(phone: String!): Result
    verifyOtp(otp: String!, email: String, phone: String): Result
    Deactivate(isActive: Boolean!, email: String!): User

    # Address
    createAddress(addressInput: AddressInput!): User
    editAddress(addressInput: AddressInput!): User
    deleteAddress(id: ID!): User
    deleteBulkAddresses(ids: [ID!]!): User
    selectAddress(id: String!): User

    # Favourites
    addFavourite(id: String!): User

    # Orders
    placeOrder(
      restaurant: String!
      orderInput: [OrderInput!]!
      paymentMethod: String!
      couponCode: String
      tipping: Float!
      taxationAmount: Float!
      address: AddressInput!
      orderDate: String!
      isPickedUp: Boolean!
      deliveryCharges: Float!
      instructions: String
    ): Order
    abortOrder(id: String!): Order
    reviewOrder(reviewInput: ReviewInput!): Order

    # Coupon
    coupon(coupon: String!, restaurantId: ID!): CouponResult

    # Chat
    sendChatMessage(message: ChatMessageInput!, orderId: ID!): ChatMessageResult

    # Rider operations
    updateOrderStatus(id: String!, status: String!, reason: String): Order
    assignRider(orderId: String!, riderId: String!): Order
    toggleRiderAvailability: Rider
    updateRiderLocation(latitude: Float!, longitude: Float!): Rider
    riderLogin(email: String!, password: String!): AuthData
    riderWithdrawRequest(requestAmount: Float!): WithdrawRequest

    # Store (restaurant) operations
    storeLogin(username: String!, password: String!): AuthData
    toggleRestaurantAvailability(id: String!): Restaurant
    updateOrderStatusByStore(id: String!, status: String!, reason: String): Order

    # Activity
    createActivity(
      groupId: String!
      module: String!
      screenPath: String!
      type: String!
      details: String!
    ): Boolean

    # Notifications
    sendNotificationUser(notificationInput: NotificationInput!): Notification
    markNotificationRead(id: ID!): Notification

    # Metrics / security token
    metricsGeneral: MetricsGeneralResult

    # Admin — Configuration
    saveEmailConfiguration(configurationInput: EmailConfigurationInput!): Configuration
    saveFormEmailConfiguration(configurationInput: FormEmailConfigurationInput!): Configuration
    saveSendGridConfiguration(configurationInput: SendGridConfigurationInput!): Configuration
    saveFirebaseConfiguration(configurationInput: FirebaseConfigurationInput!): Configuration
    saveSentryConfiguration(configurationInput: SentryConfigurationInput!): Configuration
    saveGoogleApiKeyConfiguration(configurationInput: GoogleApiKeyConfigurationInput!): Configuration
    saveCloudinaryConfiguration(configurationInput: CloudinaryConfigurationInput!): Configuration
    saveAmplitudeApiKeyConfiguration(configurationInput: AmplitudeApiKeyConfigurationInput!): Configuration
    saveGoogleClientIDConfiguration(configurationInput: GoogleClientIDConfigurationInput!): Configuration
    saveWebConfiguration(configurationInput: WebConfigurationInput!): Configuration
    saveAppConfigurations(configurationInput: AppConfigurationsInput!): Configuration
    saveDeliveryRateConfiguration(configurationInput: DeliveryCostConfigurationInput!): Configuration
    savePaypalConfiguration(configurationInput: PaypalConfigurationInput!): Configuration
    saveStripeConfiguration(configurationInput: StripeConfigurationInput!): Configuration
    saveTwilioConfiguration(configurationInput: TwilioConfigurationInput!): Configuration
    saveVerificationsToggle(configurationInput: VerificationConfigurationInput!): Configuration
    saveCurrencyConfiguration(configurationInput: CurrencyConfigurationInput!): Configuration

    # Admin — Restaurants
    createRestaurant(restaurant: RestaurantInput!, owner: ID!): Restaurant
    deleteRestaurant(id: String!): Restaurant
    hardDeleteRestaurant(id: String!): Boolean
    updateDeliveryBoundsAndLocation(
      id: ID!
      boundType: String!
      bounds: [[[Float!]]]
      circleBounds: CircleBoundsInput
      location: CoordinatesInput!
      address: String
      postCode: String
      city: String
    ): DeliveryBoundsResult
  }

  # ─── Subscriptions ───────────────────────────────────────────────────────────

  type Subscription {
    subscriptionOrder(id: String!): OrderSubscriptionResult
    subscriptionRiderLocation(riderId: String!): Rider
    orderStatusChanged(userId: String!): OrderStatusChangedResult
    subscriptionNewMessage(order: ID!): ChatMessage
    # Admin / rider subscriptions
    subscribeToNewOrders(restaurantId: String): Order
    riderLocation(riderId: String): Rider
  }

  type OrderSubscriptionResult {
    _id: ID
    orderStatus: String
    rider: Rider
    completionTime: String
    preparationTime: String
  }

  type OrderStatusChangedResult {
    userId: String
    origin: String
    order: Order
  }

  # ─── Admin-specific types ─────────────────────────────────────────────────────

  type DashboardTotal {
    totalOrders: Int
    totalSales: Float
    totalUsers: Int
    totalRiders: Int
    totalRestaurants: Int
  }

  type DashboardSale {
    date: String
    amount: Float
  }

  type DashboardOrder {
    date: String
    count: Int
  }

  type AllOrdersResult {
    orders: [Order]
    totalCount: Int
  }

  type Vendor {
    _id: ID!
    email: String
    name: String
    phone: String
    image: String
    userType: String
    isActive: Boolean
    restaurants: [RestaurantInfo]
  }

  type Earning {
    _id: ID
    date: String
    amount: Float
    orderCount: Int
  }

  type EarningsResult {
    total: Float
    earnings: [Earning]
  }

  type NotificationResult {
    notifications: [Notification]
    total: Int
  }

  input NotificationInput {
    title: String!
    body: String!
    data: String
    user: String
  }

  type AuditLog {
    _id: ID
    action: String
    user: String
    details: String
    createdAt: String
  }

  type AppVersionsData {
    _id: ID
    customerAppVersion: AppVersion
    riderAppVersion: String
    restaurantAppVersion: String
  }

  type PopularItemCount {
    id: ID
    count: Int
  }
`

module.exports = typeDefs
