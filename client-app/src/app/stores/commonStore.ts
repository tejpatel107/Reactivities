import { makeAutoObservable, reaction } from "mobx";
import serverError from "../models/serverError";

export default class CommonStore {
    error: serverError | null = null;
    token: string | null | undefined = null;
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.token,
            token => {
                if (token) { 
                    localStorage.setItem('jwt', token) 
                } else {
                    localStorage.removeItem('jwt');
                }
            }
        )
    }

    setServerError(error: serverError) {
        this.error = error;
    }

    setToken = (token: string | null) => {
        this.token = token;
    }

    setAppLoaded = () => { this.appLoaded = true; }
}