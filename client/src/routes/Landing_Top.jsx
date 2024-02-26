import Card, {SmallTitle} from '../components/Card';

import { Button } from '../components';
import Loading from '../components/Loading';
import React from 'react';
import colors from '../components/colors.jsx';
import styled from 'styled-components/macro';

function Landing_Top({atcState, closeConnection, viewCart}){
    const canViewCartNow = atcState.percentComplete === 100 && !atcState.error
    const loading = atcState.percentComplete > 0 && atcState.percentComplete < 100;
    return (
        <Card>
            {
                loading ? (
                    <Organizer>
                        <SmallTitle>Loading: <Green>{atcState.name}</Green></SmallTitle>
                        <Loading percentComplete={atcState.percentComplete} error={atcState.error}/>
                        <Stop onClick={() => closeConnection()}>Stop</Stop>
                    </Organizer>
                ) : <SmallTitle>Load A List</SmallTitle>
            }
            { canViewCartNow ? <Organizer>List Complete: <Green>{atcState.name}</Green><Button onClick={() => viewCart()}>View Shopping Cart</Button></Organizer> : '' } 
        </Card>
    );
}

export default React.memo(Landing_Top);

const Organizer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Stop = styled(Button)`
    height: 40px;
    color: ${colors.error};
    background-color: ${colors.secondary};
    border: 2px solid ${colors.error};
    max-width: 200px;
    &:hover {
        background-color: ${colors.error};
        color: ${colors.secondary};
        border: 2px solid ${colors.error};
    }
`;

const Green = styled.span`
    color: ${colors.success};
`;
