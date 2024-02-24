import { ErrorComponent } from './AppError';
import React from 'react';

export default function Loading(percentComplete, error){
    if(error) return <ErrorComponent message={'Something went wrong. Try again or contact support.'}/>

    return (
        <div class="w3-light-grey">
            <div class="w3-container w3-green w3-center" style="width:25%">25%</div>
        </div>
    );
}