import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import {v4 as uuid} from "uuid"; 
import { format } from "date-fns";

export default class ActivityStore {

    activityRegistery : Map<string, Activity> = new Map<string, Activity>();  
    selectedActivity : Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    /**
     *
     */
    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistery.values()).sort((a,b) => 
            a.date!.getTime()-b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities,activity)=>{
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ?  [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            runInAction(()=>{
                activities.forEach(activity => {
                    this.setActivity(activity);                    
                });
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.setLoadingInitial(false);
            })
        }
    }    

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity =  activity;
            return activity;
        }
        else{
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(()=>this.selectedActivity = activity);
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
        activity.date = new Date(activity.date!);
        this.activityRegistery.set(activity.id, activity);

    }

    setLoadingInitial = (loading : boolean) => {
        this.loadingInitial=loading;
    }

    createAnActivity = async (activity : Activity) => {
        this.loading = true;
        try {
            activity.id = uuid();
            await agent.Activities.create(activity);
            runInAction(()=>{
                this.activityRegistery.set(activity.id, activity);
                this.selectedActivity = activity;
                this.loading = false;
                this.editMode = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(()=>{
                this.editMode = false;
                this.loading = false;
            })
        }
    }

    updateAnActivity = async (activity : Activity) => {
        this.loading=true;
        try {
            await agent.Activities.update(activity);
            runInAction(()=>{
                this.activityRegistery.set(activity.id, activity);
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction( () => {
                this.editMode = false;
                this.loading = false;
            })
        }
    }

    deleteAnActivity = async (id : string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistery.delete(id);
                this.selectedActivity = undefined;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    }
}
