import { Button, Input } from '../components';
import Card, { Description, P, SmallTitle, Title } from '../components/Card';
import React, { useEffect, useState } from 'react';
import { getGroceries, getGroceryLists } from '../api';

import Dropdown from '../components/Dropdown';
import Loading from '../components/Loading.jsx';
import MultiColumnList from '../components/MultiColumnList.jsx';
// import Loading from '../components/Loading';
import PageWrapper from '../components/PageWrapper';
import styled from 'styled-components/macro';

export default function User() {
    // const [groceryItems, setGroceryItems] = useState([]);
    // const [groceryLists, setGroceryLists] = useState([]);
    const [groceryItems, setGroceryItems] = useState(
        [
            [
                "vital wheat gluten",
                ""
            ],
            [
                "gluten",
                ""
            ],
            [
                "Beef or ground turkey",
                "1/2"
            ],
            [
                "kidney beans",
                "1 can"
            ],
            [
                "Green chili's",
                "1 can"
            ],
            [
                "28oz each diced tomaotes IN JUICE (must be in juice)",
                "2 large cans"
            ],
            [
                "mexican cheese",
                "1c"
            ],
            [
                "white beans",
                "1 can"
            ],
            [
                "frozen berries",
                ""
            ],
            [
                "beets",
                ""
            ],
            [
                "grapefruit",
                ""
            ],
            [
                "clementine orange",
                ""
            ],
            [
                "greek yogurt",
                ""
            ],
            [
                "turkey bacon",
                ""
            ],
            [
                "frozen peas",
                ""
            ],
            [
                "frozen corn",
                ""
            ],
            [
                "chicken tenderloins",
                ""
            ],
            [
                "spaghetti noodles",
                ""
            ],
            [
                "roas marinara",
                ""
            ],
            [
                "butter - kerrygold",
                ""
            ],
            [
                "flour - bread",
                ""
            ],
            [
                "meatballs",
                ""
            ],
            [
                "chicken - breasts",
                ""
            ],
            [
                "chicken - whole ",
                ""
            ],
            [
                "diapers",
                ""
            ],
            [
                "toilet paper",
                ""
            ],
            [
                "turkey",
                ""
            ],
            [
                "kamut",
                ""
            ],
            [
                "oat",
                ""
            ],
            [
                "dried mangos",
                ""
            ],
            [
                "green salsa",
                ""
            ],
            [
                "carob",
                ""
            ],
            [
                "corn meal",
                ""
            ],
            [
                "sharp white cheddar",
                ""
            ],
            [
                "medjool dates",
                ""
            ],
            [
                "cashews",
                ""
            ],
            [
                "tart cherries",
                ""
            ],
            [
                "garlic",
                ""
            ],
            [
                "potatos",
                ""
            ],
            [
                "carrots",
                ""
            ],
            [
                "bananas",
                ""
            ],
            [
                "apples",
                ""
            ],
            [
                "bread",
                ""
            ],
            [
                "milk",
                ""
            ],
            [
                "eggs",
                ""
            ],
            [
                "chopped dates",
                ""
            ],
            [
                "almonds",
                ""
            ],
            [
                "sunflower seeds",
                ""
            ],
            [
                "macadamia nut",
                ""
            ],
            [
                "corn meal",
                ""
            ],
            [
                "polenta",
                ""
            ],
            [
                "lupini beans",
                ""
            ],
            [
                "jasmine rice",
                ""
            ],
            [
                "frozen berries",
                ""
            ],
            [
                "beef",
                ""
            ],
            [
                "red salsa",
                ""
            ],
            [
                "raos marinara",
                ""
            ],
            [
                "bread - wheat",
                ""
            ],
            [
                "eggs",
                ""
            ],
            [
                "coconut milk",
                "0"
            ],
            [
                "vital wheat gluten",
                ""
            ]
        ]
    );
    const [groceryLists, setGroceryLists] = useState(
        [
            {
                "uid": "2026BBD2-AF08-4C3B-AD22-959C795DFEBC",
                "name": "Pantry Staples",
                "order_flag": 8,
                "is_default": false,
                "reminders_list": "Pantry Staples"
            },
            {
                "uid": "AFCFF2A0-4ECC-4EAB-BB7E-20F94EB7004B",
                "name": "Azure Standard",
                "order_flag": 7,
                "is_default": false,
                "reminders_list": "Azure Standard"
            },
            {
                "uid": "7071181D-9899-43D7-90AC-011A877C0C3E",
                "name": "Household",
                "order_flag": 6,
                "is_default": false,
                "reminders_list": "Household"
            },
            {
                "uid": "0FB14B1E-2C10-4FCD-8770-783BA7CF09A5",
                "name": "Trader Joes",
                "order_flag": 5,
                "is_default": false,
                "reminders_list": "Trader Joes"
            },
            {
                "uid": "9597EA8F-8BCC-4447-95AF-20CD3F657980",
                "name": "Costco",
                "order_flag": 4,
                "is_default": false,
                "reminders_list": "Costco"
            },
            {
                "uid": "4AAAE862-1EEC-4439-95F6-70197D7CC027",
                "name": "Specialty Stores",
                "order_flag": 2,
                "is_default": false,
                "reminders_list": ""
            },
            {
                "uid": "9E12FCF54A89FC52EA8E1C5DA1BDA62A6617ED8BDC2AEB6F291B93C7A399F6F6",
                "name": "Grocery List",
                "order_flag": 1,
                "is_default": true,
                "reminders_list": "Paprika"
            }
        ]
    );
    const [activeDropdownItem, setActiveDropdownItem] = useState({});

    //     useEffect(() => {
    // // poll for completed atc work
    //     }, []);

    const addToCartStatus = { percentComplete: 100, error: false };

    useEffect(() => {
        let mounted = true;

        // if(!auth.auth) return;
        // getGroceryListsRequest(mounted);
        // getGroceryItemsRequest(null, mounted);

        return () => mounted = false;
        // eslint-disable-next-line
    }, []);

    async function getGroceryListsRequest(mounted) {
        if (!mounted) return;

        const response = await getGroceryLists();
        const hasData = response?.data?.length > 0;
        if (!hasData) return;

        setGroceryLists(response.data);
        setActiveDropdownItem(response.data[0]);
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
    }

    console.log('Landing.jsx: 362 --->', activeDropdownItem);
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