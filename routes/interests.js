const express = require('express');
const router = express.Router();
const { 
    getInterestCategories, 
    getSubcategories, 
    getAllInterests 
} = require('../controllers/interestController');

// Get all interest categories
router.get('/categories', getInterestCategories);

// Get subcategories for a specific interest
router.get('/categories/:category', getSubcategories);

// Get all interests with their subcategories
router.get('/', getAllInterests);

module.exports = router; 