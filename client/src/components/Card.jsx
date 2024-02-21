import React from 'react';
import colors from '../components/colors';
import font from './font';
import styled from 'styled-components';

const Wrapper = styled.div`
    margin-top: 16px;
    width: 93%;
    max-width: 800px;
    background: ${ colors.secondary };
    padding-top: 12px;
    padding-bottom: 16px;
    padding-left: 16px;
    padding-right: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export default function Card(props){
    return (
        <Wrapper>
            { props.children }
        </Wrapper>
    );
}

export const Title = styled.div`
    font-size: ${ font.xLarge };
`;

export const SmallTitle = styled(Title)`
    font-size: ${ font.large };
`;

export const Description = styled.div`
    
`;

export const P = styled.div`
    font-size: ${ font.normal };
    overflow-wrap: break-word;
`;