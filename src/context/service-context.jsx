import { createContext, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import serviceImage from "../assets/img/image.png"


export const ServiceContext=createContext()
const ServiceContextProvider = (props) => {
    
     const [cluster, setCluster]=useState([{id:0,title:"",description:"",image:serviceImage,services:[{id:0,title:"",description:"",user:{name:"",family:""},date:new Date}],user:{name:"",family:""},date:new Date}]);
     const[isLoading,setIsLoading]=useState(true);
     const Address=props.address
     useEffect(
        async()=>{
        const response=await axios({
            method:'get',
            url:`${Address}/action/guest/findAllMainServices.do?`,
            withCredentials:false
        })
        if(response.status=="200"){
            if(Array.isArray(response.data)) {
                setCluster(response.data)
                }
            else{
                setCluster([response.data])
            }
            setIsLoading(false);
        }  
    },[]) 

    return ( 
        <ServiceContext.Provider value={{cluster,isLoading}}>
                {props.children}
        </ServiceContext.Provider>
     );
}
 
export default ServiceContextProvider;