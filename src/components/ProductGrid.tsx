import React, { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { Product, NewProduct } from '../types/product';
import SearchBar from './SearchBar';
import ProductForm from './ProductForm';
import { INITIAL_PRODUCTS } from '../data/products';

type ProductGridProps = {
  onProductSelect: (product: Product) => void;
};

const ProductGrid: React.FC<ProductGridProps> = ({ onProductSelect }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    price: 0,
    image: '',
    category: ''
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category) return;

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      image: newProduct.image || 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=200&h=200',
      category: newProduct.category,
      description: newProduct.description
    };

    setProducts(prev => [...prev, product]);
    setNewProduct({ name: '', price: 0, image: '', category: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-starbucks-green rounded-lg text-white hover:bg-starbucks-green-light transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`btn-category ${!selectedCategory ? 'active' : 'inactive'}`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`btn-category ${selectedCategory === category ? 'active' : 'inactive'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => onProductSelect(product)}
            className="product-card group"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 rounded-lg transition-colors" />
            </div>
            <h3 className="font-medium text-sm text-white/90">{product.name}</h3>
            <p className="text-starbucks-gold font-medium">${product.price.toFixed(2)}</p>
            <span className="text-xs text-white/60">{product.category}</span>
          </button>
        ))}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-starbucks-green-dark p-6 rounded-xl shadow-xl max-w-md w-full border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Add New Product</h2>
              <button onClick={() => setShowAddForm(false)} className="text-white/60 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <ProductForm
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              onSubmit={handleAddProduct}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;