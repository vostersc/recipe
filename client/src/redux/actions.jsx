export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_LOADING = 'LOG_IN_LOADING';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_OUT = 'LOG_OUT';

export function logInLoading(){
    return { type: LOG_IN_LOADING };
}

export function logInFailure(){
    return { type: LOG_IN_FAILURE };
}

export function logInSuccess(session){
    return { type: LOG_IN_SUCCESS, payload: session };
}

export function logOut(){
    return { type: LOG_OUT };
}