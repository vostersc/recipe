import React from 'react';
import styled from 'styled-components/macro';

export default function MultiColumnList({items, renderFn}){ 

    return (
        <MultiColumnListWrapper>
            {
                groupItems(items, 1).map((elements, i) => {
                    return (
                        <Column key={i}>
                            {elements.map(renderFn)}
                        </Column>
                    );
                })
            }
        </MultiColumnListWrapper>
    );
}

export function groupItems(items, maxItems){
    let groups = [];
    let tempGroup = [];
    for(let i = 0; i < items.length; i++){
        const atMaxPerGroup = tempGroup.length >= maxItems;
        if(atMaxPerGroup){
            groups = [...groups, tempGroup];
            tempGroup = [];
            continue;
        }
    
        tempGroup = [...tempGroup, items[i]];
    }

    return groups;
}

const MultiColumnListWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px;
    min-width: 180px;
`;