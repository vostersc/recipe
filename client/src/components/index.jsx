import { Link } from 'react-router-dom';
import colors from './colors';
import font from './font';
import styled from 'styled-components/macro';

const Button = styled.button`
    height: 40px;
    margin: 4px;
    font-size: ${ font.large };
    background: ${ colors.secondary };
    color: ${ colors.primary };
    border-color: ${ colors.primary };
    padding-left: 8px;
    padding-right: 8px;
    cursor: pointer;

    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
    
    &:hover,
    &:focus,
    &:active {
        color: ${ colors.secondary };
        background: ${ colors.primary };
    }
`;

const TextLink = styled.div`
    color: ${colors.highlight};
    cursor: pointer;
    &:hover,
    &:focus,
    &:active {
        color: ${ colors.text };
    } 
`;

const StyledLink = styled(Link)`
    font-size: ${ font.large };
    color: ${ colors.highlight };
    &:hover {
        text-decoration: none;
        color: ${ colors.highlight };
    }
`;

const StyledExternalLink = styled.a`
    font-size: ${ font.normal };
    color: ${ colors.highlight };
    &:hover {
        text-decoration: none;
        color: ${ colors.highlight };
    } 
`;

const Input = styled.input`
    margin: 4px;
    font-size: ${ font.large };
    outline: 1px solid black;
    &::placeholder {
        padding-left: 4px;
    }
`;

export {
    Button,
    Input,
    StyledLink,
    StyledExternalLink,
    TextLink
}