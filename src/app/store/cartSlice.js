// store/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const cart = localStorage.getItem("cart");
      return cart ? JSON.parse(cart) : [];
    } catch (e) {
      console.warn("Could not load cart from localStorage", e);
      return [];
    }
  }
  return [];
};

const initialState = {
  // array of { id, name, description, image, points, quantity, category }
  items: [],
  isHydrated: false,
};

const saveToLocal = (items) => {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (e) {
    console.warn("Could not save cart to localStorage", e);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state) => {
      if (!state.isHydrated) {
        state.items = loadCartFromLocalStorage();
        state.isHydrated = true;
      }
    },
    addToCart: (state, action) => {
      const payload = action.payload; // expected { id, name, description, image, points, quantity, category }
      const existing = state.items.find((it) => it.id === payload.id);
      if (existing) {
        existing.quantity = (existing.quantity || 0) + (payload.quantity || 1);
      } else {
        state.items.push({
          id: payload.id,
          name: payload.name,
          description: payload.description,
          image: payload.image,
          points: payload.points,
          category: payload.category,
          quantity: payload.quantity || 1,
        });
      }
      saveToLocal(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
        saveToLocal(state.items);
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      saveToLocal(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveToLocal(state.items);
    },
    setCart: (state, action) => {
      state.items = action.payload;
      saveToLocal(state.items);
    },
  },
});

export const { hydrateCart, addToCart, updateQuantity, removeFromCart, clearCart, setCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectDistinctCount = (state) => state.cart.items.length;
export const selectTotalQuantity = (state) =>
  state.cart.items.reduce((s, i) => s + (i.quantity || 0), 0);
export const selectTotalPoints = (state) =>
  state.cart.items.reduce((s, i) => s + (i.points * (i.quantity || 0)), 0);

export default cartSlice.reducer;
