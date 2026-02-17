const PRODUCTS_KEY = "products";

const getProducts = () => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveProducts = (products) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

const addProduct = (product) => {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
};


const getProductById = (id) => {
  return getProducts().find(p => p.id === id);
}

export default {
  getProducts,
  addProduct,
  getProductById
};