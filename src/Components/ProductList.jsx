import React from 'react';
import { useGetProductsQuery, useUpdateProductMutation } from '../redux/services/products';
import AddProduct from './AddProduct';

const ProductList = () => {
  const { data: products = [], error, isLoading } = useGetProductsQuery();
  const [localProducts, setLocalProducts] = React.useState(() => {
    // Retrieve products from local storage, if available
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : [];
  });
  const [updateProduct] = useUpdateProductMutation();

  React.useEffect(() => {
    // If backend data is different from local storage, update local state
    if (JSON.stringify(products) !== JSON.stringify(localProducts)) {
      setLocalProducts(products);
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  React.useEffect(() => {
    // Save local products to local storage whenever it changes
    localStorage.setItem('products', JSON.stringify(localProducts));
  }, [localProducts]);

  const handleAddProduct = (newProduct) => {
    setLocalProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleUpdateProduct = async (id, updatedProduct) => {
    try {
      // Update product on the backend
      await updateProduct({ id, ...updatedProduct }).unwrap();
      // Update local products and local storage
      const updatedProducts = localProducts.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      );
      setLocalProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching products: {error.message}</p>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Product List</h1>
        <div className="flex-shrink-0">
          <AddProduct onAddProduct={handleAddProduct} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
        {localProducts.map((product) => (
          <li
            key={product.id}
            className="relative bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl"
          >
            <img src={product.image} alt={product.title} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">{product.title}</h2>
              <p className="text-gray-600 mb-2 capitalize">{product.category}</p>
              <p className="text-xl font-bold mb-2 text-gray-800">${product.price}</p>
              <div className="flex items-center mt-2">
                <span className="font-bold text-gray-900 mr-2">Rating:</span>
                <span className="text-gray-700">{product.rating.rate} ({product.rating.count} reviews)</span>
              </div>
              <button
                onClick={() => handleUpdateProduct(product.id, { price: product.price + 10 })}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-700 transition duration-300"
              >
                Increase Price
              </button>
            </div>
          </li>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
