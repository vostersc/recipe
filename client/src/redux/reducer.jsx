import { LOG_IN_FAILURE, LOG_IN_LOADING, LOG_IN_SUCCESS, LOG_OUT, logInSuccess } from './actions';

import {axios} from '../api';
import { loadUserInfo } from './userActions';
import { store } from './store';
import { validateToken } from '../api';

const defaultInit = {
    auth: false,
    session: '',
    loading: false,
    failedAttempt: false
};

export default function basicReducer(state = defaultInit, action) {
    switch (action.type) {
        case LOG_IN_SUCCESS:
            return handleLogInSuccess(action.payload);
        case LOG_IN_LOADING:
            return { auth: false, loading: true, session: '', failedAttempt: false  };
        case LOG_IN_FAILURE:
            return { auth: false, loading: false, session: '', failedAttempt: true };
        case LOG_OUT:
            return { auth: false, loading: false, session: '', failedAttempt: false  };
        default:
            return state;
    }
}

function handleLogInSuccess(token){
    localStorage.setItem('eoptoken', token);
    axios.defaults.headers.common['eoptoken'] = token;    

    return { auth: true, loading: false, session: token, failedAttempt: false  };
}

init();
async function init(){
    if(localStorage.getItem('eoptoken') === null) return;

    const result = await validateToken(); //request includes token in header by default, if there is one
    if(!result.data.status) return;
    
    store.dispatch(logInSuccess(localStorage.getItem('eoptoken')));
    store.dispatch(loadUserInfo(result.data.user));
}