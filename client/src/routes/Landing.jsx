import Card, { Description, P, SmallTitle, Title } from '../components/Card';
import React, { useEffect, useState } from 'react';
import { getGroceries, getGroceryLists } from '../api';

import { Button } from '../components';
import Dropdown from '../components/Dropdown';
import Loading from '../components/Loading';
import MultiColumnList from '../components/MultiColumnList.jsx';
import PageWrapper from '../components/PageWrapper';
import Popup from '../components/PopUp.jsx';
import colors from '../components/colors.jsx';
import styled from 'styled-components/macro';

let socket;
export default function User() {
    const [groceryItems, setGroceryItems] = useState([]);
    const [groceryLists, setGroceryLists] = useState([]);
    const [activeDropdownItem, setActiveDropdownItem] = useState({});
    const [popUpState, setPopUpState] = useState(false);
    const [atcState, setAtcState] = useState({percentComplete: 0, error: false, off: null, name: ''});

    useEffect(() => {
        let mounted = true;

        // if(!auth.auth) return;
        getGroceryListsRequest(mounted);
        getGroceryItemsRequest(null, mounted);

        return () => mounted = false;
        // eslint-disable-next-line
    }, []);

    async function getGroceryListsRequest(mounted) {
        if (!mounted) return;

        const response = await getGroceryLists();
        const hasData = response?.data?.length > 0;
        if (!hasData) return;

        setGroceryLists(response.data);
    }

    async function getGroceryItemsRequest(groceryListName, mounted) {
        if (!mounted) return;

        const response = await getGroceries(groceryListName);
        const hasData = response?.data?.length > 0;
        if (!hasData) return;

        setGroceryItems(response.data);
    }

    function selectDropdownItem(uid) {
        const item = groceryLists.find(el => el.uid === uid);
        setActiveDropdownItem(item);
        getGroceryItemsRequest(item.name, true);
    }

    function runAddToCart(groceryList){
        if(!groceryList) return setPopUpState(true);

        socket = new WebSocket(`ws://localhost:3000/api/addToCart/${groceryList}`);

        socket.addEventListener('open', () => setAtcState({ percentComplete: 1, error: false, off: null, name: groceryList }));
        socket.addEventListener('close', () => setAtcState({ percentComplete: 0, error: false, off: null, name: '' }));
        socket.onmessage = e => setAtcState(JSON.parse(e.data));

        return false;
    }

    function closeConnection(){
        const nextState = {percentComplete: 0, error: false, off: true}; //eventually allow multiple ATC, then add 'name' property
        socket.send(nextState);
        setAtcState(nextState);
    }

    function viewCart(){
        window.location.reload(false); //change once working
        //set cookies and local storage then redirect
    }

    const canViewCartNow = atcState.percentComplete === 100 && !atcState.error
    const loading = atcState.percentComplete > 0 && atcState.percentComplete < 100;
    return (
        <PageWrapper>


            {/* SEPARATE VIEW/LOGIC INTO OWN FILE */}
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
                { canViewCartNow ? <Organizer><Green>{atcState.name}</Green><Button onClick={() => viewCart()}>View Cart</Button></Organizer> : '' } 
            </Card>
            {/* SEPARATE VIEW/LOGIC INTO OWN FILE */}


            {/* SEPARATE VIEW/LOGIC INTO OWN FILE */}
            <Card>
                <TitleWrapper>
                    <DropdownPadding>
                        <Dropdown selected={activeDropdownItem} options={groceryLists} selectItem={selectDropdownItem} />
                    </DropdownPadding>
                    { !canViewCartNow && !loading && activeDropdownItem?.name ? <Button onClick={() => runAddToCart(activeDropdownItem?.name)}>Load This Cart</Button> : '' } 
                </TitleWrapper>
                <Description>
                    <MultiColumnList items={groceryItems.map(el => el[0])} renderFn={(el, i) => <P key={i}>{limitDisplay(el, 27)}</P>} />
                </Description>
            </Card>
            {/* SEPARATE VIEW/LOGIC INTO OWN FILE */}


            <Popup show={popUpState} close={() => setPopUpState(false)} titleText={'Warning:'} renderContent={() => 'Select a list before loading the cart.'}/>


        </PageWrapper>
    );
}

const TitleWrapper = styled(Title)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const DropdownPadding = styled.div`
    padding-top: 1px;
    padding-left: 4px;
`;

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

export function limitDisplay(str, maxAllowed) {
    const words = str.split(' ');
    const displayableText = words.reduce((acc, cur, i, arr) => {
        const futureString = `${acc} ${cur}`;
        const isSafeLength = futureString.length < maxAllowed;
        if (!isSafeLength) {
            arr.splice(1);
            return acc;
        }

        acc = futureString;
        return acc;
    }, '');

    return displayableText;
}