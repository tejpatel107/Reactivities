import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import {v4 as uuid} from "uuid"; 

export default class ActivityStore {

    activityRegistery : Map<string, Activity> = new Map<string, Activity>();  
    selectedActivity : Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;
    /**
     *
     */
    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistery.values()).sort((a,b) => 
            Date.parse(a.date)-Date.parse(b.date));
    }

    loadActivities = async () => {
        // this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            runInAction(()=>{
                activities.forEach(activity => {
                    activity.date = activity.date.split('T')[0];
                    this.activityRegistery.set(activity.id, activity);
                });
                // this.activities = activities;
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.setLoadingInitial(false);
            })
        }
    }    

    setLoadingInitial = (loading : boolean) => {
        this.loadingInitial=loading;
    }

    selectActivity = (id:string) => {
        this.selectedActivity = this.activityRegistery.get(id);
    }

    cancelSelectActivity = () => {
        this.selectedActivity = undefined;
        this.editMode = false;
    }

    openForm = (id? : string) => {
        id ? this.selectActivity(id) : this.cancelSelectActivity();
        this.editMode = true; 
    }

    closeForm = () => {
        this.editMode = false; 
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
