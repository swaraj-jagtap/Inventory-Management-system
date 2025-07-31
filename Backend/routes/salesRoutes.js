const express = require('express');
const router = express.Router();
const Sale = require('../models/salesModel');
const Product = require('../models/productModel');

// POST a new sale
router.post('/', async (req, res) => {
  const { customer, items, totalAmount } = req.body;

  try {
    // 1. Create the sale record
    const newSale = new Sale({ customer, items, totalAmount });
    await newSale.save();

    // 2. Update product quantities
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity }
      });
    }

    res.status(201).json({ message: 'Sale recorded successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;