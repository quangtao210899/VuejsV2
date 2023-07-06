// src/store/index.js

import { createStore } from 'vuex';

export default createStore({
    state: {
        selectedItems: [],
    },
    mutations: {
        setSelectedItems(state, items) {
            state.selectedItems = items;
        },
        addSelectedItem(state, item) {  
            state.selectedItems.push(...item);
        },
        removeSelectedItem(state, items) {
            const filteredArr1 = state.selectedItems.filter(item => !items.includes(item));
            state.selectedItems.length = 0;
            state.selectedItems.push(...filteredArr1);
        },
    },
});
