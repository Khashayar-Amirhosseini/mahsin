import axios from "axios";
import { createContext, useContext, useState,useEffect } from "react";
import image1 from '../assets/img/p1.jpg'
import image2 from '../assets/img/p2.jpg'
import image3 from '../assets/img/p3.jpg'
import image4 from '../assets/img/p4.jpg'
import articleImage from '../assets/img/article.jpg'
export const ContentsContext = createContext()
const ContentsContextProvider = (props) => {

    const Address=props.address
    const user={name:"",family:""}
    const keywords={id:0,subtitle:"",user:user}
    const references={id:0,url:"",user:user}
    const paragraphsPic={id:0,url:""}
    const newPaper = { id: 0, title:"مقاله جدید",paragraphs:"",writer:"",paragraphsPic:paragraphsPic,keyword:[keywords], user: user, date: new Date,references:[references] ,image:articleImage,abstract:""}
    const [papers, setPapers]=useState([newPaper]);
    const[isLoading,setIsLoading]=useState(true);
    useEffect(async()=>{
        const response=await axios({
            method: 'get',
            url: `${Address}/action/guest/findAllPosts.do?`,
            withCredentials: false,
          })
          if(response.status=="200"){
            if(response.data.lenght>0){
            if(Array.isArray(response.data)) {
                setPapers(response.data) 
            }    
            else{
                setPapers([response.data])
            }}
            setIsLoading(false)
            
            return response
        }
    },[])
    return (
        <ContentsContext.Provider value={{papers,isLoading}}>
            {props.children}
        </ContentsContext.Provider>
    );
    
    

}

export default ContentsContextProvider;