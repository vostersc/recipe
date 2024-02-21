import { Link } from "react-router-dom";
import React from 'react';
import colors from '../components/colors';
import font from '../components/font';
import { logOut } from '../redux/actions';
import src from "../images/food-spread.jpg";
import { store } from '../redux/store';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
// import { useSelector } from "react-redux";

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-left: 16px;
    padding-right: 16px;
    /* padding-top: 8px; */
    padding-bottom: 8px;
    background: ${ colors.secondary };
    overflow: hidden;
`;

const ImageWrapper = styled.div`
    max-height: 100px;

`;

const Img = styled.img`
    object-position: right -214px;
`;

const MenuOpts = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-top: 8px;
    padding-left: 4px;
`;

const MenuGroup = styled.div`
    display: flex;
`;

const MenuOpt = styled(Link)`
    font-size: ${ font.large };
    cursor: pointer;
    color: ${ colors.highlight };
    &:hover,
    &:focus,
    &:active {
        color: ${ colors.highlight };
    }
    padding-right: 32px;
`;

// const MenuOptSmall = styled(MenuOpt)`
//     font-size: ${font.normal};
//     padding-top: 4px;
//     padding-left: 12px;
// `;

const SpacedMenuOpt = styled(MenuOpt)`
    margin-right: 16px;
`;

export default function Header(){
    const navigate = useNavigate();
    // const navigation = useSelector(store => store.navigation);

    function triggerLogOut(){
        localStorage.clear('eoptoken');
        navigate('/login');
        store.dispatch(logOut());
    }

    const authenticated = store.getState().authentication.auth;
    if(!authenticated){
        return (
            <Wrapper>
                <ImageWrapper>
                    <Img src={src} />
                </ImageWrapper>
            </Wrapper> 
        );
    };

    return (
        <Wrapper>
            <ImageWrapper>
                <Img src={src} />
            </ImageWrapper>
            <MenuOpts>
                <MenuGroup>
                    <MenuOpt to={'/'}>All Courses</MenuOpt>
                    {
                        window.location.pathname.includes('course/') ? <MenuOpt to={'/courses'}>Course Outline</MenuOpt> : ''
                    }
                </MenuGroup>
                <MenuGroup>
                    <SpacedMenuOpt to={'/user'}>Account</SpacedMenuOpt>
                    <MenuOpt to={'/'} onClick={ triggerLogOut }>Exit Site</MenuOpt>
                </MenuGroup>
            </MenuOpts>
        </Wrapper>
    );
}