import Card, { Description, P, Title } from '../components/Card';

import {Button} from '../components'
import Dropdown from '../components/Dropdown';
import MultiColumnList from '../components/MultiColumnList.jsx';
import React from 'react';
import {memo} from 'react';
import styled from 'styled-components/macro';

const Landing_Bottom = ({activeDropdownItem, limitDisplay, groceryLists, groceryItems, atcState, selectDropdownItem, runAddToCart}) => {
    const canViewCartNow = atcState.percentComplete === 100 && !atcState.error
    const loading = atcState.percentComplete > 0 && atcState.percentComplete < 100;
    
    function limit(str, maxAllowed) {
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

    return (
        <Card>
            <TitleWrapper>
                <DropdownPadding>
                    <Dropdown selected={activeDropdownItem} options={groceryLists} selectItem={selectDropdownItem} />
                </DropdownPadding>
                { !canViewCartNow && !loading && activeDropdownItem?.name ? <Button onClick={() => runAddToCart(activeDropdownItem?.name)}>Load This Cart</Button> : '' } 
            </TitleWrapper>
            <Description>
                <MultiColumnList items={groceryItems.map(el => el[0])} renderFn={(el, i) => <P role='option' key={i}>{limit(el, limitDisplay)}</P>} />
            </Description>
        </Card>
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

export default memo(Landing_Bottom);