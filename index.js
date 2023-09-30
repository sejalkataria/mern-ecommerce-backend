const express = require('express');
require('dotenv').config();
const server = express();
const mongoose = require('mongoose');
const { createProduct } = require('./controller/Product');
const productsRouter = require('./routes/Products');
const categoriesRouter = require('./routes/Category');
const brandsRouters = require('./routes/Brands');
const cors = require('cors');

const PORT = process.env.PORT;

server.use(cors({
    exposedHeaders: ['X-Total-Count']
}))
//middlewares
server.use(express.json()) //to parse req.body

server.use('/products', productsRouter.router);
server.use('/categories', categoriesRouter.router);
server.use('/brands', brandsRouters.router);

main().catch(err => console.log(err))

async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('database connected!')
}


server.get('/', (req, res) => {
    res.json({ status: 'success' })
})

server.listen(PORT, () => {
    console.log('server started on', PORT)
})