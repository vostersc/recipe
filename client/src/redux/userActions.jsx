export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
export const CLEAR_IS_FIRST_TIME = 'CLEAR_IS_FIRST_TIME';
export const MAKE_ACTIVE_COURSE = 'MAKE_ACTIVE_COURSE';

export function loadUserInfo(data){
    return { type: UPDATE_USER_DATA, data };
}

export function clearIsFirstTime(){
    return {type: CLEAR_IS_FIRST_TIME};
}

export function makeActiveCourse(id){
    return {type: MAKE_ACTIVE_COURSE, payload: id};
}