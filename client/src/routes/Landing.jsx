import React, { useCallback, useEffect, useState } from 'react';
import { getGroceries, getGroceryLists } from '../api';

// import Eg from './INTERVIEW.jsx';
import Landing_Bottom from './Landing_Bottom.jsx';
import Landing_Top from './Landing_Top.jsx'
import PageWrapper from '../components/PageWrapper';
import Popup from '../components/PopUp.jsx';

// import { useSelector } from 'react-redux';

let socket; //move
export default function User() {
    // const auth = useSelector(s => s.authentication);
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

    const selectDropdownItem = useCallback(uid => {
        const item = groceryLists.find(el => el.uid === uid);
        setActiveDropdownItem(item);
        getGroceryItemsRequest(item.name, true);
    }, [groceryLists]);

    const runAddToCart = useCallback(groceryList => {
        if(!groceryList) return setPopUpState(true);

        socket = new WebSocket(`ws://localhost:3000/api/addToCart/${groceryList}`); //get url from env or defaults file

        socket.addEventListener('open', () => setAtcState({ percentComplete: 1, error: false, off: null, name: groceryList }));
        socket.addEventListener('close', () => setAtcState({ percentComplete: 0, error: false, off: null, name: '' }));
        socket.onmessage = e => setAtcState(JSON.parse(e.data));

        return false;
    }, [groceryLists]);

    const closeConnection = useCallback(() => {
        const nextState = {percentComplete: 0, error: false, off: true}; //eventually allow multiple ATC, then add 'name' property
        socket.send(nextState);
        setAtcState(nextState);
    }, []);

    const viewCart = useCallback(() => {
        window.open('https://shop.harmonsgrocery.com/checkout/v2/cart'); //get from env or defaults file
        window.location.reload(false);
        //set cookies and local storage then redirect
    }, []);

    const renderPopupContent = useCallback(() => 'Select a list before loading the cart.', []);
    const close = useCallback(() => setPopUpState(false), []);

    return (
        <PageWrapper>
            <Landing_Top
                atcState={atcState}
                closeConnection={closeConnection}
                viewCart={viewCart}
            />
            <Landing_Bottom
                limitDisplay={limitDisplay}
                runAddToCart={runAddToCart}
                activeDropdownItem={activeDropdownItem}
                groceryLists={groceryLists}
                selectDropdownItem={selectDropdownItem}
                atcState={atcState}
                groceryItems={groceryItems}
            />

            <Popup show={popUpState} close={close} titleText={'Warning:'} renderContent={renderPopupContent}/>
        </PageWrapper>
    );
}

function limitDisplay(str, maxAllowed) {
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