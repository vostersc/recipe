import {Title} from './Card';
import colors from './colors';
import styled from 'styled-components/macro';

export default function Popup({show, close, titleText, renderContent}) {
    if(!show) return;

    return (
        <>
            <Background onClick={close}>
            </Background>
            <PopUpCard>
                <Title>{titleText}</Title>
                <ContentP>
                    {renderContent()}
                </ContentP>
                <X onClick={close}/>
            </PopUpCard>
        </>
    );
}

const Background = styled.div`
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: 1;
    background: ${colors.gray};
    opacity: .25;
`;

const PopUpCard = styled.div`
    position: absolute; 
    top: 25px;
    left: 0; 
    right: 0; 
    margin-left: auto; 
    margin-right: auto; 

    min-width: 200px;
    max-width: 500px;
    min-height: 150px;
    max-height: 500px;

    z-index: 100;
    padding: 16px;
    border: 4px solid ${colors.primary};
    background: ${colors.secondary};
`;

const ContentP = styled.div`
    height: 100%;
    width: 100%;
    display: block;
    text-align: center;
`;

const X = styled.div`
    position: relative;
    bottom: 94px;
    left: 506px;
    display: inline-block;
    width: 15px;
    height: 15px;
    border: 4px solid ${colors.primary};
    background:
        linear-gradient(45deg, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 43%,#fff 45%,#fff 55%,rgba(0,0,0,0) 57%,rgba(0,0,0,0) 100%),
        linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary} 43%,#fff 45%,#fff 55%, ${colors.primary} 57%, ${colors.primary} 100%);
    cursor: pointer; 
`;