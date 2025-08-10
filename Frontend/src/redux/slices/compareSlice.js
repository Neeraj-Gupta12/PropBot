import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  compareList: [],
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      if (state.compareList.length < 3 && !state.compareList.find(p => p.id === action.payload.id)) {
        state.compareList.push(action.payload);
      }
    },
    removeFromCompare: (state, action) => {
      state.compareList = state.compareList.filter(p => p.id !== action.payload);
    },
    clearCompare: (state) => {
      state.compareList = [];
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;
