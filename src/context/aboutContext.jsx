import { createContext, useState } from "react";
import sepehr from '../assets/img/sepehr.png'
import ahmadReza from '../assets/img/ahmadreza.png'
import goal1 from '../assets/img/goal1.webp'
import goal2 from '../assets/img/goal2.jpg'
import goal3 from '../assets/img/goal3.jpg'
import goal4 from '../assets/img/goal3.jpg'
import photo1 from '../assets/img/c1.jpg'
import photo2 from '../assets/img/c2.jpg'
import photo3 from '../assets/img/c3.jpg'
import photo4 from '../assets/img/c4.jpg'
import photo5 from '../assets/img/c5.jpg'
import { useEffect } from "react";
import axios from "axios";
export const AboutContext=createContext()
const AboutContextProvider = (props) => {
    const Address=props.address
    const [doctor,setDoctor]=useState([]);
    const[goals,setGoals]=useState([]) 
    const[policies,setPolicies]=useState([]);
    const[acheivment,setAcheivment]=useState([]);
    const[photo,setPhoto]=useState([])
    const[isLoading,setIsLoading]=useState(true);
    const [history,setHistory]=useState({});
    useEffect(async()=>{
        const response1=await axios({
            method: 'get',
            url: `${Address}/action/guest/findAllHistory.do?`,
            withCredentials: false,
          })
          setHistory(response1.data[0])  
    },[])
    useEffect(
        async()=>{
        const response2=await axios({
            method:'get',
            url:`${Address}/action/guest/findAllDoctors.do?`,
            withCredentials:false
        })
        if(response2.status=200){
        if(Array.isArray(response2.data)) {
            setDoctor(response2.data)}
        else{
            setDoctor([response2.data])}
        setIsLoading(false)
        }      
    },[])  
    useEffect(
        async()=>{
        const response=await axios({
            method:'get',
            url:`${Address}/action/guest/findAllGoals.do?`,
            withCredentials:false
        })
        
        if(response.status=200){
        if(Array.isArray(response.data)) {
            setGoals(response.data)
            }
            else{
                setGoals([response.data])
            }}
    },[]) 
    useEffect(
        async()=>{
        const response=await axios({
            method:'get',
            url:`${Address}/action/guest/findAllPolicies.do?`,
            withCredentials:false
        })
        if(response.status=200){
        if(Array.isArray(response.data)) {
            setPolicies(response.data)
            }
        else{
            setPolicies([response.data])
        }}
    },[]) 
    useEffect(
        async()=>{
        const response=await axios({
            method:'get',
            url:`${Address}/action/guest/findAllAchievement.do?`,
            withCredentials:false
        })
        if(response.status=200){
        if(Array.isArray(response.data)) {
            setAcheivment(response.data)
            }
        else{
            setAcheivment([response.data])
        }}
    },[]) 
    useEffect(
        async()=>{
        const response=await axios({
            method:'get',
            url:`${Address}/action/guest/findAllPictures.do?`,
            withCredentials:false
        })
        if(response.status=200){
        if(Array.isArray(response.data)) {
            setPhoto(response.data)
            }
        else{
            setPhoto([response.data])
        }
        
        }
    },[]) 
   
    


    return ( 
        <AboutContext.Provider value={{history,acheivment,goals,policies,photo,isLoading,doctor}}>
            {props.children}
        </AboutContext.Provider>
     );
}
 
export default AboutContextProvider;