const Configuration = require('../../models/Configuration')
const Restaurant = require('../../models/Restaurant')
const Order = require('../../models/Order')
const User = require('../../models/User')
const Rider = require('../../models/Rider')
const Zone = require('../../models/Zone')
const Cuisine = require('../../models/Cuisine')
const Banner = require('../../models/Banner')
const Coupon = require('../../models/Coupon')
const Review = require('../../models/Review')
const ChatMessage = require('../../models/ChatMessage')
const { requireAuth } = require('../../middleware/auth')

module.exports = {
  configuration: async () => {
    const config = await Configuration.findOne()
    return config
  },

  profile: async (_, __, { user }) => {
    requireAuth(user)
    return User.findById(user.userId)
  },

  orders: async (_, { offset = 0 }, { user }) => {
    requireAuth(user)
    return Order.find({ user: user.userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(10)
      .populate('restaurant rider review')
  },

  order: async (_, { id }, { user }) => {
    requireAuth(user)
    return Order.findById(id).populate('restaurant rider review user')
  },

  nearByRestaurants: async (_, { latitude, longitude, shopType }) => {
    const query = { isActive: true, isAvailable: true }
    if (shopType) query.shopType = shopType
    const restaurants = await Restaurant.find(query).populate('categories zone owner')
    // TODO: filter by delivery bounds / zone — implement geo query
    return { offers: [], sections: [], restaurants }
  },

  nearByRestaurantsPreview: async (_, { latitude, longitude, shopType }) => {
    const query = { isActive: true, isAvailable: true }
    if (shopType) query.shopType = shopType
    const restaurants = await Restaurant.find(query)
    return { offers: [], sections: [], restaurants }
  },

  topRatedVendors: async (_, { latitude, longitude }) => {
    return Restaurant.find({ isActive: true, isAvailable: true })
      .sort({ rating: -1 })
      .limit(10)
      .populate('categories')
  },

  topRatedVendorsPreview: async (_, { latitude, longitude }) => {
    return Restaurant.find({ isActive: true, isAvailable: true })
      .sort({ rating: -1 })
      .limit(10)
  },

  recentOrderRestaurants: async (_, { latitude, longitude }, { user }) => {
    // TODO: query recent orders by user and return unique restaurants
    return []
  },

  recentOrderRestaurantsPreview: async (_, { latitude, longitude }, { user }) => {
    return []
  },

  mostOrderedRestaurants: async (_, { latitude, longitude, shopType }) => {
    // TODO: aggregate order counts per restaurant
    return Restaurant.find({ isActive: true, isAvailable: true }).limit(10)
  },

  mostOrderedRestaurantsPreview: async (_, args) => {
    return Restaurant.find({ isActive: true, isAvailable: true }).limit(10)
  },

  restaurant: async (_, { id }) => {
    return Restaurant.findById(id).populate('categories addons zone owner')
  },

  restaurants: async (_, { page = 0, rows = 20, search }) => {
    const query = search ? { name: { $regex: search, $options: 'i' } } : {}
    return Restaurant.find(query).skip(page * rows).limit(rows).populate('categories owner')
  },

  cuisines: async () => Cuisine.find(),

  nearByRestaurantsCuisines: async (_, { latitude, longitude, shopType }) => {
    return Cuisine.find(shopType ? { shopType } : {})
  },

  banners: async () => Banner.find({ isActive: true }),

  zones: async () => Zone.find({ isActive: true }),

  taxes: async () => {
    // TODO: Taxation model — return singleton
    return [{ _id: '1', taxationCharges: 0, enabled: false }]
  },

  tips: async () => {
    // TODO: Tipping model — return singleton
    return [{ _id: '1', tipVariations: [5, 10, 15, 20], enabled: true }]
  },

  getVersions: async () => ({
    customerAppVersion: { android: '1.0.0', ios: '1.0.0' },
    riderAppVersion: '1.0.0',
    restaurantAppVersion: '1.0.0'
  }),

  fetchAllShopTypes: async () => {
    // TODO: ShopType model
    return { data: [] }
  },

  subCategories: async () => [],

  subCategoriesByParentId: async (_, { parentCategoryId }) => [],

  getCountryByIso: async (_, { iso }) => {
    // TODO: integrate countries/cities data
    return { cities: [] }
  },

  fetchCategoryDetailsByStoreIdForMobile: async (_, { storeId }) => [],

  popularFoodItems: async (_, { restaurantId }) => {
    const restaurant = await Restaurant.findById(restaurantId).populate('categories')
    if (!restaurant) return []
    return restaurant.categories.flatMap(c => c.foods).filter(f => f.isActive).slice(0, 10)
  },

  popularItems: async (_, { restaurantId }) => [],

  relatedItems: async (_, { itemId, restaurantId }) => [],

  chat: async (_, { order }, { user }) => {
    requireAuth(user)
    return ChatMessage.find({ order }).sort({ createdAt: 1 })
  },

  reviewsByRestaurant: async (_, { restaurant }) => {
    const reviews = await Review.find({ restaurant }).populate('order user restaurant')
    const total = reviews.length
    const ratings = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0
    return { reviews, ratings, total }
  },

  rider: async (_, { id }) => {
    return Rider.findById(id)
  },

  userFavourite: async (_, { latitude, longitude }, { user }) => {
    requireAuth(user)
    const u = await User.findById(user.userId)
    if (!u?.favourite?.length) return []
    return Restaurant.find({ _id: { $in: u.favourite }, isActive: true }).populate('categories')
  },

  users: async (_, __, { user }) => {
    requireAuth(user)
    return User.find()
  }
}
