import React, { useEffect, useState } from 'react';

import Card from '../components/Card';
import Loading from '../components/Loading';
import PageWrapper from '../components/PageWrapper';
import {getAllCourseSummaries} from '../api';
// import renderPageContent from '../util/renderPageContent';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

export default function Course(){
    const [ courses, loadCourses ] = useState([]);
    const navigate = useNavigate();
    const auth = useSelector(s => s.authentication);
    const courseIds = useSelector(s => s.user?.courses);

    useEffect(() => {
        let mounted = true;

        if(!auth.auth) return;
        getHighLevelCourseData(courseIds, mounted, loadCourses);

        return () => mounted = false;
      // eslint-disable-next-line
      }, courseIds);

    const hasACourse = courses?.length > 0;
    if(!hasACourse) return <PageWrapper><Card><Loading/></Card></PageWrapper>;

    return (
        <PageWrapper>
            {/* {courses.map(course => renderPageContent(course, handleLinkClick(course.name)))} */}
        </PageWrapper>
    );





    async function getHighLevelCourseData(ids, mounted, loadCourses){
        const hasCourses = ids?.length > 0;
        if(!mounted || !hasCourses) return;
    
        const response = await getAllCourseSummaries(ids);
        const hasData = response?.data?.length;
        if(!hasData) return;
    
        loadCourses(response.data);
    }

    function handleLinkClick(courseId){
        return (rawUrl) => {
            const safeUrl = `/course/${courseId + rawUrl.split('.')[1]}`;
            navigate(safeUrl);
        }
    }
}