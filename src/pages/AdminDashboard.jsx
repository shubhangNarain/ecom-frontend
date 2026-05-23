import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../lib/config';
import { 
  ShoppingBag, DollarSign, Package, AlertCircle, Loader, 
  Trash2, Plus, X, ChevronDown, ChevronUp, RefreshCw, 
  FileText, Tag, Check, LayoutDashboard, Truck, ClipboardList, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Protect Admin route
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=admin');
    } else if (user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'addProduct'

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Inventory State
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('all');
  const [inventoryStockFilter, setInventoryStockFilter] = useState('all'); // 'all' | 'instock' | 'lowstock' | 'out'
  const [updatingProductId, setUpdatingProductId] = useState(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: 'Audio',
    price: '',
    oldPrice: '',
    tag: '',
    image: '',
    description: '',
    qty: 0,
  });
  const [editProductFeatures, setEditProductFeatures] = useState('');
  const [editProductSpecs, setEditProductSpecs] = useState([{ key: '', value: '' }]);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editMessage, setEditMessage] = useState({ type: '', text: '' });
  const [isUploadingAddImage, setIsUploadingAddImage] = useState(false);
  const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);

  // Stats State
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeOrders: 0,
    totalProducts: 0
  });

  // Add Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Audio',
    price: '',
    oldPrice: '',
    tag: '',
    image: '',
    description: '',
    qty: 0,
  });
  const [productFeatures, setProductFeatures] = useState('');
  const [productSpecs, setProductSpecs] = useState([{ key: '', value: '' }]);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [productMessage, setProductMessage] = useState({ type: '', text: '' });

  // Fetch Data
  const fetchData = async () => {
    setOrdersLoading(true);
    setOrdersError('');
    try {
      const token = localStorage.getItem('token');
      
      // Fetch Orders
      const ordersRes = await fetch(`${API_BASE_URL}/api/v1/admin/orders?limit=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();
      if (!ordersRes.ok) throw new Error(ordersData.message || 'Failed to fetch admin orders');

      const fetchedOrders = ordersData.orders || [];
// Normalize orders to support both old and new backend order schemas
      const normalizedOrders = fetchedOrders.map((order) => {
        // Handle items mapping safely supporting both schemas
        const items = (order.items || []).map((item) => ({
          product: item.product || item.id || item._id,
          title: item.title || item.name || 'Unknown Item',
          thumbnail: item.thumbnail || item.image || '',
          price: typeof item.price === 'number' 
            ? item.price 
            : parseFloat(String(item.price || '0').replace(/,/g, '')),
          quantity: item.quantity || 1,
          subtotal: item.subtotal || (parseFloat(String(item.price || '0').replace(/,/g, '')) * (item.quantity || 1))
        }));

        // Handle shippingAddress safely supporting both schemas
        const shippingAddress = {
          fullName: order.shippingAddress?.fullName || order.shippingAddress?.name || 'Guest Customer',
          phone: order.shippingAddress?.phone || '',
          street: order.shippingAddress?.street || order.shippingAddress?.address || '',
          city: order.shippingAddress?.city || '',
          postalCode: order.shippingAddress?.postalCode || order.shippingAddress?.zip || '',
          country: order.shippingAddress?.country || ''
        };

        // Handle payment safely supporting both schemas
        const payment = {
          method: order.payment?.method || 'cod',
          status: order.payment?.status || 'pending',
          razorpayPaymentId: order.payment?.razorpayPaymentId || order.paymentId || 'N/A'
        };

        // Normalize status to lowercase for comparison, but preserve exact for UI display
        const status = (order.status || 'pending').toLowerCase();

        return {
          ...order,
          _id: order._id,
          createdAt: order.createdAt,
          status,
          items,
          shippingAddress,
          payment,
          itemsTotal: order.itemsTotal || items.reduce((sum, i) => sum + i.subtotal, 0),
          shippingCharge: order.shippingCharge || 0,
          discount: order.discount || 0,
          grandTotal: order.grandTotal || order.amount || items.reduce((sum, i) => sum + i.subtotal, 0),
          user: order.user || { name: shippingAddress.fullName, email: order.shippingAddress?.email || '' }
        };
      });

      setOrders(normalizedOrders);

      // Fetch Products
      const productsRes = await fetch(`${API_BASE_URL}/api/v1/products?limit=1000`);
      const productsData = await productsRes.json();
      const fetchedProducts = productsData.products || (Array.isArray(productsData) ? productsData : []);
      setInventoryProducts(fetchedProducts);
      const productsCount = productsData.total || fetchedProducts.length || 0;

      // Calculate Stats
      const totalRevenue = normalizedOrders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

      const activeOrders = normalizedOrders
        .filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status))
        .length;

      setStats({
        totalRevenue,
        totalOrders: normalizedOrders.length,
        activeOrders,
        totalProducts: productsCount
      });

    } catch (err) {
      setOrdersError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  // Update Order Status
  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update order status');

      // Refresh data
      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action is permanent.')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete order');

      // Refresh data
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle Add Product Inputs
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle Specs Inputs
  const handleSpecChange = (index, field, val) => {
    const updatedSpecs = [...productSpecs];
    updatedSpecs[index][field] = val;
    setProductSpecs(updatedSpecs);
  };

  const addSpecRow = () => {
    setProductSpecs([...productSpecs, { key: '', value: '' }]);
  };

  const removeSpecRow = (index) => {
    setProductSpecs(productSpecs.filter((_, idx) => idx !== index));
  };

  // Submit Product Form
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setProductSubmitting(true);
    setProductMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');

      // Process features array
      const features = productFeatures
        .split(',')
        .map(f => f.trim())
        .filter(Boolean);

      // Process specs map object
      const specs = {};
      productSpecs.forEach(s => {
        if (s.key.trim() && s.value.trim()) {
          specs[s.key.trim()] = s.value.trim();
        }
      });

      const payload = {
        ...productForm,
        price: String(productForm.price),
        oldPrice: productForm.oldPrice ? String(productForm.oldPrice) : undefined,
        qty: Number(productForm.qty),
        features,
        specs
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add product');

      // Success
      setProductMessage({ type: 'success', text: `Product "${data.name}" created successfully with ID: ${data.id}!` });
      
      // Reset form
      setProductForm({
        name: '',
        category: 'Audio',
        price: '',
        oldPrice: '',
        tag: '',
        image: '',
        description: '',
        qty: 0,
      });
      setProductFeatures('');
      setProductSpecs([{ key: '', value: '' }]);
      
      // Refresh count
      fetchData();
    } catch (err) {
      setProductMessage({ type: 'error', text: err.message });
    } finally {
      setProductSubmitting(false);
    }
  };

  // Quick Stock Quantity Update (PATCH request to save changes immediately)
  const handleUpdateQty = async (productId, newQty) => {
    if (newQty < 0) return;
    setUpdatingProductId(productId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ qty: Number(newQty) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update product quantity');

      // Update local state directly to prevent double-flickering before a sync
      setInventoryProducts(prev => 
        prev.map(p => p._id === productId ? { ...p, qty: Number(newQty) } : p)
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingProductId(null);
    }
  };

  // Delete Product (DELETE request)
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action is permanent.')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete product');

      // Success feedback
      alert('Product deleted successfully.');
      // Refresh data to update total statistics and table records
      await fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Open Edit Product Modal and parse specs map and highlights
  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || '',
      category: product.category || 'Audio',
      price: product.price || '',
      oldPrice: product.oldPrice || '',
      tag: product.tag || '',
      image: product.image || '',
      description: product.description || '',
      qty: product.qty || 0,
    });
    setEditProductFeatures(Array.isArray(product.features) ? product.features.join(', ') : '');
    
    // Parse specs map object back to array rows [{key, value}]
    const specRows = [];
    if (product.specs) {
      const specsObj = product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs;
      Object.entries(specsObj).forEach(([key, value]) => {
        specRows.push({ key, value });
      });
    }
    setEditProductSpecs(specRows.length > 0 ? specRows : [{ key: '', value: '' }]);
    setEditMessage({ type: '', text: '' });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSpecChange = (index, field, val) => {
    const updatedSpecs = [...editProductSpecs];
    updatedSpecs[index][field] = val;
    setEditProductSpecs(updatedSpecs);
  };

  const addEditSpecRow = () => {
    setEditProductSpecs([...editProductSpecs, { key: '', value: '' }]);
  };

  const removeEditSpecRow = (index) => {
    setEditProductSpecs(editProductSpecs.filter((_, idx) => idx !== index));
  };

  // Submit Product Form updates (PUT request)
  const handleSaveProductEdit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');

      // Process features array
      const features = editProductFeatures
        .split(',')
        .map(f => f.trim())
        .filter(Boolean);

      // Process specs map object
      const specs = {};
      editProductSpecs.forEach(s => {
        if (s.key.trim() && s.value.trim()) {
          specs[s.key.trim()] = s.value.trim();
        }
      });

      const payload = {
        ...editForm,
        price: String(editForm.price),
        oldPrice: editForm.oldPrice ? String(editForm.oldPrice) : undefined,
        qty: Number(editForm.qty),
        features,
        specs
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/admin/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save product changes');

      setEditMessage({ type: 'success', text: 'Product updated successfully!' });
      
      // Close modal after short delay
      setTimeout(() => {
        setEditingProduct(null);
      }, 800);

      // Sync dashboard data
      await fetchData();
    } catch (err) {
      setEditMessage({ type: 'error', text: err.message });
    } finally {
      setEditSubmitting(false);
    }
  };

  // Upload Product Image to Cloudinary via backend upload API
  const handleImageUpload = async (e, formType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (formType === 'add') {
      setIsUploadingAddImage(true);
    } else {
      setIsUploadingEditImage(true);
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/api/v1/admin/products/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Image upload failed');

      if (formType === 'add') {
        setProductForm(prev => ({ ...prev, image: data.url }));
      } else {
        setEditForm(prev => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      alert(err.message);
    } finally {
      if (formType === 'add') {
        setIsUploadingAddImage(false);
      } else {
        setIsUploadingEditImage(false);
      }
    }
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const filteredProducts = inventoryProducts.filter((product) => {
    const nameMatches = (product.name || '').toLowerCase().includes(inventorySearch.toLowerCase()) ||
                        (product.category || '').toLowerCase().includes(inventorySearch.toLowerCase());
    
    const categoryMatches = inventoryCategory === 'all' || product.category === inventoryCategory;

    let stockMatches = true;
    if (inventoryStockFilter === 'out') {
      stockMatches = product.qty === 0;
    } else if (inventoryStockFilter === 'lowstock') {
      stockMatches = product.qty > 0 && product.qty < 10;
    } else if (inventoryStockFilter === 'instock') {
      stockMatches = product.qty >= 10;
    }

    return nameMatches && categoryMatches && stockMatches;
  });

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-24 selection:bg-accent selection:text-black">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Page Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="font-display font-black text-4xl text-black uppercase tracking-tight flex items-center gap-3">
              <LayoutDashboard className="text-black" size={36} /> Admin Control
            </h1>
            <p className="text-gray-400 text-sm mt-1">Monitor sales data, update shipment status, and expand catalog inventories.</p>
          </div>
          <button 
            onClick={fetchData}
            className="self-start md:self-center bg-white border border-gray-100 hover:border-black p-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 font-display font-bold text-xs uppercase tracking-wider text-black"
          >
            <RefreshCw size={14} className={ordersLoading ? 'animate-spin' : ''} /> Sync Systems
          </button>
        </div>

        {/* System Overview Stats Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="flex justify-between items-start">
              <span className="font-display font-black text-4xl text-black select-all">
                ${stats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-accent/20 flex items-center justify-center text-black">
                <DollarSign size={20} />
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold text-xs uppercase text-gray-400 tracking-wider">Gross Revenue</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Sum of completed (delivered) orders</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="flex justify-between items-start">
              <span className="font-display font-black text-4xl text-black">
                {stats.totalOrders}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-black text-accent flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold text-xs uppercase text-gray-400 tracking-wider">Total Orders</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Registered purchases in database</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="flex justify-between items-start">
              <span className="font-display font-black text-4xl text-black">
                {stats.activeOrders}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck size={20} />
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold text-xs uppercase text-gray-400 tracking-wider">Active Shipments</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Pending delivery processing cycles</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="flex justify-between items-start">
              <span className="font-display font-black text-4xl text-black">
                {stats.totalProducts}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-accent text-black flex items-center justify-center font-bold">
                <Package size={20} />
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold text-xs uppercase text-gray-400 tracking-wider">Store Catalog</h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Active retail SKUs online</p>
            </div>
          </div>

        </div>

        {/* Tab Selector Navs */}
        <div className="flex border-b border-gray-100 mb-8 gap-8 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 font-display font-bold text-sm uppercase tracking-widest transition-all relative whitespace-nowrap ${
              activeTab === 'orders' ? 'text-black font-extrabold' : 'text-gray-400 hover:text-black'
            }`}
          >
            Orders Administration
            {activeTab === 'orders' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-4 font-display font-bold text-sm uppercase tracking-widest transition-all relative whitespace-nowrap ${
              activeTab === 'inventory' ? 'text-black font-extrabold' : 'text-gray-400 hover:text-black'
            }`}
          >
            Catalog Inventory
            {activeTab === 'inventory' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('addProduct')}
            className={`pb-4 font-display font-bold text-sm uppercase tracking-widest transition-all relative whitespace-nowrap ${
              activeTab === 'addProduct' ? 'text-black font-extrabold' : 'text-gray-400 hover:text-black'
            }`}
          >
            Add New SKU
            {activeTab === 'addProduct' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
        </div>

        {/* Tab Contents: Orders Administration */}
        {activeTab === 'orders' && (
          <div>
            {/* Status Filter Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl font-display font-bold text-[10px] uppercase tracking-wider transition-all border ${
                    statusFilter === status 
                      ? 'bg-black text-white border-black shadow-sm' 
                      : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Loader className="animate-spin text-black mb-4" size={32} />
                <p className="font-display font-bold text-gray-500 text-sm">Retrieving store orders data feed...</p>
              </div>
            ) : ordersError ? (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h3 className="font-display font-bold text-lg mb-2">Sync Connection Failure</h3>
                <p className="text-gray-500 text-sm mb-6">{ordersError}</p>
                <button
                  onClick={fetchData}
                  className="bg-black text-white px-6 py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider hover:bg-accent hover:text-black transition-all"
                >
                  Retry API Sync
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <ClipboardList className="text-gray-300 mb-4" size={56} />
                <h3 className="font-display font-bold text-lg text-black uppercase tracking-wider mb-2">No Matching Orders</h3>
                <p className="text-gray-400 text-xs max-w-xs leading-relaxed">No store orders found matching the chosen criteria filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isExpanded = expandedOrderId === order._id;
                  const isStatusUpdating = updatingOrderId === order._id;

                  return (
                    <div 
                      key={order._id}
                      className="bg-white rounded-3xl border border-gray-100 hover:border-gray-200 shadow-sm overflow-hidden transition-all duration-300"
                    >
                      {/* Top collapsed display row */}
                      <div 
                        onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                        className="p-6 cursor-pointer flex flex-wrap gap-4 items-center justify-between hover:bg-gray-50/50"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center shrink-0">
                            <ShoppingBag className="text-gray-400" size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-display font-black text-sm uppercase select-all text-black">
                                #{order._id.substring(order._id.length - 8).toUpperCase()}
                              </span>
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusStyle(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium mt-1">
                              Customer: <span className="font-bold text-gray-600">{order.user?.name || 'Guest'}</span> &middot; {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Grand Total</p>
                            <p className="font-display font-black text-sm text-black">
                              ${order.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrder(order._id);
                              }}
                              className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center border border-rose-100"
                              title="Delete Order"
                            >
                              <Trash2 size={15} />
                            </button>
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expansions panel showing deep order data */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="border-t border-gray-50 overflow-hidden"
                          >
                            <div className="p-8 bg-gray-50/20 grid grid-cols-1 lg:grid-cols-12 gap-8">
                              
                              {/* Left side: Order contents */}
                              <div className="lg:col-span-7 space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                  <ClipboardList size={14} /> Line Items List ({order.items?.length || 0})
                                </h3>

                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 divide-y divide-gray-50">
                                  {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                      <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                                        <img src={item.thumbnail} alt={item.title} className="w-9 h-9 object-contain" />
                                      </div>
                                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <div>
                                          <h4 className="font-display font-bold text-xs uppercase text-black line-clamp-1">{item.title}</h4>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">SKU ID: {item.product}</p>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1">
                                          <span>Qty: {item.quantity} &middot; ${item.price?.toLocaleString()} each</span>
                                          <span className="font-display font-bold text-xs text-black">${item.subtotal?.toLocaleString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Address delivery specifications */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                    <h4 className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-3">Delivery Destination</h4>
                                    <p className="text-xs font-bold text-black">{order.shippingAddress?.fullName}</p>
                                    <p className="text-xs text-gray-500 mt-1">{order.shippingAddress?.street}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{order.shippingAddress?.country}</p>
                                    <p className="text-xs text-gray-500 font-bold mt-2">📞 {order.shippingAddress?.phone}</p>
                                  </div>

                                  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                                    <div>
                                      <h4 className="text-[9px] font-black uppercase tracking-wider text-gray-400 mb-3">Billing System</h4>
                                      <div className="flex justify-between text-xs text-gray-500 py-0.5">
                                        <span>Subtotal:</span>
                                        <span className="font-medium text-black">${order.itemsTotal?.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between text-xs text-gray-500 py-0.5">
                                        <span>Shipping Fee:</span>
                                        <span className="font-medium text-black">${order.shippingCharge?.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between text-xs text-gray-500 py-0.5 text-green-600 font-semibold">
                                        <span>Discount:</span>
                                        <span>-${order.discount?.toLocaleString()}</span>
                                      </div>
                                    </div>
                                    <div className="border-t border-gray-50 pt-3 mt-3 flex justify-between items-end">
                                      <span className="font-display font-bold text-[10px] text-gray-400 uppercase">Paid:</span>
                                      <span className="font-display font-black text-base text-black">${order.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right side: Control systems */}
                              <div className="lg:col-span-5 space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                  <LayoutDashboard size={14} /> Workflow Actions
                                </h3>

                                {/* Status control workflow cards */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
                                  <div>
                                    <label className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Advance Shipment Status</label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                                        <button
                                          key={st}
                                          disabled={isStatusUpdating || order.status === st}
                                          onClick={() => handleUpdateStatus(order._id, st)}
                                          className={`py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 ${
                                            order.status === st
                                              ? 'bg-black text-white border-black'
                                              : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-100 disabled:opacity-50'
                                          }`}
                                        >
                                          {order.status === st && <Check size={11} />}
                                          {st}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="border-t border-gray-50 pt-4">
                                    <label className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-1.5">Payment Authentication</label>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                      <div>
                                        <p className="text-[10px] font-bold text-black uppercase">{order.payment?.method || 'cod'}</p>
                                        <p className="text-[9px] text-gray-400 font-mono mt-0.5 truncate max-w-[200px]">{order.payment?.razorpayPaymentId || 'Cash on Delivery'}</p>
                                      </div>
                                      <span className={`text-[8.5px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                        order.payment?.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                      }`}>
                                        {order.payment?.status || 'pending'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="border-t border-gray-50 pt-4 text-[10px] text-gray-400 font-medium space-y-1">
                                    <p>Database reference ID: <span className="font-mono text-gray-600 select-all">{order._id}</span></p>
                                    <p>Customer reference ID: <span className="font-mono text-gray-600 select-all">{order.user?._id || order.userId || 'N/A'}</span></p>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab Contents: Add New SKU */}
        {activeTab === 'addProduct' && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="font-display font-black text-xl text-black uppercase tracking-tight mb-8 flex items-center gap-2">
              <Plus className="text-black" size={24} /> Create Store Product Listing
            </h2>

            {productMessage.text && (
              <div className={`mb-6 p-4 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${
                productMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {productMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                {productMessage.text}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-8">
              
              {/* Product information card */}
              <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <ClipboardList size={14} /> Catalog Data Specs
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Product Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={productForm.name}
                      onChange={handleFormChange}
                      placeholder="e.g. FitPulse Smartwatch"
                      className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={productForm.category}
                      onChange={handleFormChange}
                      className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                    >
                      <option>Audio</option>
                      <option>Wearables</option>
                      <option>Computers</option>
                      <option>Photography</option>
                      <option>Gaming</option>
                      <option>Mobile</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="qty" className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Inventory Stock Level *</label>
                    <input
                      type="number"
                      id="qty"
                      name="qty"
                      required
                      min="0"
                      value={productForm.qty}
                      onChange={handleFormChange}
                      placeholder="e.g. 50"
                      className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Retail Price ($USD) *</label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      required
                      value={productForm.price}
                      onChange={handleFormChange}
                      placeholder="e.g. 199"
                      className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                    />
                  </div>

                  <div>
                    <label htmlFor="oldPrice" className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Original Price (Strikeout - optional)</label>
                    <input
                      type="text"
                      id="oldPrice"
                      name="oldPrice"
                      value={productForm.oldPrice}
                      onChange={handleFormChange}
                      placeholder="e.g. 249"
                      className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                    />
                  </div>

                  <div>
                    <label htmlFor="tag" className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Catalog Tag (optional)</label>
                    <select
                      id="tag"
                      name="tag"
                      value={productForm.tag}
                      onChange={handleFormChange}
                      className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                    >
                      <option value="">No Tag</option>
                      <option value="New">New</option>
                      <option value="Sale">Sale</option>
                      <option value="Hot">Hot</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Media description details */}
              <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <FileText size={14} /> Description & Display media
                </h3>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="image" className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Product Image Cloudinary/Static URL *</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <input
                        type="url"
                        id="image"
                        name="image"
                        required
                        value={productForm.image}
                        onChange={handleFormChange}
                        placeholder="e.g. https://res.cloudinary.com/..."
                        className="flex-1 w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                      />
                      
                      <div className="relative shrink-0 w-full sm:w-auto">
                        <input
                          type="file"
                          id="file-upload-add"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'add')}
                          className="hidden"
                          disabled={isUploadingAddImage}
                        />
                        <label
                          htmlFor="file-upload-add"
                          className="cursor-pointer w-full justify-center bg-black text-white hover:bg-accent hover:text-black py-3 px-5 rounded-xl font-display font-bold text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                        >
                          {isUploadingAddImage ? (
                            <>
                              <Loader className="animate-spin" size={12} /> Uploading...
                            </>
                          ) : (
                            <>
                              <Plus size={12} /> Upload File
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                    {productForm.image && (
                      <div className="mt-4 w-24 h-24 bg-white border border-gray-100 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                        <img src={productForm.image} alt="Preview" className="w-20 h-20 object-contain" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Invalid+Image'; }} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Description Summary *</label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows="4"
                      value={productForm.description}
                      onChange={handleFormChange}
                      placeholder="Provide a detailed, compelling summary of the product's value proposition..."
                      className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Features and tech specs cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                        <Tag size={14} /> Bullet Features List
                      </h3>
                      <HelpCircle size={14} className="text-gray-300" title="Separate items with commas" />
                    </div>
                    <label htmlFor="features" className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2 font-medium">Highlight Bullet Features (Comma Separated)</label>
                    <textarea
                      id="features"
                      rows="5"
                      value={productFeatures}
                      onChange={(e) => setProductFeatures(e.target.value)}
                      placeholder="e.g. Heart Rate Monitor, GPS Tracking, Water Resistant, Sleep Analysis"
                      className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 leading-normal mt-3">These highlights will show up as bulleted specs on the product information details sheet.</p>
                </div>

                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <ClipboardList size={14} /> Technical Specifications
                    </h3>
                    <button
                      type="button"
                      onClick={addSpecRow}
                      className="bg-black hover:bg-accent hover:text-black text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                    >
                      <Plus size={10} /> Add spec
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {productSpecs.map((spec, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Spec Name (e.g. Weight)"
                          value={spec.key}
                          onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                          className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:border-black font-semibold text-black"
                        />
                        <input
                          type="text"
                          placeholder="Spec Value (e.g. 250g)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                          className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:border-black font-semibold text-black"
                        />
                        {productSpecs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSpecRow(index)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-rose-100 transition-colors"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                disabled={productSubmitting}
                className="w-full bg-black text-white py-5 rounded-2xl font-display font-bold text-sm uppercase tracking-[0.2em] hover:bg-accent hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {productSubmitting ? (
                  <>
                    <Loader className="animate-spin" size={18} /> Cataloging Product SKU...
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Publish SKU to Catalog
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab Contents: Catalog Inventory */}
        {activeTab === 'inventory' && (
          <div>
            {/* Catalog Filter Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search catalog products..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full bg-gray-50 border-none hover:bg-gray-100/50 rounded-xl py-3 px-4 text-xs focus:ring-2 focus:ring-black outline-none font-semibold text-black transition-all"
                />
              </div>

              {/* Filters dropdown */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={inventoryCategory}
                  onChange={(e) => setInventoryCategory(e.target.value)}
                  className="bg-gray-50 border-none hover:bg-gray-100/50 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-black outline-none font-semibold text-black cursor-pointer transition-all"
                >
                  <option value="all">All Categories</option>
                  <option value="Audio">Audio</option>
                  <option value="Wearables">Wearables</option>
                  <option value="Computers">Computers</option>
                  <option value="Photography">Photography</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Mobile">Mobile</option>
                </select>

                <select
                  value={inventoryStockFilter}
                  onChange={(e) => setInventoryStockFilter(e.target.value)}
                  className="bg-gray-50 border-none hover:bg-gray-100/50 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-black outline-none font-semibold text-black cursor-pointer transition-all"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="instock">In Stock (10+)</option>
                  <option value="lowstock">Low Stock (Under 10)</option>
                  <option value="out">Out of Stock (0)</option>
                </select>
              </div>
            </div>

            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Loader className="animate-spin text-black mb-4" size={32} />
                <p className="font-display font-bold text-gray-500 text-sm">Retrieving catalog products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                <Package className="text-gray-300 mb-4" size={56} />
                <h3 className="font-display font-bold text-lg text-black uppercase tracking-wider mb-2">No Matching Products</h3>
                <p className="text-gray-400 text-xs max-w-xs leading-relaxed">No products found matching search query or chosen filter criteria.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-6 font-display font-bold text-[10px] uppercase tracking-wider text-gray-400">Product Info</th>
                      <th className="p-6 font-display font-bold text-[10px] uppercase tracking-wider text-gray-400">SKU / ID</th>
                      <th className="p-6 font-display font-bold text-[10px] uppercase tracking-wider text-gray-400">Price</th>
                      <th className="p-6 font-display font-bold text-[10px] uppercase tracking-wider text-gray-400">Stock Qty</th>
                      <th className="p-6 font-display font-bold text-[10px] uppercase tracking-wider text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => {
                      const isQtyUpdating = updatingProductId === product._id;
                      return (
                        <tr key={product._id} className="hover:bg-gray-50/30 transition-colors">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                                <img src={product.image} alt={product.name} className="w-9 h-9 object-contain" />
                              </div>
                              <div>
                                <h4 className="font-display font-bold text-xs uppercase text-black line-clamp-1">{product.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[9px] font-bold text-gray-400 uppercase">{product.category}</span>
                                  {product.tag && (
                                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-accent/25 text-black border border-accent/25">
                                      {product.tag}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-6 font-mono text-[10px] text-gray-500">
                            <div>Num ID: <span className="font-bold text-black select-all">{product.id}</span></div>
                            <div className="text-gray-400 mt-0.5">_id: <span className="select-all">{product._id}</span></div>
                          </td>
                          <td className="p-6">
                            <div className="font-display font-black text-xs text-black">${product.price}</div>
                            {product.oldPrice && (
                              <div className="text-[10px] text-gray-400 line-through mt-0.5">${product.oldPrice}</div>
                            )}
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              {/* Quick stock decrement */}
                              <button
                                type="button"
                                disabled={isQtyUpdating || product.qty <= 0}
                                onClick={() => handleUpdateQty(product._id, product.qty - 1)}
                                className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 flex items-center justify-center border border-gray-100 transition-colors disabled:opacity-50 shrink-0 font-bold"
                              >
                                -
                              </button>
                              
                              {/* Stock level label */}
                              <span className={`font-mono text-xs font-bold w-8 text-center ${
                                product.qty === 0 
                                  ? 'text-red-500 font-extrabold' 
                                  : product.qty < 10 
                                    ? 'text-amber-500 font-extrabold' 
                                    : 'text-black'
                              }`}>
                                {isQtyUpdating ? '...' : product.qty}
                              </span>

                              {/* Quick stock increment */}
                              <button
                                type="button"
                                disabled={isQtyUpdating}
                                onClick={() => handleUpdateQty(product._id, product.qty + 1)}
                                className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 flex items-center justify-center border border-gray-100 transition-colors disabled:opacity-50 shrink-0 font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditModal(product)}
                                className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 hover:bg-black hover:text-white hover:border-black transition-colors flex items-center justify-center border border-gray-100"
                                title="Edit Product"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center border border-rose-100"
                                title="Delete Product"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Edit Product Modal Overlay */}
        <AnimatePresence>
          {editingProduct && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setEditingProduct(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col relative z-10"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-black text-lg text-black uppercase tracking-tight">Edit SKU Details</h3>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">DB REF ID: {editingProduct._id}</p>
                  </div>
                  <button 
                    onClick={() => setEditingProduct(null)}
                    className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body Form */}
                <div className="p-8 overflow-y-auto space-y-8 flex-1">
                  {editMessage.text && (
                    <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${
                      editMessage.type === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {editMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                      {editMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleSaveProductEdit} className="space-y-8">
                    {/* Catalog Data Fields */}
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                        <ClipboardList size={14} /> Catalog Data Specs
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Product Name *</label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={editForm.name}
                            onChange={handleEditFormChange}
                            placeholder="e.g. FitPulse Smartwatch"
                            className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Category *</label>
                          <select
                            name="category"
                            value={editForm.category}
                            onChange={handleEditFormChange}
                            className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                          >
                            <option>Audio</option>
                            <option>Wearables</option>
                            <option>Computers</option>
                            <option>Photography</option>
                            <option>Gaming</option>
                            <option>Mobile</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Inventory Stock Level *</label>
                          <input
                            type="number"
                            name="qty"
                            required
                            min="0"
                            value={editForm.qty}
                            onChange={handleEditFormChange}
                            placeholder="e.g. 50"
                            className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Retail Price ($USD) *</label>
                          <input
                            type="text"
                            name="price"
                            required
                            value={editForm.price}
                            onChange={handleEditFormChange}
                            placeholder="e.g. 199"
                            className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Original Price (Strikeout - optional)</label>
                          <input
                            type="text"
                            name="oldPrice"
                            value={editForm.oldPrice}
                            onChange={handleEditFormChange}
                            placeholder="e.g. 249"
                            className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Catalog Tag (optional)</label>
                          <select
                            name="tag"
                            value={editForm.tag}
                            onChange={handleEditFormChange}
                            className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                          >
                            <option value="">No Tag</option>
                            <option value="New">New</option>
                            <option value="Sale">Sale</option>
                            <option value="Hot">Hot</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Media / Description */}
                    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                        <FileText size={14} /> Description & Display media
                      </h4>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Product Image URL *</label>
                          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <input
                              type="url"
                              name="image"
                              required
                              value={editForm.image}
                              onChange={handleEditFormChange}
                              placeholder="e.g. https://res.cloudinary.com/..."
                              className="flex-1 w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                            />
                            
                            <div className="relative shrink-0 w-full sm:w-auto">
                              <input
                                type="file"
                                id="file-upload-edit"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'edit')}
                                className="hidden"
                                disabled={isUploadingEditImage}
                              />
                              <label
                                htmlFor="file-upload-edit"
                                className="cursor-pointer w-full justify-center bg-black text-white hover:bg-accent hover:text-black py-3 px-5 rounded-xl font-display font-bold text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
                              >
                                {isUploadingEditImage ? (
                                  <>
                                    <Loader className="animate-spin" size={12} /> Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Plus size={12} /> Upload File
                                  </>
                                )}
                              </label>
                            </div>
                          </div>
                          {editForm.image && (
                            <div className="mt-4 w-20 h-20 bg-white border border-gray-100 rounded-xl p-1.5 flex items-center justify-center overflow-hidden">
                              <img src={editForm.image} alt="Preview" className="w-16 h-16 object-contain" onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Invalid+Image'; }} />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-wider text-gray-400 mb-2">Description Summary *</label>
                          <textarea
                            name="description"
                            required
                            rows="3"
                            value={editForm.description}
                            onChange={handleEditFormChange}
                            placeholder="Provide a detailed description..."
                            className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Features and Specs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-4">
                            <Tag size={14} /> Highlight Features (Comma Separated)
                          </h4>
                          <textarea
                            rows="5"
                            value={editProductFeatures}
                            onChange={(e) => setEditProductFeatures(e.target.value)}
                            placeholder="Heart Rate Monitor, GPS Tracking, Water Resistant"
                            className="w-full bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-semibold text-black"
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                            <ClipboardList size={14} /> Technical Specifications
                          </h4>
                          <button
                            type="button"
                            onClick={addEditSpecRow}
                            className="bg-black hover:bg-accent hover:text-black text-white px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1"
                          >
                            <Plus size={10} /> Add spec
                          </button>
                        </div>

                        <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                          {editProductSpecs.map((spec, index) => (
                            <div key={index} className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Spec Name"
                                value={spec.key}
                                onChange={(e) => handleEditSpecChange(index, 'key', e.target.value)}
                                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:border-black font-semibold text-black"
                              />
                              <input
                                type="text"
                                placeholder="Spec Value"
                                value={spec.value}
                                onChange={(e) => handleEditSpecChange(index, 'value', e.target.value)}
                                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:border-black font-semibold text-black"
                              />
                              {editProductSpecs.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeEditSpecRow(index)}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-rose-100 transition-colors"
                                >
                                  <X size={13} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-4 border-t border-gray-100 pt-6">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-black py-4 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={editSubmitting}
                        className="flex-[2] bg-black text-white py-4 rounded-xl font-display font-bold text-xs uppercase tracking-wider hover:bg-accent hover:text-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {editSubmitting ? (
                          <>
                            <Loader className="animate-spin" size={14} /> Saving...
                          </>
                        ) : (
                          <>
                            <Check size={14} /> Save Product Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
