const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const Sale = require('../models/salesModel');

// GET Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        // --- Total Inventory Value ---
        const inventoryValueResult = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: { $sum: { $multiply: ["$price", "$quantity"] } }
                }
            }
        ]);
        const totalInventoryValue = inventoryValueResult.length > 0 ? inventoryValueResult[0].totalValue : 0;

        // --- Daily Sales ---
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dailySalesResult = await Sale.aggregate([
            {
                $match: {
                    createdAt: { $gte: today, $lt: tomorrow }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$totalAmount" }
                }
            }
        ]);
        const dailySales = dailySalesResult.length > 0 ? dailySalesResult[0].totalSales : 0;

        // --- Monthly Sales (Last 30 days) ---
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const monthlySales = await Sale.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { _id: 1 } // Sort by date
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    sales: "$totalSales"
                }
            }
        ]);

        res.status(200).json({
            totalInventoryValue,
            dailySales,
            monthlySales
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;