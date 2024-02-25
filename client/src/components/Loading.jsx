import { ErrorComponent } from './AppError';
import React from 'react';
import colors from './colors';
import styled from 'styled-components/macro';

export default function Loading({ percentComplete, error }) {
    if (error) return <ErrorComponent message={'Something went wrong. Try again or contact support.'} />

    return (
        <Wrapper>
            <LoadingBar>
                <Progress progress={percentComplete}>
                    {percentComplete > 20 ? <Number>{percentComplete}</Number> : <RedNumber>{percentComplete}</RedNumber>}
                </Progress>
            </LoadingBar>
        </Wrapper>
    );
}




const Wrapper = styled.div`
    border: 3px solid black;
    background: ${colors.primary};
    margin-top: 1px;
`;

const LoadingBar = styled.div`
    padding: 1px;
    width: 200px;
    height: 36px;
    position: relative;
`;

const Progress = styled.div`
    width: ${props => props.progress}%;
    height: 100%;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
`;

const Number = styled.span`
    position: relative;
    top: 10px;
    left: 8px;
`;

const RedNumber = styled(Number)`
    color: ${colors.gray};
`;