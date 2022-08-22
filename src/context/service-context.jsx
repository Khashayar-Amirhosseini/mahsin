import { createContext, useState } from "react";
import lazerServices from '../assets/img/hair-removal-with-laser.jpg'
import hairService from '../assets/img/skin-hair-service.jpg'
import surgeryServices from '../assets/img/serive_labiaplasty.jpg'
import { useEffect } from "react";
import axios from "axios";


export const ServiceContext=createContext()
const ServiceContextProvider = (props) => {
    /*const [cluster, setCluster]=useState([
        {id:1,title:'پوست و مو',image:hairService,services:[{id:1,title:'بوتاکس'},{id:2,title:'تزریق ژل'},{id:3,title:'هایفو'}]},
        {id:2,title:'لیزر موهای زائد',image:lazerServices,services:[{id:1,title:'لیزر آقایان'},{id:2,title:'لیزر بانوان'}]},
        {id:3,title:'جراحی های زیبایی',image:surgeryServices,services:[{id:1,title:'جراحی بینی'},{id:2,title:'بوتاکس'}]}
     ])*/
     const [cluster, setCluster]=useState([]);
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