// src/store/index.js

import { createStore } from 'vuex';

export default createStore({
  state: {
    selectedItems: [],
  },
  mutations: {
    setSelectedItems(state, items) {
      state.selectedItems = items;
      
      console.log(state.selectedItems, 121212);
    },
    addSelectedItem(state, item) {
      state.selectedItems.push(item);
      
    },
    removeSelectedItem(state, item) {
      const index = state.selectedItems.indexOf(item);
      if (index > -1) {
        state.selectedItems.splice(index, 1);
      }
    },
  },
});
