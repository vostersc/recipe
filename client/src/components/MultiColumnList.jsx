import React from 'react';
import styled from 'styled-components/macro';

export default function MultiColumnList({items, renderFn, defaultDisplay = 'No items found.'}){ 
    if(!items?.length || items?.length === 0) return <MultiColumnListWrapper><Column>{defaultDisplay}</Column></MultiColumnListWrapper>;

    return (
        <MultiColumnListWrapper>
            <Grid>
                {
                    groupItems(items, 1).map((elements, i) => {
                        return (
                            <Column key={i}>
                                {elements.map(renderFn)}
                            </Column>
                        );
                    })
                }
            </Grid>
        </MultiColumnListWrapper>
    );
}

const MultiColumnListWrapper = styled.div`
    display: flex;
    justify-content: center;
    alighn-items: center;
    width: 100%:
`;

const Grid = styled.div`
    display: grid;
    grid-auto-rows: 50px;
    grid-template-columns: repeat(auto-fill, 200px);
    grid-gap: 0px;
    width: 100%;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
    min-width: 180px;
`;

export function groupItems(items, maxItems){
    if(items?.length === 1) return [items];

    let groupedItems = [];
    for (let i = 0; i < items.length; i += maxItems) groupedItems.push(items.slice(i, i + maxItems));

    return groupedItems;
}

