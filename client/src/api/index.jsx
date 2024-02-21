import axios from 'axios';
import { isLocal } from '../config';

const baseUrl = isLocal ? process.env.REACT_APP_DEV_SERVER_URL : process.env.REACT_APP_PRODUCTION_SERVER_URL;

const token = localStorage.getItem('eoptoken');
axios.defaults.headers.common['eoptoken'] = token;

export async function submitLogIn(username, password){
    const url = baseUrl + '/authenticate';
    const isInvalid = username.length < 2 && password.length < 2;
    if(isLocal && isInvalid){
        const body = { username: process.env.REACT_APP_DEV_USERNAME, password: process.env.REACT_APP_DEV_PASSWORD };

        return await axios.post(url, body); 
    }
    const body = { username, password };

    return await axios.post(url, body);
}

export async function validateToken(){
    const url = baseUrl + '/validate';

    return await axios.get(url);
}

export async function getUserData(id){
    const url = baseUrl + '/user/' + id;

    return await axios.get(url);
}

export async function updateUserData(data){
    const url = baseUrl + '/user/' + data.id;
    const body = {...data};

    return await axios.patch(url, body);
}




export async function getAllCourseSummaries(courseIds){
    const url = baseUrl + `/courses`;

    return await axios.post(url, {courseIds});
}

export async function getCourseSummary(id){
    const url = baseUrl + `/courses/${id}`;
    return await axios.get(url);
}

export async function getCoursePage(id, path){
    const url = baseUrl + `/courses/${id}/details`;

    return await axios.post(url, {url: path});
}

export { axios };