import React from 'react';
import colors from '../components/colors';
import font from './font';
import styled from 'styled-components/macro';

export default function Dropdown({selectItem, options}){
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedOption, setSelectedOption] = React.useState(null);

    function toggleDropdown(){ setIsOpen(!isOpen); }

    function handleOptionClick(option){
        setSelectedOption(option);
        setIsOpen(false);
        selectItem(option.uid);
    };

    return (
        <Wrapper>
            <DropdownButton onClick={toggleDropdown}>
                {selectedOption ? selectedOption.name : 'Select A List'}
            </DropdownButton>
            <DropdownContent open={isOpen}>
                {
                    options.map((el, i) => (
                        <DropdownItem key={i} onClick={() => handleOptionClick(el)}>
                            {el.name}
                        </DropdownItem>
                    ))
                }
            </DropdownContent>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    position: relative;
    display: inline-block;
`;

const DropdownButton = styled.button`
    background-color: ${colors.primary};
    color: ${colors.secondary};
    height: 40px;
    font-size: ${font.large};
    border: none;
    cursor: pointer;
    &:hover {
        background-color: ${colors.secondary};
        color: ${colors.primary};
    }
    border: 2px solid ${colors.primary};
`;

const DropdownContent = styled.div`
    display: ${(props) => (props.open ? 'block' : 'none')};
    position: absolute;
    background-color: ${colors.secondary};
    min-width: 160px;
    z-index: 1;
    color: ${colors.primary};
    font-size: ${font.normal};
    border: 3px solid ${colors.primary};
`;

const DropdownItem = styled.div`
    padding: 12px 16px;
    cursor: pointer;

    &:hover {
        font-weight: bold;
    }
`;