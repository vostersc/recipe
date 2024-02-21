import { CLEAR_IS_FIRST_TIME, MAKE_ACTIVE_COURSE, UPDATE_USER_DATA } from './userActions';

const init = {
    id: '',
    username: '',
    courses: [],
    activeCourse: '',
    isFirstTime: true
};

export default function basicReducer(state = init, action) {
    switch (action.type) {
        case UPDATE_USER_DATA:
            return filterUpdateUserData(action);
        case CLEAR_IS_FIRST_TIME:
            return {...state, isFirstTime: false};
        case MAKE_ACTIVE_COURSE:
            return {...state, activeCourse: action.payload};
        default:
            return state;
    }
}

function filterUpdateUserData(action){
    return {
        id: action.data.id,
        username: action.data.email,
        courses: action.data.courses,
        isFirstTime: action.data.isFirstTime
    };
}