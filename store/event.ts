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

interface EventAPIModel {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  allDay: boolean;
  createdAt: string;
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
      this._events = (
        await fetch(`${API_URL}/events`).then((res) => res.json())
      ).map((e: EventAPIModel) => ({
        ...e,
        start: new Date(e.start).toISOString().replace(/T.*$/, ""),
        end: new Date(e.end).toISOString().replace(/T.*$/, ""),
        createdAt: new Date(e.createdAt).toISOString().replace(/T.*$/, ""),
      }));
    },
    async addEvent(event: Omit<Event, "id">) {
      const response = await fetch(`${this.API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: event.title,
          description: event.description,
          start: event.start.getTime(),
          end: event.end.getTime(),
          allDay: event.allDay,
          createdAt: new Date().getTime(),
        }),
      }).then((res) => res.json());
      this._events?.push(response);
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
