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
  },

  // ─── Admin new dashboard queries ───────────────────────────────────────────

  getDashboardUsers: async (_, __, { user }) => {
    requireAuth(user)
    const [usersCount, restaurantsCount, ridersCount, vendorsCount] = await Promise.all([
      User.countDocuments({ userType: { $in: ['default', 'user'] } }),
      Restaurant.countDocuments({ isActive: true }),
      Rider.countDocuments({ isActive: true }),
      User.countDocuments({ userType: { $in: ['vendor', 'admin'] } })
    ])
    return { usersCount, vendorsCount, restaurantsCount, ridersCount }
  },

  getDashboardUsersByYear: async (_, { year }, { user }) => {
    requireAuth(user)
    const start = new Date(year, 0, 1)
    const end = new Date(year + 1, 0, 1)
    const [usersCount, restaurantsCount, ridersCount, vendorsCount] = await Promise.all([
      User.countDocuments({ userType: { $in: ['default', 'user'] }, createdAt: { $gte: start, $lt: end } }),
      Restaurant.countDocuments({ createdAt: { $gte: start, $lt: end } }),
      Rider.countDocuments({ createdAt: { $gte: start, $lt: end } }),
      User.countDocuments({ userType: 'vendor', createdAt: { $gte: start, $lt: end } })
    ])
    return {
      usersCount, vendorsCount, restaurantsCount, ridersCount,
      percentageChange: { usersPercent: 0, vendorsPercent: 0, restaurantsPercent: 0, ridersPercent: 0 }
    }
  },

  getDashboardOrdersByType: async (_, __, { user }) => {
    requireAuth(user)
    const statuses = ['PENDING', 'ACCEPTED', 'ASSIGNED', 'PICKED', 'DELIVERED', 'CANCELLED']
    const results = await Promise.all(
      statuses.map(async s => ({
        label: s,
        value: await Order.countDocuments({ orderStatus: s })
      }))
    )
    return results
  },

  getDashboardSalesByType: async (_, __, { user }) => {
    requireAuth(user)
    const pipeline = [
      { $match: { orderStatus: 'DELIVERED' } },
      { $group: { _id: '$paymentMethod', value: { $sum: '$orderAmount' } } },
      { $project: { label: '$_id', value: 1, _id: 0 } }
    ]
    return Order.aggregate(pipeline)
  },

  getRestaurantDashboardOrdersSalesStats: async (_, { restaurant, starting_date, ending_date }, { user }) => {
    requireAuth(user)
    const match = {
      restaurant,
      createdAt: { $gte: new Date(starting_date), $lte: new Date(ending_date) }
    }
    const [totalOrders, salesData] = await Promise.all([
      Order.countDocuments(match),
      Order.aggregate([{ $match: { ...match, orderStatus: 'DELIVERED' } }, { $group: { _id: null, total: { $sum: '$orderAmount' } } }])
    ])
    return {
      totalOrders,
      totalSales: salesData[0]?.total || 0,
      totalCODOrders: await Order.countDocuments({ ...match, paymentMethod: 'COD' }),
      totalCardOrders: await Order.countDocuments({ ...match, paymentMethod: { $in: ['PAYSTACK', 'CARD'] } })
    }
  },

  getRestaurantDashboardSalesOrderCountDetailsByYear: async (_, { restaurant, year }, { user }) => {
    requireAuth(user)
    const months = Array.from({ length: 12 }, (_, i) => ({
      salesAmount: 0,
      ordersCount: 0
    }))
    return months
  },

  getDashboardOrderSalesDetailsByPaymentMethod: async (_, args, { user }) => {
    requireAuth(user)
    const empty = { _type: 'all', data: { total_orders: 0, total_sales: 0, total_sales_without_delivery: 0, total_delivery_fee: 0 } }
    return { all: { ...empty, _type: 'all' }, cod: { ...empty, _type: 'cod' }, card: { ...empty, _type: 'card' } }
  },

  getStoreDetailsByVendorId: async (_, { id }, { user }) => {
    requireAuth(user)
    const restaurant = await Restaurant.findOne({ owner: id })
    if (!restaurant) return null
    const totalOrders = await Order.countDocuments({ restaurant: restaurant._id })
    const sales = await Order.aggregate([
      { $match: { restaurant: restaurant._id, orderStatus: 'DELIVERED' } },
      { $group: { _id: null, total: { $sum: '$orderAmount' } } }
    ])
    return {
      _id: restaurant._id,
      restaurantName: restaurant.name,
      totalOrders,
      totalSales: sales[0]?.total || 0,
      pickUpCount: await Order.countDocuments({ restaurant: restaurant._id, isPickedUp: true }),
      deliveryCount: await Order.countDocuments({ restaurant: restaurant._id, isPickedUp: false })
    }
  },

  getVendorDashboardStatsCardDetails: async (_, { vendorId }, { user }) => {
    requireAuth(user)
    const restaurants = await Restaurant.find({ owner: vendorId })
    const restaurantIds = restaurants.map(r => r._id)
    const [totalOrders, salesData] = await Promise.all([
      Order.countDocuments({ restaurant: { $in: restaurantIds } }),
      Order.aggregate([{ $match: { restaurant: { $in: restaurantIds }, orderStatus: 'DELIVERED' } }, { $group: { _id: null, total: { $sum: '$orderAmount' } } }])
    ])
    return {
      totalRestaurants: restaurants.length,
      totalOrders,
      totalSales: salesData[0]?.total || 0,
      totalDeliveries: await Order.countDocuments({ restaurant: { $in: restaurantIds }, orderStatus: 'DELIVERED' })
    }
  },

  getLiveMonitorData: async (_, { id }, { user }) => {
    requireAuth(user)
    return { online_stores: 0, cancelled_orders: 0, delayed_orders: 0, ratings: 0 }
  },

  getVendorDashboardGrowthDetailsByYear: async (_, { vendorId, year }, { user }) => {
    requireAuth(user)
    return Array.from({ length: 12 }, () => ({ totalRestaurants: 0, totalOrders: 0, totalSales: 0 }))
  },

  vendors: async (_, { page = 1, rows = 50, search }, { user }) => {
    requireAuth(user)
    const query = { userType: { $in: ['vendor', 'admin'] } }
    if (search) query.name = { $regex: search, $options: 'i' }
    const skip = (page - 1) * rows
    const vendorUsers = await User.find(query).skip(skip).limit(rows)
    return Promise.all(vendorUsers.map(async v => {
      const restaurants = await Restaurant.find({ owner: v._id })
      return { ...v.toObject(), restaurants }
    }))
  },

  restaurantByOwner: async (_, { id }, { user }) => {
    requireAuth(user)
    const vendor = await User.findById(id)
    if (!vendor) return null
    const restaurants = await Restaurant.find({ owner: id })
    return { ...vendor.toObject(), restaurants }
  },

  notifications: async (_, { page = 1 }, { user }) => {
    requireAuth(user)
    const Notification = require('../../models/Notification')
    const limit = 20
    const skip = (page - 1) * limit
    const notifications = await Notification.find({ user: user.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
    return { notifications }
  }
}
