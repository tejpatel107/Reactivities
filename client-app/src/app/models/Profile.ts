import { User } from "./user";

export interface IProfile {
    username: string,
    displayName: string,
    image?: string,
    bio?: string,
    photos? : IPhoto[],
    followersCount?: number,
    followingCount?: number,
    following: boolean
}

export class Profile implements IProfile {

    username: string
    displayName: string
    image?: string
    bio?: string
    photos?: IPhoto[] | undefined
    followersCount?: number = 0
    followingCount?: number = 0
    following: boolean = false
    
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

export interface UserActivity {
    id: string,
    title: string,
    category: string,
    date: Date | null,
}
