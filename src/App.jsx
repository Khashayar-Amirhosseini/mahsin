import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/navbar/navbar";
import Home from "./containers/home/home";
import './App.css'
import Header from "./components/header/header";
import './fonts/font-awesome.min.css'
import './assets/ihover/ihover.css'
import Footer from "./components/footer/footer";
import FooterContextProvider from "./context/footerContext";
import SignInModal from "./components/signInModal/signInModal";
import SignUpModal from "./components/signUpModal/signUpModal";
import 'react-loading-skeleton/dist/skeleton.css'
import Blog from "./containers/blog/blog";
import About from "./components/about/about";
import UserProfile from "./containers/userProfile/userProfile";
import { useState } from "react";
import { useEffect } from "react";




const App = () => {
    const Address = "http://89.32.250.218:8080/MahsinApi"
    // const user={ name: "خشایار", family: "امیرحسینی", id: 25, role: [
    // {id:1,roleName:"admin",recordControl:1},
    // {id:2,roleName:"history",recordControl:1},
    // {id:3,roleName:"doctor",recordControl:1},
    // {id:4,roleName:"history",recordControl:1},
    // {id:5,roleName:"goal",recordControl:1},
    // {id:6,roleName:"blogger",recordControl:1},
    // {id:7,roleName:"facility",recordControl:1},
    // {id:8,roleName:"footer",recordControl:1},
    // {id:9,roleName:"policy",recordControl:1},
    // {id:11,roleName:"service",recordControl:1},
    // {id:12,roleName:"picture",recordControl:1},
    // {id:14,roleName:"achievement",recordControl:1},
    // {id:15,roleName:"footer",recordControl:1},
    // {id:16,roleName:"user",recordControl:1},
    // {id:18,roleName:"manager",recordControl:1}
    // ],phoneNumber:'09370970587',email:'kh.amirhosseini@Gmail.com' ,state:"inactive"}
    //const user={ name: "مهمان", family: "", id: 0, phoneNumber:'',email:'',guest:true}
    
    const user = { userInf: { name: "مهمان", family: "", id: 0, phoneNumber: '', email: '', footer: false }, token: "" }
    const [isAuth, setIsAuth] = useState(false);
    const [athenticatedUser, setAthenticatedUser] = useState(user);
    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setIsAuth(true)
            setAthenticatedUser(foundUser);
        }
    }, [])
    const login = (loggedUser) => {
        setAthenticatedUser(loggedUser);
        setIsAuth(true)
    }
    const logout=()=>{
        setIsAuth(false);
        setAthenticatedUser(user);
        localStorage.removeItem("user")
    }


    return (

        <>
            <div className="container fix">
                <SignInModal address={Address} login={login} />
                <SignUpModal address={Address} />
                <BrowserRouter>
                    <Header address={Address} user={athenticatedUser} isAuth={isAuth} logout={logout} />
                    <NavBar address={Address} user={athenticatedUser} isAuth={isAuth} logout={logout} />
                    <Routes>
                        <Route path='/' element={<Home address={Address} user={athenticatedUser} isAuth={isAuth} />} />
                        <Route path="/blog/:id" element={<Blog address={Address} user={athenticatedUser} isAuth={isAuth} />} />
                        <Route path='/userProfile' element={<UserProfile address={Address} user={athenticatedUser} isAuth={isAuth} logout={logout} />} />
                    </Routes>
                </BrowserRouter>
                <div id="contactUs">
                    <FooterContextProvider address={Address} user={athenticatedUser}>
                        <Footer address={Address} user={athenticatedUser} />
                    </FooterContextProvider>
                </div>
            </div>

        </>);
}

export default App;