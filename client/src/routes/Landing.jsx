import {Button, Input} from '../components';
import Card, {Description, P, Title} from '../components/Card';
import React, {useEffect, useState} from 'react';
import {getGroceries, getGroceryLists} from '../api';

// import Loading from '../components/Loading';
import PageWrapper from '../components/PageWrapper';
import styled from 'styled-components/macro';

const ModifiedTitle = styled(Title)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

export default function User(){

    // const navigate = useNavigate();
    // const user = useSelector(store => store.user);
    // const [password, setPassword] = useState('');
    // const [secondPassword, setSecondPassword] = useState('');
    // const [isLoading, setLoadingStatus] = useState(false);
    // const [message, setMessage] = useState(setInitialMessageState(user));

    const [groceryItems, setGroceryItems] = useState([]);
    const [groceryLists, setGroceryLists] = useState([]);

    useEffect(() => {
        let mounted = true;

        // if(!auth.auth) return;
        // getGroceryListsRequest(mounted);
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
    }

    async function getGroceryItemsRequest(groceryListName, mounted){
        if(!mounted) return;
    
        const response = await getGroceries(groceryListName);
        const hasData = response?.data?.length > 0;
        if(!hasData) return;
    
        setGroceryItems(response.data);
    }

    return (
        <PageWrapper>
            <Card>
                <ModifiedTitle>
                    Groceries
                    <Button>Add To Cart</Button>
                </ModifiedTitle>
            </Card>
            <Card>
                <Description>

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