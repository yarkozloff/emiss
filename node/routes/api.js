const express = require('express');
const searchController = require('../controllers/searchController'); // Импорт контроллера

const router = express.Router();

// Определение маршрутов
router.post('/search-by-class', searchController.searchByClass);
router.post('/search-by-codes', searchController.searchByCodes);
router.post('/search-by-fulltext', searchController.searchByFulltext);
router.post('/search-classifier', searchController.searchClassifier);
router.post('/search-codes', searchController.searchCodes);
router.post('/get-methodic', searchController.getMethodic);
router.post('/get-obs', searchController.getObs);

module.exports = router;
