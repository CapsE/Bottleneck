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
            this.history.push(this.active);
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
        this.history.push(this.active);
    }

    async getEvent(){
        console.log(this.history);
        const historyIds = this.history.map(item => item._id);
        const res = await fetch(`/random-event?excludedIds=${JSON.stringify(historyIds)}`);
        const json = await res.json();
        return json;
    }
}

export const state = new State();
