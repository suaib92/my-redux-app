import React, { useState } from 'react';
import { useAddProductMutation } from '../redux/services/products';

const AddProduct = ({ onAddProduct }) => {
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [rating, setRating] = useState(0);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || price <= 0 || !description || !category || !image || rating <= 0) {
      setFormError('Please enter all fields with valid data.');
      return;
    }

    try {
      const newProduct = {
        title,
        price,
        description,
        category,
        image,
        rating: { rate: rating, count: 0 }
      };
      await addProduct(newProduct).unwrap();
      onAddProduct(newProduct);
      setTitle('');
      setPrice('');
      setDescription('');
      setCategory('');
      setImage('');
      setRating(0);
      setIsDialogOpen(false);
    } catch (err) {
      setFormError('Failed to add product. Please try again.');
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={() => setIsDialogOpen(true)}
        className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300">
        Add Product
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Add Product</h2>
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Product Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Product Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
              <input
                type="text"
                placeholder="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Product Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Product Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Product Rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-gray-300 text-black py-2 px-4 rounded-md shadow-md hover:bg-gray-400 transition duration-300">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                  disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
