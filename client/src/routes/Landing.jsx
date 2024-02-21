import {Button, Input} from '../components';
import Card, {Description, P, Title} from '../components/Card';
import React, {useEffect, useState} from 'react';

// import Loading from '../components/Loading';
import PageWrapper from '../components/PageWrapper';
import {getGroceryItems} from '../api';
import styled from 'styled-components/macro';

const ModifiedTitle = styled(Title)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

export default function User(){

    console.log('Landing.jsx: 19 --->', process.env);
    // const navigate = useNavigate();
    // const user = useSelector(store => store.user);
    // const [password, setPassword] = useState('');
    // const [secondPassword, setSecondPassword] = useState('');
    // const [isLoading, setLoadingStatus] = useState(false);
    // const [message, setMessage] = useState(setInitialMessageState(user));

    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        let mounted = true;

        // if(!auth.auth) return;
        getData(mounted);

        return () => mounted = false;
        // eslint-disable-next-line
      }, []);


    async function getData(mounted){
        if(!mounted) return;
    
        const response = await getGroceryItems();
        const hasData = response?.data?.length > 0;
        if(!hasData) return;
    
        setRecipes(response.data);
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