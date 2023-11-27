// stores/counter.js
import { defineStore } from "pinia";

export interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  allDay: boolean;
  createdAt: Date;
}

export const useEventStore = defineStore("event", {
  state: (): {
    _events: Event[] | null;
    API_URL: string | null;
  } => ({
    _events: null,
    API_URL: null,
  }),
  getters: {
    events: (state) => state._events,
  },
  actions: {
    async fetchEvents(API_URL: string) {
      this.API_URL = API_URL;
      this._events = await fetch(`${API_URL}/events`).then((res) => res.json());
    },
  },
});

// export const useEventStore2 = defineStore("event", () => {
//   const {
//     public: { API_URL },
//   } = useRuntimeConfig();
//   const _store = reactive<{ events: Event[] | null }>({
//     events: null,
//   });
//   const addEvent = (event: Event) => {
//     _store.events?.push(event);
//   };
//   const removeEvent = (id: string) => {
//     _store.events = (_store.events || []).filter((e) => e.id !== id);
//   };
//   const updateEvent = (event: Event) => {
//     if (_store.events) {
//       const matchingEvent = _store.events.findIndex((e) => e.id === event.id);
//       if (matchingEvent > -1) {
//         _store.events[matchingEvent] = event;
//       }
//     }
//   };
//   const getEvents = () => {
//     if (_store.events === null) {
//       _fetchEvents();
//     }
//     return _store.events;
//   };
//   const _fetchEvents = () => {
//     return fetch(`${API_URL}/events`)
//       .then((res) => res.json())
//       .then((events: Event[]) => {
//         _store.events = events;
//       });
//   };
//   return {
//     addEvent,
//     removeEvent,
//     updateEvent,
//     getEvents,
//   };
// });
