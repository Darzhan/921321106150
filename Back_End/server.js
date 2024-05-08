const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid'); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

function generateUniqueId() {
    return uuidv4(); 
}

app.get('/categories/:categoryname/products', async (req, res) => {
    const { companyname, categoryname } = req.params;
    const { top, minPrice, maxPrice, sort } = req.query;

    try {
        const response = await axios.get(`http://20.244.56.144/test/companies/${companyname}/categories/${categoryname}/products`, {
            params: { top, minPrice, maxPrice, sort }
        });

        const formattedData = response.data.map(product => ({
            id: generateUniqueId(),
            productName: product.productName,
            price: product.price,
            rating: product.rating,
            discount: product.discount,
            availability: product.availability
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error fetching products:', error.response?.data ?? error.message);
        res.status(error.response?.status || 500).json({ error: error.response?.data?.message ?? 'Internal Server Error' });
    }
});

app.get('/categories/:categoryname/products/:productid', async (req, res) => {
    const { companyname, categoryname, productid } = req.params;

    try {
        const response = await axios.get(`http://20.244.56.144/test/companies/${companyname}/categories/${categoryname}/products/${productid}`);

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching product details:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


