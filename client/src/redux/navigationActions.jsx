export const UPDATE_BREADCRUMB = 'UPDATE_BREADCRUMB';

export function updateBreadCrumb(value){
    return {type: UPDATE_BREADCRUMB, payload: value};
}