const recordStockMovement = async (connection, {
  productId,
  userId = null,
  movementType,
  quantity,
  previousStock,
  newStock,
  reason = null,
}) => {
  await connection.execute(
    `INSERT INTO stock_movements
      (product_id, user_id, movement_type, quantity, previous_stock, new_stock, reason)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [productId, userId, movementType, quantity, previousStock, newStock, reason || null],
  );
};

module.exports = { recordStockMovement };
