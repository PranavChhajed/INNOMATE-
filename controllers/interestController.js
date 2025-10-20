const interests = require('../config/interests');

// Get all interest categories
exports.getInterestCategories = (req, res) => {
    try {
        const categories = Object.keys(interests).map(key => ({
            id: key,
            name: interests[key].name
        }));

        res.json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Error fetching interest categories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interest categories'
        });
    }
};

// Get subcategories for a specific interest
exports.getSubcategories = (req, res) => {
    try {
        const { category } = req.params;
        
        if (!interests[category]) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            category: interests[category].name,
            subcategories: interests[category].subcategories
        });
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subcategories'
        });
    }
};

// Get all interests with their subcategories
exports.getAllInterests = (req, res) => {
    try {
        res.json({
            success: true,
            interests
        });
    } catch (error) {
        console.error('Error fetching all interests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching interests'
        });
    }
}; 