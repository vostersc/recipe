import {Button, Input} from '../components';
import Card, {Description, P, Title} from '../components/Card';
import React, {useEffect, useState} from 'react';
import {getGroceries, getGroceryLists} from '../api';

import Dropdown from '../components/Dropdown';
// import Loading from '../components/Loading';
import PageWrapper from '../components/PageWrapper';
import styled from 'styled-components/macro';

const ModifiedTitle = styled(Title)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const ModifiedCard = styled(Card)`
    display: flex;
    flex-direction: row;
    align-content: space-between;
`;

export default function User(){
    const [groceryItems, setGroceryItems] = useState([]);
    const [groceryLists, setGroceryLists] = useState([]);
    const [activeDropdownItem, setActiveDropdownItem] = useState({});

    useEffect(() => {
        let mounted = true;

        // if(!auth.auth) return;
        getGroceryListsRequest(mounted);
        getGroceryItemsRequest(null, mounted);

        return () => mounted = false;
        // eslint-disable-next-line
      }, []);

      async function getGroceryListsRequest(mounted){
        if(!mounted) return;
    
        const response = await getGroceryLists();
        const hasData = response?.data?.length > 0;
        if(!hasData) return;
    
        setGroceryLists(response.data);
        setActiveDropdownItem(response.data[0]);
    }

    async function getGroceryItemsRequest(groceryListName, mounted){
        if(!mounted) return;
    
        const response = await getGroceries(groceryListName);
        const hasData = response?.data?.length > 0;
        if(!hasData) return;
    
        setGroceryItems(response.data);
    }

    function selectDropdownItem(uid){
        const item = groceryLists.find(el => el.uid === uid);
        setActiveDropdownItem(item);
    }
    
    console.log('Landing.jsx: 74 --->', groceryItems);
    return (
        <PageWrapper>
            <ModifiedCard>
                <Dropdown
                    selected={activeDropdownItem}
                    options={groceryLists}
                    selectItem={selectDropdownItem}
                />
                <ModifiedTitle>
                    <Button>Load Groceries</Button>
                </ModifiedTitle>
            </ModifiedCard>
            <Card>
                <Description>
                    {groceryItems.map((el, i) => <P key={i}>{limitDisplay(el[0], 27)}</P>)}
                </Description>
            </Card>
            view of grocery list, mark items missed as clickable
                        if clicked pop up an editing window
                            can see item, qty
                            edit text of item
                            click save
                    button that says add groceries to cart (warning can't add groceries and have it work if you don't do it now)
                    status bar that shows progress (ping server every 15 seconds for status)
                        then shows "view cart" button that sends you to the cart page
                            cart page uses an iframe to imbed harmons (copy local storage from testBrowser and paste in user's browser)
        </PageWrapper>
    );
}

export function limitDisplay(str, maxAllowed){
    const words = str.split(' ');
    const displayableText = words.reduce((acc, cur, i, arr) => {
        const futureString = `${acc} ${cur}`;
        const isSafeLength = futureString.length < maxAllowed;
        if(!isSafeLength){
            arr.splice(1);
            return acc;
        }
    
        acc = futureString;
        return acc;
    }, '');

    return displayableText;
}