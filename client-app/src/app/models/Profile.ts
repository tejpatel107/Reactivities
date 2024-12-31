import { User } from "./user";

export interface IProfile {
    username: string,
    displayName: string,
    image?: string,
    bio?: string,
}

export class Profile implements IProfile {

    username: string
    displayName: string
    image?: string
    bio?: string

    constructor(user: User) {
        this.username = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}