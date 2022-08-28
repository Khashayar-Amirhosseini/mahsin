
import './header.css';
import logo2 from '../../assets/img/logo.png'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import HeaderLoading from './headerLoading';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Link, NavLink } from 'react-router-dom';
import UserProfile from '../../containers/userProfile/userProfile';
import { calculateNewValue } from '@testing-library/user-event/dist/utils';
const Header = (props) => {
    const Address=props.address;
    const user=props.user;
    const [headerContact,setCHeaderContact]=useState([{
        instagram:"",
        telegram:"",
        email:'',
        phone1:'',
        phone2:'',
        phone3:'',
        address:'',
        mapSrc:'',
        consultantNumber:'',
    }]);
    const[isLoading,setIsLoading]=useState(true);
    useEffect(
        async()=>{
            const response=await axios({
                method:'get',
                url:`${Address}/action/guest/findAllFooters.do?`,
                withCredentials:false
            })
            
            if(response.status==200) {
                setIsLoading(false)
                setCHeaderContact(response.data)
            }   
        },[]);
    const isAuth=props.isAuth;

    const logoutHandler=()=>{
        props.logout();
    }
         
    return (
        <header className="main-header">
            {isAuth?
            <div className='row  userProfile'>
                <div className='col-6'>
                <div style={{float:"right",width:"auto"}}><NavLink to="/userProfile"><i className="fa fa-user-circle-o" aria-hidden="true"></i></NavLink></div>
                <p style={{float:"right",width:"auto"}}>سلام {user.userInf.name} عزیز </p>
                </div>
                <div className='col-6'style={{textAlign:'left'}} >
                <button style={{backgroundColor:"rgba(0, 0, 0, 0)",border:'none'}} onClick={logoutHandler}><i className="fa fa-power-off" aria-hidden="true"></i></button>
                </div>
                
            </div>:<></>
            }
            <div className="top-menu">
                <div className='row'>
                    <div className="s1 col-md-6 col-sm-6">
                        <div className="socials">
                            {isLoading?
                            <>
                            <HeaderLoading/>
                            </>
                            :
                            <>
                            <a href={headerContact[0].instagram} ><i className="fa fa-instagram"></i></a>
                            <a href={headerContact[0].telegram}><i className="fa fa-telegram"></i></a>
                            <a href={headerContact[0].email}><i className="fa fa-envelope"></i></a>
                            </>}  
                        </div>
                    </div>
                    
                    <div className="s2 col-md-6 col-sm-6">
                        <div className="phone-number">
                            <p> مشاوره رایگان تلفنی: </p>
                            {isLoading?
                            <>
                                <SkeletonTheme baseColor="#F3B40D" highlightColor="#444" width={50}>
                                <Skeleton width={100} height={20} className="socialSkeleton"/>
                                </SkeletonTheme>
                            </>
                            
                            :
                            <>
                            <a href={"tel:"+headerContact[0].consultantNumber}>{headerContact[0].consultantNumber}</a>
                            <i className="fa fa-phone" aria-hidden="true"></i>
                            </>
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
            <div className="logo col-md-12">
                <a href="#" className="logo col-md-12">
                    <img src={logo2} />
                </a>
            </div>
            {isLoading?
            <>
            <div className='small-screen row'>
                    <div className="s1 col-md-6 col-sm-6">
                        <div className="socials">
                        <HeaderLoading/>
                        </div>
                    </div>
                    
                    <div className="s2 col-md-6 col-sm-6">
                        <div className="phone-number">
                            <p> مشاوره رایگان تلفنی: </p>
                            <SkeletonTheme baseColor="#F3B40D" highlightColor="#444" width={50}>
                                <Skeleton width={100} height={20} className="socialSkeleton"/>
                            </SkeletonTheme>
                        </div>
                    </div>
                </div>
            

            </>:
            <>
            <div className='small-screen row'>
                    <div className="s1 col-md-6 col-sm-6">
                        <div className="socials">
                            <a href={headerContact[0].instagram} ><i className="fa fa-instagram"></i></a>
                            <a href={headerContact[0].telegram}><i className="fa fa-telegram"></i></a>
                            <a href={headerContact[0].email}><i className="fa fa-envelope"></i></a>
                        </div>
                    </div>
                    
                    <div className="s2 col-md-6 col-sm-6">
                        <div className="phone-number">
                            <p> مشاوره رایگان تلفنی: </p>
                            <a href={"tel:"+headerContact[0].consultantNumber}>{headerContact[0].consultantNumber}</a>
                            <i className="fa fa-phone" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
            </>}
            

        </header>
    );
}

export default Header;