// stores/counter.js
import { defineStore } from "pinia";

export interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  allDay: boolean;
}
export const useEventStore = defineStore("event", {
  state: (): { events: Event[] } => ({
    events: [
      {
        id: "dd",
        start: new Date("2023-11-22"),
        end: new Date("2023-11-24"),
        title: "test",
        description: "test",
        allDay: true,
      },
    ],
  }),
  actions: {
    addEvent(event: Event) {
      this.events.push(event);
    },
    removeEvent(id: string) {
      this.events = this.events.filter((e) => e.id !== id);
    },
    updateEvent(event: Event) {
      this.events.filter((e) => e.id === event.id)[0] = event;
    },
  },
});
