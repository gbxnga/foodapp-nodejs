const express = require('express');

const Food = require('../app/Food');
const router = express.Router();

router.post('/', Food.Create);
router.get('/', Food.List);
router.get('/:id', Food.View); 
router.patch('/:id', Food.Update);
router.delete('/:id', Food.Delete);

module.exports = router;