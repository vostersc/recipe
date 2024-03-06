export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
export const CLEAR_IS_FIRST_TIME = 'CLEAR_IS_FIRST_TIME';
export const MAKE_ACTIVE_COURSE = 'MAKE_ACTIVE_COURSE';
export const UPDATE_USER_HARMONS = 'UPDATE_USER_HARMONS';

export function loadUserInfo(data){
    return { type: UPDATE_USER_DATA, data };
}

export function clearIsFirstTime(){
    return {type: CLEAR_IS_FIRST_TIME};
}

export function makeActiveCourse(id){
    return {type: MAKE_ACTIVE_COURSE, payload: id};
}

export function updateHarmons(payload){
    return {type: UPDATE_USER_HARMONS, payload};
}