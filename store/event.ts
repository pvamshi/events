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
  guests: string[];
  location: string;
}

interface EventAPIModel {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  allDay: boolean;
  createdAt: string;
  guests: string[];
  location: string;
}

interface Guest {
  id: string;
  name: string;
  email: string;
  rsvp: "Yes" | "No" | "Maybe";
}
export const useEventStore = defineStore("event", {
  state: (): {
    _events: Event[] | null;
    API_URL: string | null;
    guests: Guest[] | null;
    loadingAddEvent: boolean;
    addGuestInProgress: boolean;
    guestsMap: Record<string, Guest>;
  } => ({
    _events: null,
    API_URL: null,
    loadingAddEvent: false,
    guests: null,
    guestsMap: {},
    addGuestInProgress: false,
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
      this.loadingAddEvent = true;
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
          guests: event.guests,
          location: event.location,
        }),
      }).then((res) => res.json());
      this._events?.push(response);
      this.loadingAddEvent = false;
    },
    async fetchGuests() {
      this.guests = await fetch(`${this.API_URL}/guests`).then((res) =>
        res.json(),
      );
      this.guestsMap = (this.guests || []).reduce<Record<string, Guest>>(
        (acc, guest) => {
          acc[guest.id] = guest;
          return acc;
        },
        {},
      );
    },
    async addGuest(guest: Omit<Guest, "id" | "rsvp">) {
      this.addGuestInProgress = true;
      const response = await fetch(`${this.API_URL}/guests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guest),
      }).then((res) => res.json());
      this.guests?.push(response);
      this.addGuestInProgress = false;
    },
  },
});
