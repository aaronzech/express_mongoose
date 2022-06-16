const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


const mongoose = require('mongoose'); // Request the mongoose NPM package
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true}) // test database, if it doesn't exisit it will make one
// Sucessful connection
.then(() =>{
    console.log(" MONGO connection open");
})
// If connection error
.catch(err=>{
    console.log("Error on MONGO");
    console.log(err);
})


const categories = ['fruit','vegetable','dairy']

app.get('/products',async(req,res) =>{
    const {category} = req.query;
    if(category){
        const products = await Product.find({category: category})
        res.render('products/index',{products,category})
    }else{
        const products = await Product.find({})
        res.render('products/index',{products,category: 'All'})
    }
})

app.get('/products/new', (req, res) => {
    res.render('products/new',{categories})
})

app.post('/products', async (req, res) => {
    
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
})

// Go to edit page
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product,categories})
})

// Proccess the Edit
app.put('/products/:id', async (req, res) => {
    //res.send("PUTTT");
    //console.log(req.body);
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`);
})


app.get('/products/:id',async(req,res) =>{
    const {id} = req.params;
    const product = await Product.findById(id);
    console.log(product);
    res.render('products/show',{product})
})

// Delete
app.delete('/products/:id',async(req,res) =>{
    const {id} = req.params;
    // Delete in DB
    const deltedProduct = await Product.findByIdAndDelete(id)
    res.redirect(`/products/${product._id}`);
})

app.listen(3000,() =>{
    console.log("app is listenning");
})