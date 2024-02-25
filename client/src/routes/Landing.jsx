import { Button, Input } from '../components';
import Card, { Description, P, SmallTitle, Title } from '../components/Card';
import React, { useEffect, useState } from 'react';
import { getGroceries, getGroceryLists } from '../api';

import Dropdown from '../components/Dropdown';
import Loading from '../components/Loading';
import MultiColumnList from '../components/MultiColumnList.jsx';
import PageWrapper from '../components/PageWrapper';
import styled from 'styled-components/macro';

export default function User() {
    const [groceryItems, setGroceryItems] = useState([]);
    const [groceryLists, setGroceryLists] = useState([]);
    const [activeDropdownItem, setActiveDropdownItem] = useState({});

    //     useEffect(() => {
    // // poll for completed atc work
    //     }, []);

    const addToCartStatus = { percentComplete: 100, error: false };

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

    const canViewCartNow = addToCartStatus.percentComplete === 100 && !addToCartStatus.error
    return (
        <PageWrapper>
            <Card>

                <TitleWrapper>
                    <DropdownPadding>
                        <Dropdown
                            selected={activeDropdownItem}
                            options={groceryLists}
                            selectItem={selectDropdownItem}
                        />
                    </DropdownPadding>
                    {
                        canViewCartNow ? <Button>View Cart</Button> : (
                            <Loading
                                percentComplete={addToCartStatus.percentComplete}
                                error={addToCartStatus.error}
                            />
                        )
                    }
                </TitleWrapper>

                <Description>
                    <MultiColumnList
                        items={groceryItems.map(el => el[0])}
                        renderFn={(el, i) => <P key={i}>{limitDisplay(el, 27)}</P>}
                    />
                </Description>

            </Card>
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