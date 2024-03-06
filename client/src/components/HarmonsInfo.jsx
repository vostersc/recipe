import {Button, Input} from '../components';
import Card, {P, Title} from '../components/Card';

import React from 'react';
import styled from 'styled-components/macro';

export default function HarmonsInfo({submitHarmonsInfo, setHarmonsUserName, setHarmonsPassword, harmonsUserName, harmonsPassword}){
    return (
        <Card>
            <Title>Enter Harmons Information</Title>
            <P>In order to automatically add items to your cart, we must have your username and password.</P>
            <InputWrapper placeholder={`Harmon's User Name`} onChange={e => setHarmonsUserName(e.target.value)} value={harmonsUserName}/>
            <InputWrapper placeholder={`Harmon's Password`} type='password' onChange={e => setHarmonsPassword(e.target.value)} value={harmonsPassword}/>
            <Button onClick={submitHarmonsInfo}>Save</Button>
        </Card>
    );
}

const InputWrapper = styled(Input)`
    width: 275px;
`;