import { useContext, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import './navbar.css';
import logo from '../../assets/img/Logo.jpg';
import headingPic from '../../assets/img/heading-cream.svg'
import { CSSTransition } from "react-transition-group";
import SignInModal from "../signInModal/signInModal";
import { HashLink } from 'react-router-hash-link';
import axios from "axios";
import DiscountModal from "../discountModal/discountModal";




const NavBar = (props) => {

    const [toggleMenu, setToggleMenu] = useState(false)
    const [scrollHight, setScrollHight] = useState(0)
    const [showNav, setShowNav] = useState(false)
    const user = props.user;
    const [discount,setDiscount]=useState([]);
    const Address=props.address;
    const isAuth=props.isAuth;

    const controlNavbar = () => {
        if (window.scrollY > 350) {
            setShowNav(true)
        } else {
            setShowNav(false)
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', controlNavbar)
        return () => {
            window.removeEventListener('scroll', controlNavbar)
        }
    }, [])
    useEffect(() => {
        onclick = () => {
            if (toggleMenu) {
                setToggleMenu(false);
            }
        }

    })
    

    const logoutHandler = () => {
        props.logout();
    }

    useEffect(async()=>{
        if(isAuth){
                let response = await axios({
                    method: "get",
                    url: `${Address}/action/user/findAllDiscount.do?customerId=${user.userInf.id}`
                })
                setDiscount(response.data) 
        }
    },[isAuth])
    
    
    
    let numberOfDiscount=0
    if(isAuth&&discount.length>0){
    numberOfDiscount=discount.filter((d)=>d.expiredDate>new Date()&&d.state==="active").length;
    numberOfDiscount>10&&(numberOfDiscount="+10")}
    const showDiscountLabel= (isAuth&&(numberOfDiscount>0))
    const[discountModal,setDiscountModal]=useState(false)
    const showDiscountModal=()=>{
        setDiscountModal(!discountModal)
    }
    return (



        <>
            <nav className='expanded-navbar' >
                <ul className="nav-list-items ">
                    <li className="nav-item ml-2 ">
                        <NavLink className="nav-link " aria-current="page" to="/" >خانه</NavLink>
                    </li>
                    <li className="nav-item">
                    <HashLink className="nav-link" to="/#about">درباره ما</HashLink>  
                    </li>
                    <li className="nav-item">
                    <HashLink className="nav-link" to="/#services">خدمات</HashLink>  
                    </li>
                    <li className="nav-item">
                    <HashLink className="nav-link" to="/#contents">مقالات</HashLink>  
                    </li>
                    <li className="nav-item">
                    <HashLink className="nav-link" to="/#fasilites">تجهیزات</HashLink>  
                    </li>
                    {(!isAuth)&&(<li className="nav-item">
                        <a className="nav-link" aria-current="page" data-bs-toggle="modal" data-bs-target="#signIn" to="#signIn" style={{ cursor: "pointer" }} >عضویت/ورود</a>
                    </li>)}
                    {showDiscountLabel&&(<li className="nav-item position-relative">
                               <button className="nav-link" onClick={showDiscountModal}>تخفیفات شما 
                               <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{numberOfDiscount}<span className="visually-hidden">unread messages</span>
                               </span>
                               </button>
                    </li>)}
                </ul>
            </nav>
            <button className="togbut" type="button" onClick={() => { setToggleMenu(true) }}>
                <i className="fa fa-bars fa-2x" aria-hidden="true"></i>
            </button>


            {toggleMenu && (
                <div className="navbar-small-screen"  >
                    <div className="row" style={{ justifyContent: "left" }}>
                        <button type="button" className="btn-close" aria-label="Close" onClick={() => { setToggleMenu(false) }}></button>
                    </div>

                    {isAuth&&(
                        <div className="row">
                            <div className="col-10" style={{ fontFamily: "bYekan" }}>
                                <div><h3><NavLink to="mahsin/userProfile"><i className="fa fa-user-circle-o " style={{ marginLeft: 5 }} aria-hidden="true"></i></NavLink></h3><h3>{user.userInf.name} {user.userInf.family}</h3></div>
                            </div>
                            <div className='col-2' style={{ textAlign: 'left' }} >
                                <button style={{ backgroundColor: "rgba(0, 0, 0, 0)", border: 'none', height: "100%" }} onClick={logoutHandler}><i className="fa fa-power-off" aria-hidden="true"></i></button>
                            </div>

                        </div>)}
                    <div className="row">
                        <img src={headingPic} style={{ width: "100%" }} />
                    </div>

                    <div className="row">
                        <ul className="slider-nav">
                            <li className="small-screen-nav-item ml-2 ">
                                <NavLink className="small-screen-nav-item" aria-current="page" to="/" >خانه</NavLink>
                            </li>
                            <li className="nav-item">
                                <HashLink className="small-screen-nav-item" to="/#about">درباره ما</HashLink>
                            </li>
                            <li className="nav-item">
                                <HashLink className="small-screen-nav-item" to="/#contactUs">تماس با ما</HashLink>
                            </li>
                            <li className="nav-item">
                                <HashLink className="small-screen-nav-item" to="/#services">خدمات</HashLink>
                            </li>
                            <li className="nav-item">
                                <HashLink className="small-screen-nav-item" to="/#contents">مقالات</HashLink>
                            </li>
                            <li className="nav-item">
                                <HashLink className="small-screen-nav-item" to="/#fasilites">تجهیزات</HashLink>
                            </li>
                            {!isAuth&&(<li className="nav-item">
                                <a style={{ cursor: "pointer" }} className="small-screen-nav-item" aria-current="page" data-bs-toggle="modal" data-bs-target="#signIn" to="#signIn" >عضویت/ ورود</a>
                            </li>)}
                            {showDiscountLabel&&(<li className="nav-item position-relative" style={{width:"90px"}}>
                               <button className="small-screen-nav-item" onClick={showDiscountModal}>تخفیفات شما 
                               <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{numberOfDiscount}<span className="visually-hidden">unread messages</span>
                               </span>
                               </button>
                             </li>)}
                        </ul>
                    </div>


                </div>


            )}
            {showNav && (
                <nav className='expanded-navbar alwaysTop' >
                    
                    {isAuth ? <NavLink  to="mahsin/userProfile"><i className="fa fa-user-circle-o navUserProfile" aria-hidden="true"></i></NavLink> : <></>}
                    
                    <ul className="nav-list-items" style={{justifyContent:"center"}}>
                        
                        <li className="nav-item ml-2 ">
                            <NavLink className="nav-link2 " aria-current="page" to="/" >خانه</NavLink>
                        </li>
                        <li className="nav-item">
                            <HashLink className="nav-link2" to="/#about">درباره ما</HashLink>
                        </li>
                        <li className="nav-item">
                            <HashLink className="nav-link2" to="/#contactUs">تماس با ما</HashLink>
                        </li>
                        <li className="nav-item">
                            <HashLink className="nav-link2" to="/#services">خدمات</HashLink>
                        </li>
                        
                        <li className="nav-item">
                            <HashLink className="nav-link2" to="/#contents">مقالات</HashLink>
                        </li>
                        <li className="nav-item">
                            <HashLink className="nav-link2" to="/#fasilites">تجهیزات</HashLink>
                        </li>
                        {!isAuth&&(<li className="nav-item">
                            <a className="nav-link2" aria-current="page" data-bs-toggle="modal" data-bs-target="#signIn" to="#signIn" style={{ cursor: "pointer" }}>عضویت/ورود</a>
                        </li>)}
                        {showDiscountLabel&&(<li className="nav-item position-relative">
                               <button className="nav-link2" onClick={showDiscountModal}>تخفیفات شما 
                               <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{numberOfDiscount}<span className="visually-hidden">unread messages</span>
                               </span>
                               </button>
                              </li>)}
                    </ul>
                    
                    {isAuth ? <button style={{ backgroundColor: "rgba(0, 0, 0, 0)", border: 'none',height:"100%",position:"absolute",left:30 }} onClick={logoutHandler}><i className="fa fa-power-off" aria-hidden="true"></i></button>: <></>}
                </nav>
            )}
            {showNav && (
                <button className="togbut togbut-onTop " type="button" onClick={() => { setToggleMenu(true) }}>
                    <i className="fa fa-bars fa-2x" aria-hidden="true"></i>
                </button>
            )
            }
            {discountModal&&(
            <DiscountModal discount={discount} showDiscountModal={showDiscountModal}/>)}
            
             
        </>
    )
}

export default NavBar;