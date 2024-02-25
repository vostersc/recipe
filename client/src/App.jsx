import {Route, Routes} from "react-router-dom";

// import Course from './routes/Course';
// import Courses from './routes/Courses';
import Header from './components/Header';
import Landing from './routes/Landing';
import React from 'react';
import User from './routes/User';
import auth from './routes/auth';
import colors from './components/colors';
import styled from 'styled-components/macro';

const AppWrapper = styled.div`
    height: 100%;
    width: 100%;
    background: ${ colors.background };
`;

function App() {
    return (
        <AppWrapper>
            <Header />
                <Routes>

                    <Route path="/user" element={auth(<User/>)}/>
                    {/* <Route path='/course/:courseId/*' element={auth(<Course/>)}/> */}
                    {/* <Route path='*' element={auth(<Courses/>)} /> */}
                    <Route path='*' element={auth(<Landing/>)} />

                </Routes>
        </AppWrapper>
    );
}

export default App
