const express = require('express');
const { createOrder, fetchOrdersByUser, deleteorder, updateOrder, fetchAllorders } = require('../controller/Order');

const router = express.Router();

router.post('/', createOrder)
    .get('/own', fetchOrdersByUser)
    .delete('/:id', deleteorder)
    .patch('/:id', updateOrder)
    .get('/', fetchAllorders)

exports.router = router;