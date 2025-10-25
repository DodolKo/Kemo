import { defineStore } from 'pinia';

export const useVitals = defineStore('vitals', {
  state: () => ({ connected: false, bpm: null as number|null, spo2: null as number|null }),
  actions: {
    update(p: Partial<{connected:boolean,bpm:number|null,spo2:number|null}>) {
      Object.assign(this.$state, p);
    }
  }
});
