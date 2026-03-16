import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Fetch cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
      setCartTotal(0);
      setItemCount(0);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const res = await axios.get('/api/cart');
      if (res.data.success) {
        setCartItems(res.data.data || []);
        setCartTotal(res.data.total || 0);
        setItemCount(res.data.itemCount || 0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (foodItemId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.warning('Please login to add items to cart');
      return { success: false, needLogin: true };
    }

    try {
      const res = await axios.post('/api/cart/add', { 
        food_item_id: foodItemId, 
        quantity 
      });
      
      if (res.data.success) {
        setCartItems(res.data.data);
        setCartTotal(res.data.total);
        setItemCount(res.data.itemCount);
        toast.success('Item added to cart!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item';
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateQuantity = async (foodItemId, quantity) => {
    try {
      const res = await axios.put('/api/cart/update', { 
        food_item_id: foodItemId, 
        quantity 
      });
      
      if (res.data.success) {
        setCartItems(res.data.data);
        setCartTotal(res.data.total);
        setItemCount(res.data.itemCount);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  const removeFromCart = async (foodItemId) => {
    try {
      const res = await axios.delete(`/api/cart/remove/${foodItemId}`);
      
      if (res.data.success) {
        setCartItems(res.data.data);
        setCartTotal(res.data.total);
        setItemCount(res.data.itemCount);
        toast.success('Item removed from cart');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      return { success: false, message };
    }
  };

  const clearCart = async () => {
    try {
      const res = await axios.delete('/api/cart/clear');
      
      if (res.data.success) {
        setCartItems([]);
        setCartTotal(0);
        setItemCount(0);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    cartItems,
    cartTotal,
    itemCount,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;