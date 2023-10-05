const express = require('express');
const { createOrder, fetchOrdersByUser, deleteorder, updateOrder } = require('../controller/Order');

const router = express.Router();

router.post('/', createOrder)
    .get('/', fetchOrdersByUser)
    .delete('/:id', deleteorder)
    .patch('/:id', updateOrder)

exports.router = router;