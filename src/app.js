const express = require('express');
const PORT = 8080;
const app = express();
const { ProductManager } = require('./productManager');

const productManager = new ProductManager('../productos.txt');

app.use(express.urlencoded({ extended: true }));

app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const productsList = await productManager.getProducts();
    const productsListParced = JSON.parse(productsList);
    if (limit) {
      const productsLimit = productsListParced.slice(0, limit);
      return res.send(productsLimit);
    } else {
      res.send(productsListParced);
    }
  } catch (error) {
    console.log(error);
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const paramsID = parseInt(req.params.id);
    const productId = await productManager.getProductById(paramsID);
    console.log('productID:' + productId);
    if (productId) {
      const productIDParced = JSON.parse(productId);
      return res.send(productIDParced);
    } else {
      return res.send('no se econtro el producto con el ' + paramsID);
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
