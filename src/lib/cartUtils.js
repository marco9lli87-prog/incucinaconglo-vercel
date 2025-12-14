export function mapCartToLineItems(cart) {
  return cart.map(item => ({
    name: item.product.name,
    price: item.product.price,
    quantity: item.qty
  }))
}
