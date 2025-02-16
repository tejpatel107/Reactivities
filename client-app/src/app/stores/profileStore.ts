import { makeAutoObservable, reaction, runInAction } from "mobx";
import { IPhoto, Profile, UserActivity } from "../models/Profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {

    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    userActivities: UserActivity[] = [];
    loadingActivities = false;
    loadingFollowings = false;
    activeTab = 0;
    /**
     *
     */
    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        )
    }

    setActiveTab = (activeTab: number) => {
        this.activeTab = activeTab;
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.userName === this.profile.username;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    }

    editBio = async (username: string, editedBio: string) => {
        try {
            await agent.Profiles.editBio(username, editedBio);
            runInAction(() => {
                if (this.profile) {
                    this.profile.bio = editedBio;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
                this.uploading = false;
            })
        } catch (error) {
            console.log(error, 'Error uploading photo');
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id == photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    };

    deletePhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.delPhoto(photo.id);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos = this.profile.photos.filter(p => p.id !== photo.id);
                    this.loading = false
                }
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if (this.profile && this.profile.username !== store.userStore.user?.userName && this.profile.username === username
                ) {
                    following ? this.profile.followersCount!++ : this.profile.followersCount!--;
                    this.profile.following = !this.profile.following;
                }

                if (this.profile && this.profile.username === store.userStore.user?.userName) {
                    following ? this.profile.followingCount!++ : this.profile.followingCount!--;
                }
                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        profile.following ? profile.followersCount!-- : profile.followersCount!++;
                        profile.following = !profile.following;
                    }
                })
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;

        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = followings;
                this.loadingFollowings = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false);
        }
    }

    loadUserActivities = async (username: string, predicate?: string) => {
        this.loadingActivities = true;
        try {
            const activities = await agent.Profiles.listActivities(username, predicate!);
            runInAction(() => {
                this.userActivities = activities;
                this.loadingActivities = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(()=> {
                this.loadingActivities = false
            });
        }
    }
}