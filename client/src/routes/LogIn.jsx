import { Button, Input } from '../components';
import React, { useState } from 'react';
import { logInFailure, logInLoading, logInSuccess } from '../redux/actions';

import Card from '../components/Card';
import Course from './Courses';
import PageWrapper from '../components/PageWrapper';
import {isLocal} from '../config';
import { loadUserInfo } from '../redux/userActions';
import { store } from '../redux/store';
import styled from 'styled-components';
import { submitLogIn } from '../api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Message = styled.div`
    color: red;
`;

export default function LogInPage(){
    const navigate = useNavigate();
    const [ username, updateUsername ] = useState('');
    const [ password, updatePassword ] = useState('');
    const auth = useSelector(s => s.authentication);
    const logInFailed = auth.failedAttempt;

    if(auth.auth) return <Course />;

    async function requestLogIn(username, password){
        const invalid = username.length < 2 || password.length < 2;
        if(invalid && !isLocal) return store.dispatch(logInFailure());

        store.dispatch(logInLoading());
    
        try {
            const result = await submitLogIn(username, password); 

            if(!result.data.status) return store.dispatch(logInFailure());

            store.dispatch(loadUserInfo(result.data.user));
            store.dispatch(logInSuccess(result.data.token));
        } catch(err){
            return store.dispatch(logInFailure());
        }
    }

    const handleKeyPress = e => {
        const isEnterPress = e.keyCode === 13;
        if(isEnterPress) requestLogIn(username, password, navigate);
    };

    return (
        <PageWrapper>
            <Card>
                
                Email:
                <Input
                    type='email'
                    placeholder='xxx@xxx.com'
                    onChange={ e => updateUsername(e.target.value) }
                    value={ username }
                    required
                />
                
                Password: 
                <Input
                    type='password'
                    placeholder='password'
                    onChange={ e => updatePassword(e.target.value) }
                    value={ password }
                    onKeyDown={handleKeyPress}
                    required
                />
                
                <Button onClick={ () => requestLogIn(username, password, navigate) }>
                    submit
                </Button>

                <Message>{logInFailed ? 'Invalid. Try Again' : ''}</Message>
            </Card>
        </PageWrapper>
    );
}













