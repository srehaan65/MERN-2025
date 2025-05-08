const express = require('express')
const mongoose = require('mongoose')
const dbUrl = 'mongodb+srv://srehaan65:ky4PbOVA2V2iR0Qi@cluster0.6blykiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(dbUrl)
    .then(connection => console.log('Connected to MongoDB', connection.connection.host))
    .catch(err => console.error('Error connecting to MongoDB', err))

const app = express();
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded - form data is made available in req body
//express.json() is a middleware - parses incoming json req and makes it avlbl in req.body
//app.use() is a method


const loggerMiddleware = (req, res, next) => {
    console.log(`Logged ${req.url} ${req.method} -- ${new Date().toISOString()}`);
    next();
}
// app.use(loggerMiddleware)

app.get(
    '/', (req, res) => { res.send('Hello, QSR!!') }
)
app.get(
    '/about', (req, res) => { res.send('This is about page!!') }
)
app.post(
    '/data', (req, res) => { console.log('req', req.body); res.send('Received a post request!!') }
)

const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Doe' },]
app.post('/users', (req, res) => {
    const newUser = req.body;
    const userId = users.length + 1;
    newUser.id = userId;
    users.push(newUser)
    res.status(201).json({ message: 'User created!', user: newUser })
})

app.delete('/users/:id', (shifarish, jawab) => {

    const userId = shifarish.params.id;
    const userIndex = users.findIndex(user => user.id == userId)
    if (userIndex == -1) {
        return jawab.status(404).json({ message: "User not found." })
    }

    users.splice(userIndex, 1)
    jawab.json({ message: "User deleted" })
    // res.status(201).json(users.filter(user => user.id !== shifarish.params.id))

})

app.get('/getUsers', loggerMiddleware, (req, res) => {
    res.json(users)
})


app.get('/search', loggerMiddleware, (req, res) => {
    console.log('Query params', req.query)
    res.send('Search page.')
})


// ky4PbOVA2V2iR0Qi

// mongodb+srv://srehaan65:ky4PbOVA2V2iR0Qi@cluster0.6blykiy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

// mongoose.Schema
const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
        unique: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_description: {
        type: String,
        // required: true
    },
    product_category: {
        type: String,
        required: true
    },
    product_rating: {
        type: Number,
        required: true
    },
    product_stock: {
        type: Boolean,
        // required: true,
        default: true
    },
},
    { timestamps: true }
);

const ProductModel = mongoose.model('products', productSchema);

// create a product
app.post('/api/products', async (req, res) => {
    const body = req.body;
    const product = await ProductModel.create({
        product_name: body.product_name,
        product_price: body.product_price,
        product_description: body.product_description,
        product_category: body.product_category,
        product_rating: body.product_rating,
        product_stock: body.product_stock
    })
    console.log('Product created', product)
    res.status(201).json({ message: 'Product created', product })
})

//get all product
app.get('/api/products', async (req, res) => {
    const products = await ProductModel.find()
    // console.log('Products', products)
    res.status(200).json({ message: 'Products fetched', products })
})

//get products by id
app.get('/api/products/:id', async (req, res) => {
    const productId = req.params.id
    const product = await ProductModel.find({ _id: productId })
    if (!product.length) {
        return res.status(404).json({ message: 'Product not found' })
    }
    res.status(200).json({ message: 'Product fetched', product })
})

// update product
app.put('/api/products/:id', async (req, res) => {
    const productId = req.params.id
    const body = req.body
    const product = await ProductModel.findByIdAndUpdate(productId, {
        product_name: body.product_name+'-updated',
        product_price: body.product_price,
        product_description: body.product_description,
        product_category: body.product_category,
        product_rating: body.product_rating,
        product_stock: body.product_stock
    }, { new: true })
    if (!product) {
        return res.status(404).json({ message: 'Product not found' })
    }
    res.status(200).json({ message: 'Product updated', product })
}
)


app.use((req, res) => res.status(404).send("Page not found."))
const port = 4000;
app.listen(port, () => console.log(`Server is running on port ${port}`))