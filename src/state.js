import { makeAutoObservable } from "mobx"

class State {
    constructor() {
        this.law = 50;
        this.money = 50;
        this.fame = 50;
        this.staff = 50;

        makeAutoObservable(this);
    }
}

export const state = new State();
