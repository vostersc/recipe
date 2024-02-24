import React from 'react';
import colors from '../components/colors';
import font from './font';
import styled from 'styled-components/macro';

const DropdownWrapper = styled.select`
    height: 30px;
    width: fit-content;
    padding-left: 4px;
    padding-right: 4px;
    font-size: ${font.large};
    cursor: pointer;
    border: 3px solid black;
`;

const Item = styled.option`
    color: ${colors.black};
    /* &:hover: {
        background-color: ${colors.green};
    } */
`;

const ItemActive = styled(Item)`
`;

export default function Dropdown({selected, options, selectItem}){
    return (
        <DropdownWrapper>
            {
                options.map((el, i) => {
                    if(selected.uid === el.uid){
                        //active style
                        return <ItemActive key={i} onClick={() => selectItem(el.uid)}>{el.name}</ItemActive> 
                    }
            
                    return <Item key={i} onClick={() => selectItem(el.uid)}>{el.name}</Item>
                })
            }


        </DropdownWrapper>
    );
}
