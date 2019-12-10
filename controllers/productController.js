const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const PAGE_LIMIT = 3
const PAGE_OFFSET = 0

let productController = {
  getProducts: (req, res) => {
    // offset 為起始值；limit 為顯示筆數
    // findAndCountAll 回傳的 products 包含 count (找到的筆數) rows (顯示的資料)
    Product.findAndCountAll({ offset: PAGE_OFFSET, limit: PAGE_LIMIT }).then(
      products => {
        return Cart.findByPk(req.session.cartId, { include: 'items' }).then(
          cart => {
            // 若 cart 為空值則給它一個空陣列以便增加物品
            cart = cart || { items: [] }
            // 若 items 有東西就取出商品小計並計算總和
            let totalPrice =
              cart.items.length > 0
                ? cart.items
                    .map(d => d.price * d.CartItem.quantity)
                    .reduce((a, b) => a + b)
                : 0
            return res.render('products', {
              products,
              cart,
              totalPrice
            })
          }
        )
      }
    )
  }
}

module.exports = productController
