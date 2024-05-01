import { makeAutoObservable } from "mobx";
import serverError from "../models/serverError";

export default class CommonStore {
    error : serverError | null = null;
    
    constructor () {
        makeAutoObservable(this);
    }

    setServerError(error: serverError) {
        this.error = error;
    }
}