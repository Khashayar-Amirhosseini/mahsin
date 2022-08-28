import axios from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";
import Footer from "../components/footer/footer";

export const FooterContext=createContext();
const FooterContextProvider = (props) => {
    const Address=props.address
    const[contacts,setContacts]=useState([{mapSRC:"",
    tel1:"",
    tel2:"",
    tel3:"",
    consultantNumber:"",
    address:"",
    instagram:"",
    telegram:"",
    email:'',
 }]);
    const[isLoading,setIsLoading]=useState(true)
    useEffect(
        async()=>{
        const response=await axios({
            method:'get',
            url:`${Address}/action/guest/findAllFooters.do?`,
            withCredentials:false
        })
        if(response.status==200){
            setIsLoading(false)
            setContacts(response.data); 
        }
                  
    },[]);
    
    return ( 
        <FooterContext.Provider value={{contacts,isLoading}}>
            {props.children}
        </FooterContext.Provider>
     );
}
 
export default FooterContextProvider;