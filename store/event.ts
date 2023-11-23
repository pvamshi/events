// stores/counter.js
import { defineStore } from "pinia";

export const useEventStore = defineStore("event", {
  state: () => {
    return { count: 0 };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++;
    },
  },
});
