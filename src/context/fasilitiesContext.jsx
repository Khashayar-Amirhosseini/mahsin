import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import facilityImage from "../assets/img/image.png"
 

export const FasilitiesContext=createContext()
const FasilitiesProvider = (props) => {
   const Address=props.address
    const [fasility,setFasility]=useState([
        { id: 0, name: "", utility: "", image: facilityImage, description: "", user: {name:"",family:""}, date: new Date }
    ])
    const [isLoading,setIsLoading]=useState(true);
    
     useEffect(
        async()=>{
        const response=await axios({
            method:'get',
            url:`${Address}/action/guest/findAllFacilities.do?`,
            withCredentials:false
        })
        if(response.status=200){
            if(response.data.length>0){
            if(Array.isArray(response.data)) {
                setFasility(response.data) 
            }
            else{
                setFasility([response.data])
            }}
            setIsLoading(false)
            return response;
        }
    },[]);
   
    return ( 
        <FasilitiesContext.Provider value={{fasility,isLoading}}>
                {props.children}
        </FasilitiesContext.Provider>
    );
}
 
export default FasilitiesProvider;