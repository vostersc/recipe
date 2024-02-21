import React, { useEffect, useState } from 'react';
import {getCoursePage, getCourseSummary} from '../api';

import Card from '../components/Card';
import Loading from '../components/Loading';
import PageWrapper from '../components/PageWrapper';
// import renderPageContent from '../util/renderPageContent';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Course(){
    const [ course, loadCourse ] = useState([]);
    const auth = useSelector(s => s.authentication);
    const params = useParams();

    useEffect(() => {
        let mounted = true;

        if(!auth.auth) return;
        getData(params.courseId, mounted);

        return () => mounted = false;
        // eslint-disable-next-line
      }, []);

    if(!course) return <PageWrapper><Card><Loading/></Card></PageWrapper>;

    return (
        <PageWrapper>
            {/* {renderPageContent(course, handleLinkClick)} */}
        </PageWrapper>
    );





    async function getData(id, mounted){
        if(!mounted || !id) return;
    
        const response = await getCourseSummary(id);
        const hasData = response?.data?.children;
        if(!hasData) return;
    
        loadCourse(response.data);
    }

    async function handleLinkClick(rawUrl){
        const safeUrl = params.courseId + rawUrl.split('.')[1];

        try {
            const response = await getCoursePage(params.courseId, safeUrl);
            if(!response?.data?.children) return;
    
            loadCourse(response.data);  
        } catch(err){
            console.log('Course.js: 55 --->', err);
        }

    }
}
