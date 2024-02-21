import LogInPage from "./LogIn";
import User from './User';
import { useSelector } from "react-redux";

export default function Auth(component){
    const isLoggedIn = useSelector(s => s.authentication.auth);
    const isFirstTime = useSelector(s => s.user.isFirstTime);

    if(!isLoggedIn) return <LogInPage />;

    if(isFirstTime) return <User />;

    return component;
}