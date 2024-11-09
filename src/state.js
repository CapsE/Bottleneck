import { makeAutoObservable } from "mobx";

class State {
    constructor() {
        this.active = {};
        this.law = 50;
        this.money = 50;
        this.fame = 50;
        this.staff = 50;

        this.history = [];
        this.getEvent().then((event) => {
            this.active = event;
        });
        makeAutoObservable(this);
    }

    updateValues(values){
        Object.keys(values).forEach((key) => {
            this[key] += values[key];
        });
    }

    async next() {
        this.active = await this.getEvent();
        this.history.push(this.active.id);
    }

    async getEvent(){
        const res = await fetch(`http://localhost:3000/random-event?excludedIds=${JSON.stringify(this.history)}`);
        const json = await res.json();
        return json;
    }
}

export const state = new State();
