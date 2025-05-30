import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/Profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {

    activityRegistery: Map<string, Activity> = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);
    /**
     *
     */
    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.pagingParams = new PagingParams();
                this.activityRegistery.clear();
                this.loadActivities();
            }
        )
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistery.values()).sort((a, b) =>
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] })
        )
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const result = await agent.Activities.list(this.axiosParams);
            runInAction(() => {
                result.data.forEach((activity: Activity) => {
                    this.setActivity(activity);
                });
            })
            this.setPagination(result.pagination);
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.setLoadingInitial(false);
            })
        }
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, value.toISOString());
            } else {
                params.append(key, value);
            }
        })
        return params;
    }

    setPredicate = (predicate: string, value: string | Date) => {

        const resetPredicate = () => {
            this.predicate.forEach((_value, key) => {
                if (key !== 'startDate') {
                    this.predicate.delete(key);
                }
            })
        }

        switch (predicate) {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
                break;
        }
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        }
        else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private getActivity = (id: string) => {
        return this.activityRegistery.get(id);
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;

        if (user) {
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.userName
            );
            activity.isHost = activity.hostUsername === user.userName;
            activity.host = activity.attendees?.find(
                a => a.username === activity.hostUsername
            );
        }
        activity.date = new Date(activity.date!);
        this.activityRegistery.set(activity.id, activity);
    }

    setLoadingInitial = (loading: boolean) => {
        this.loadingInitial = loading;
    }

    createAnActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        try {
            activity.id = uuid();
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.userName;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            await agent.Activities.create(activity);
            runInAction(() => {
                // this.activityRegistery.set(activity.id, activity);
                this.selectedActivity = newActivity;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateAnActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if (activity.id) {
                    const updatedActivity = { ...this.getActivity(activity.id), ...activity };
                    this.activityRegistery.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    deleteAnActivity = async (id: string) => {
        try {
            runInAction(() => {
                this.activityRegistery.delete(id);
                this.selectedActivity = undefined;
            });      
            await agent.Activities.delete(id);
        } catch (error) {
            console.log(error);
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user;

        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees =
                        this.selectedActivity.attendees?.filter(a => a.username !== user!.userName);
                    this.selectedActivity!.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistery.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    cancelActivity = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistery.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false)
        }
    }

    clearActivityStore = async () => {
        this.selectedActivity = undefined;
    }

    updateAttendeeFollowing = (username: string) => {
        this.activityRegistery.forEach(activity =>
            activity.attendees.forEach((attendee: Profile) => {
                if (attendee.username === username) {
                    attendee.following ? attendee.followersCount!-- : attendee.followersCount!++;
                    attendee.following = !attendee.following;
                }
            })
        )
    }
}
