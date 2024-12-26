import React from 'react';
import { PRODUCT_CATEGORIES } from '../data/categories';
import { NewProduct } from '../types/product';
import ImageGenerator from './ImageGenerator';

type ProductFormProps = {
  newProduct: NewProduct;
  setNewProduct: React.Dispatch<React.SetStateAction<NewProduct>>;
  onSubmit: (e: React.FormEvent) => void;
};

const ProductForm: React.FC<ProductFormProps> = ({
  newProduct,
  setNewProduct,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-white/60 mb-1">Item name</label>
        <input
          type="text"
          value={newProduct.name || ''}
          onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
          className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
          required
          placeholder="Enter item name"
        />
      </div>
      
      <div>
        <label className="block text-sm text-white/60 mb-1">Price</label>
        <input
          type="number"
          step="0.01"
          value={newProduct.price || ''}
          onChange={e => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
          className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
          required
          placeholder="0.00"
        />
      </div>
      
      <div>
        <label className="block text-sm text-white/60 mb-1">Category</label>
        <select
          value={newProduct.category || ''}
          onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
          className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
          required
        >
          <option value="">Select a category</option>
          {PRODUCT_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">Description (optional)</label>
        <textarea
          value={newProduct.description || ''}
          onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
          className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white"
          rows={3}
          placeholder="Enter product description"
        />
      </div>

      <div>
        <label className="block text-sm text-white/60 mb-1">Product Image</label>
        <ImageGenerator
          productName={newProduct.name || ''}
          category={newProduct.category || ''}
          description={newProduct.description}
          onImageGenerated={(imageUrl) => setNewProduct(prev => ({ ...prev, image: imageUrl }))}
        />
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="flex-1 bg-starbucks-green hover:bg-starbucks-green-light text-white py-2 rounded-lg transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ProductForm;