interface Guest {
  id: string;
  name: string;
  email: string;
  rsvp: "Yes" | "No" | "Maybe";
}

export const useGuestStore = defineStore("guest", {
  state: (): {
    API_URL: string | null;
    _guests: Guest[] | null;
    _addGuestInProgress: boolean;
    _guestsMap: Record<string, Guest>;
  } => ({
    API_URL: null,
    _guests: null,
    _guestsMap: {},
    _addGuestInProgress: false,
  }),
  getters: {
    guests: (state) => state._guests,
    guestsMap: (state) => state._guestsMap,
    addGuestInProgress: (state) => state._addGuestInProgress,
  },
  actions: {
    async fetchGuests(API_URL: string) {
      this.API_URL = API_URL;
      this._guests = await fetch(`${API_URL}/guests`).then((res) => res.json());
      this._guestsMap = (this.guests || []).reduce<Record<string, Guest>>(
        (acc, guest) => {
          acc[guest.id] = guest;
          return acc;
        },
        {},
      );
    },
    async addGuest(guest: Omit<Guest, "id" | "rsvp">) {
      this._addGuestInProgress = true;
      const response = await fetch(`${this.API_URL}/guests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guest),
      }).then((res) => res.json());
      this._guests?.push(response);
      this._addGuestInProgress = false;
    },
  },
});
