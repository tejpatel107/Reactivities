import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity, ActivityFormValues } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { User, userFormValues } from "../models/user";
import { IPhoto, Profile, UserActivity } from "../models/Profile";
import { PaginatedResult } from "../models/pagination";
import serverError from "../models/serverError";
import ErrorResponse from "../models/errorResponse";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}


axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axios.interceptors.response.use(async response => {

    if (import.meta.env.DEV) await sleep(1000);

    const pagination = response.headers['pagination'];

    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<unknown>>;
    }

    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response!;
    const typedData = data as ErrorResponse;
    switch (status) {
        case 400:
          if (config.method === 'get' && typedData.errors?.hasOwnProperty('id')) {
            router.navigate('/not-found');
          }
          if (typedData.errors) {
            const modalStateErrors: string[] = [];
            for (const key in typedData.errors) {
              if (typedData.errors[key]) modalStateErrors.push(...typedData.errors[key]);
            }
            throw modalStateErrors;
          } else {
            toast.error(data as string);
          }
          break;
    
        case 401:
          toast.error('unauthorized');
          break;
    
        case 403:
          toast.error('forbidden');
          break;
    
        case 404:
          router.navigate('/notfound');
          break;
    
        case 500:
          store.commonStore.setServerError(data as serverError); // Ensure `setServerError` accepts the right type.
          router.navigate('/server-error');
          toast.error('Internal Server Error');
          break;    
    }

    return Promise.reject(error);
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: (axiosParams: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', { params: axiosParams }).then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: userFormValues) => requests.post<User>('/account/login', user),
    register: (user: userFormValues) => requests.post<User>('/account/register', user)
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        const formData = new FormData();
        formData.append('File', file);
        return axios.post<IPhoto>('photos', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    setMainPhoto: (id: string) => requests.put(`/photos/${id}/setMain`, {}),
    delPhoto: (id: string) => requests.del(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) =>
        requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    editBio: (username: string, bio: string) => requests.put(`/profiles/${username}`,{bio:bio}),
    listActivities: (username: string, predicate: string) => 
      requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;