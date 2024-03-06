import {Button, Input} from '../components';
import Card, {Description, P, Title} from '../components/Card';
import React, {useState} from 'react';
import { loadHarmonsUser, updateUserData } from '../api';

import HarmonsInfo from '../components/HarmonsInfo';
import Loading from '../components/Loading';
import PageWrapper from '../components/PageWrapper';
import { clearIsFirstTime } from '../redux/userActions';
import { logOut } from '../redux/actions';
import {store} from '../redux/store';
import styled from 'styled-components/macro';
import {updateHarmons} from '../redux/userActions.jsx';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Red = styled.div`
    color: red;
`;

const Green = styled(Red)`
    color: green;
`;

export default function User(){
    const navigate = useNavigate();
    const user = useSelector(store => store.user);
    const [password, setPassword] = useState('');
    const [secondPassword, setSecondPassword] = useState('');
    const [isLoading, setLoadingStatus] = useState(false);
    const [message, setMessage] = useState(setInitialMessageState(user));

    const [harmonsUserName, setHarmonsUserName] = useState(user.harmonsUserName);
    const [harmonsPassword, setHarmonsPassword] = useState(user.harmons);

    async function submitHarmonsInfo(){
        try {
            await loadHarmonsUser(harmonsUserName, harmonsPassword);
            store.dispatch(updateHarmons({harmons: harmonsPassword, harmonsUserName}));
        } catch(err){
            console.log('User.jsx: 43 --->', err); //add popup...
        }
    }

    function setInitialMessageState(user){
        if(user.isFirstTime) return {type: 'err', message: 'Welcome to the course. Since this is your first time, please set your new password.'};
    
        return {type: '', message: ''};
    }

    const handleKeyPress = e => {
        const isEnterPress = e.keyCode === 13;
        if(isEnterPress) submitNewPassword(user.username, [password, secondPassword], setMessage, setLoadingStatus, navigate, user)
    };

    return (
        <PageWrapper>
            <Card>
                <Button onClick={() => navigate('/')}>View Groceries</Button>
            </Card>
            <Card>
                <Title>User</Title>
                <Description>
                    <P>Use this page to change the password for {'your account'}.</P>
                    <P>
                        <Input onChange={e => setPassword(e.target.value)} placeholder='enter a new password' />
                    </P>
                    <P>
                        <Input onChange={e => setSecondPassword(e.target.value)} placeholder='confirm new password' onKeyDown={handleKeyPress}/>
                    </P>
                    <P>
                        {
                            isLoading ? <Loading/> : (
                                <Button
                                    onClick={() => submitNewPassword(user.username, [password, secondPassword], setMessage, setLoadingStatus, navigate, user)}
                                >
                                    Submit
                                </Button>
                            )
                        }
                        {handleMessage(message)}
                    </P>
                </Description>
            </Card>
            <HarmonsInfo
                submitHarmonsInfo={submitHarmonsInfo}
                setHarmonsUserName={setHarmonsUserName}
                harmonsUserName={harmonsUserName}
                harmonsPassword={harmonsPassword}
                setHarmonsPassword={setHarmonsPassword}
            />
            <Card>
                <Title>Help</Title>
                <Description>
                    Site Issues: If you experience site issues, please take a screen shot and shoot us an email.
                </Description>
                <Description>
                    Questions or Problems: Shoot us an email. We usually respond in a few days. admin@websitename.com
                </Description>
            </Card>
        </PageWrapper>
    );
}

function handleMessage(message){
    if(message.type === 'err') return <Red>{message.message}</Red>;

    return <Green>{message.message}</Green>;
}

async function submitNewPassword(email, passwords, setMessage, setLoadingStatus, navigate, user){
    const samePassword = passwords[0] === passwords[1];
    if(!samePassword) return setMessage({type: 'err', message: 'Passwords Must Match.'})
    if(!validateNewPassword(passwords[0], setMessage)) return;

    setLoadingStatus(true);

    const id = user.id;
    const data = {id , password: passwords[0]}

    try {
        const response = await updateUserData(data);

        setLoadingStatus(false);
        if(!response.status) return setMessage({type: 'err', message: 'There was an error changing your password. Try again later.'});
    
        setMessage({type: 'success', message: 'Success!'});
        localStorage.clear('eoptoken');
        store.dispatch(clearIsFirstTime());
        store.dispatch(logOut());
        setTimeout(() => navigate('/'), 4000);
    } catch(err){
        setLoadingStatus(false)
        setMessage({type: 'err', message: 'There was an error. Try again later.'});
    }
    

}

    


function validateNewPassword(password, setMessage){
    const hasLength = password.length > 6;
    const hasNumber = /\d/.test(password);
    // eslint-disable-next-line
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    if(!hasLength || !hasNumber || !hasSymbol) return setMessage({type: 'err', message: 'Password must be longer than 6 characters. It must include at least one number and one symbol.'});

    return password;
}