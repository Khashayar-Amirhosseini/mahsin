import { createContext, useContext, useEffect, useState } from "react";
import Thermage from '../assets/img/Thermage-CPT.png'
import Fraxel from '../assets/img/Fraxel.png'
import Motus from '../assets/img/Motus-ax.png'
import monalisatouch from '../assets/img/monalisatouch.png'
import Liposonix from '../assets/img/Liposonix.png'
import axios from "axios";
 

export const FasilitiesContext=createContext()
const FasilitiesProvider = (props) => {
   const Address=props.address
    const [fasility,setFasility]=useState([
        {id:1,name:'',utility:'',description:'',image:Thermage,user:{name:"",family:""} },
    ])
    const [isLoading,setIsLoading]=useState(true);
    
     useEffect(
        async()=>{
        const response=await axios({
            method:'get',
            url:`${Address}action/guest/findAllFacilities.do?`,
            withCredentials:false
        })
        if(response.status=200){
            
            if(Array.isArray(response.data)) {
                setFasility(response.data) 
                }
            else{
                setFasility([response.data])
            }
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