import { User } from "./user";

export interface IProfile {
    username: string,
    displayName: string,
    image?: string,
    bio?: string,
    photos? : IPhoto[]
}

export class Profile implements IProfile {

    username: string
    displayName: string
    image?: string
    bio?: string
    photos?: IPhoto[] | undefined;
    
    constructor(user: User) {
        this.username = user.userName;
        this.displayName = user.displayName;
        this.image = user.image;
    }
}

export interface IPhoto {
    id: string,
    url: string,
    isMain: boolean,

}