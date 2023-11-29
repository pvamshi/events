import { defineStore } from "pinia";

export interface Event {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  allDay: boolean;
  createdAt: Date;
  guests: Map<string, "Yes" | "May be" | "No">;
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
  guests: Map<string, "Yes" | "May be" | "No">;
  location: string;
}

function toEventStore(event: EventAPIModel): Event {
  return {
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
    createdAt: new Date(event.createdAt),
  };
}

export const useEventStore = defineStore("event", {
  state: (): {
    _events: Event[] | null;
    API_URL: string | null;
    _addEventInProgress: boolean;
  } => ({
    _events: null,
    API_URL: null,
    _addEventInProgress: false,
  }),
  getters: {
    events: (state) => state._events,
    addEventInProgress: (state) => state._addEventInProgress,
  },
  actions: {
    async fetchEvents(API_URL: string) {
      this.API_URL = API_URL;
      const eventsResponse = await fetch(`${API_URL}/events`).then((res) =>
        res.json(),
      );
      this._events = eventsResponse.map(toEventStore);
    },
    async addEvent(event: Omit<Event, "id" | "guests"> & { guests: string[] }) {
      this._addEventInProgress = true;
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
          guests: event.guests.reduce<Record<string, "Yes" | "May be" | "No">>(
            (acc, guest) => {
              acc[guest] = "May be";
              return acc;
            },
            {},
          ),
          location: event.location,
        }),
      }).then((res) => res.json());
      this._events?.push(toEventStore(response));
      this._addEventInProgress = false;
    },
  },
});
