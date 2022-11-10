import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    freets: [], // All freets created in the app
    quotes: [], // All quotes created in the app
    username: null, // Username of the logged in user
    highlights: [], // all highlighted posts of logged in user
    fritform: null,
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateQuotes(state, quotes) {
      /**
       * Update the stored quotes to the provided quotes.
       * @param quotes - Quotes to store
       */
      state.quotes = quotes;
    },
    updateFritForm(state, fritform) {
      /**
       * Update the stored quotes to the provided quotes.
       * @param fritform - Quotes to store
       */
      state.fritform = fritform;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/freets?author=${state.filter}` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    },
    async refreshQuotes(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/quotes?author=${state.filter}` : '/api/quotes';
      const res = await fetch(url).then(async r => r.json());
      state.quotes = res;
    },
    async refreshHighlights(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = `/api/users/highlights?author=${state.username}`;
      const res = await fetch(url).then(async r => r.json());
      state.highlights = res;
    },
    async refreshFritForm(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = '/api/fritforms';
      const res = await fetch(url).then(async r => r.json());
      if (!res.ok) {
        state.fritform = null;
      }
      state.fritform = res;
    },
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
