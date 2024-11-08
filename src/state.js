import { makeAutoObservable } from "mobx";
import story from './story.json';

class State {
    constructor() {
        this.active = 0;
        this.law = 50;
        this.money = 50;
        this.fame = 50;
        this.staff = 50;

        makeAutoObservable(this);
    }

    updateValues(values){
        Object.keys(values).forEach((key) => {
            this[key] += values[key];
        });
    }

    next() {
        this.active++;
        if(this.active >= story.length) {
            this.active = 0;
        }
    }
}

export const state = new State();
