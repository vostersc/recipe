import { UPDATE_BREADCRUMB } from './navigationActions';
const init = {
    breadcrumb: '',
    courseId: '',
    courseSection: '',
    courseChapter: ''
};

export default function basicReducer(state = init, action) {
    switch (action.type) {
        case UPDATE_BREADCRUMB: return {...state, breadcrumb: action.payload};
        default:
            return state;
    }
}