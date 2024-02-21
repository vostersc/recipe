import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

export default function PageWrapper(props){
    return (
        <Wrapper>
            {props.children}
        </Wrapper>
    );
}