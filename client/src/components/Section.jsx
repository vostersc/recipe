import { Description, P, SmallTitle } from '../components/Card';

import React from 'react';
import {StyledLink} from '../components';

export default function Section(section, i){
    return (
        <div key={i}>
            <SmallTitle>{section.title}</SmallTitle>
            <Description>
                {section?.content?.map((data, ii) => (
                    <P key={ii}>
                        {parseContent(data)}
                    </P> 
                ))}
            </Description>
        </div>
    );
}

function parseContent(data){
    if(data.type === 'image') return <img alt='importance' src={data.value[0]} />;

    if(data.type === 'video'){
        return data.value[0];
        // return (
        //     <iframe
        //         width="853"
        //         height="480"
        //         src={data.value[0]}
        //         frameBorder="0"
        //         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        //         allowFullScreen
        //         title="Embedded youtube"
        //     />   
        // );
    }

    return data?.value?.map(handleTextContent);
}

function handleTextContent(text, i){
    if(text.type === 'url') return buildUrlText(text, i);

    return (
        <P key={i}>
            {text.value}
        </P>
    );
}

function buildUrlText(element, i){
    const isValidUrl = !!element?.config?.url;
    if(!isValidUrl) return <P key={i}>{element.text}</P>

    return (
        <StyledLink key={i} to={element.config.url}>
            -----------{element.value}
        </StyledLink>
    );
}