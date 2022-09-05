import axios from "axios";
import { useState } from "react"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import * as yup from 'yup';
import './about.css'


const History = (props) => {
    const Address=props.address
    const[history,setHistory]=useState(props.history)
    const [isSaved, setIsSaved]=useState(true)
    const[errors,setErrors]=useState([])
    const [isSending,setIsSending]=useState(false)
    const user=props.user
  
   

    function handleChange(e){
        const input=e.currentTarget;
        let His={...history}
        His.description=input.value;
        setHistory(His) 
        setIsSaved(false)
    }
    let schema=yup.object().shape({
        description:yup.string().required('فیلد تاریخچه رو نباید خالی بذاری.')
    })
    const validate=async()=>{
        try{
           const result= await schema.validate(history,{abortEarly:false});
            return result
        }
        catch(error){
           setErrors(error.errors)  
        }
       
    }
    const submitHandler= async(e)=>{
        
        setErrors([])
        e.preventDefault();
        const result=await validate();
        if(result&&!isSaved){
        setIsSending(true)   
            try{
                
                const response=await axios({
                method: "get",
                url: `${Address}/action/history/historySave.do?description=${history.description}&userId=${user.userInf.id}`,
                headers:{'Access-Token':`${user.token}`}
                }) 
                setIsSaved(true)
                setIsSending(false)
            }
            catch(e){
                if(e.response){
                if(e.response.status===700){
                    setErrors(["دسترسی مورد نیاز فراهم نشده است."]) 
                }}
                else{
                    setErrors(["مشکل در سرور پیش اومده"])  
                }
               
               setIsSending(false)          
            }   
        }
        
    }

    return (
        (user.userInf.history||user.userInf.viewer)?
            <div className="accordion-body">
                <form>
                    <textarea name="description"  value={history.description} onChange={handleChange}/>
                    <div className="update-des">
                    <button  className={isSaved?'btn btn-outline-success':'btn btn-outline-danger' } disabled={isSending} onClick={submitHandler}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>                                        
                    <p >{history.user.family+` `+history.user.name}   </p>
                    <p >({new Date((history.date)).toLocaleDateString('fa-IR')})</p>
                    </div>
                    
                </form>
                {
                errors.length!==0 &&(
                    <p className="Errors" >{errors}</p>
                )}
                
            </div>:
            <div className="accordion-body">
                {history.description}
            </div>
        
     );

}
 
export default History;