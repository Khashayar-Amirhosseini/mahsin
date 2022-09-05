import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import axios from "axios";

const Goal = (props) => {
    const Address = props.address
    const[goal,setGoal]=useState(props.goal)
    const user=props.user
    const [selectedFile,setSelectedFile]=useState(goal.files);
    const [image,setImage]=useState(goal.image)
    const [checked, setChacked] = useState(true)
    const [errors, setErrors] = useState([])
    const [isSending, setIsSending] = useState(false)
    const createGoal=props.createGoal;
    const deleteGoal=props.deleteGoal;
    const isDisable=props.isDisable
    const index=props.index;
    

    const handleChange=(e)=>{
        const input = e.currentTarget;
        let newGoal={...goal};
        newGoal.description=input.value;
        if (newGoal.description !== goal.description) {
            newGoal.isChange=true
            props.onchange(e,newGoal,index)
        }
        
    }
    const uploadFile=(e)=>{
        setImage(URL.createObjectURL(e.target.files[0]))
        const newGoal={...goal};
        newGoal.image=URL.createObjectURL(e.target.files[0]);
        newGoal.isChange=true
        newGoal.files=e.target.files[0];
        props.onchange(e,newGoal,index)    
      }
      const onClickHandler = (e) => {
        const newGoal = { ...goal }
        if (newGoal.state === "active") {
            newGoal.state = "inactive"
        }
        else {
            newGoal.state = "active"
        }
        setChacked(!checked)
        newGoal.isChange=true
        props.onchange(e,newGoal,index)
    }
    let schema=yup.object().shape({
        description:yup.string().required('فیلد شرح هدف رو نباید خالی بذاری.'),
    })
    const validate=async()=>{
        try{
           const result= await schema.validate(goal,{abortEarly:false});
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
        const formData=new FormData;
        

        if(result&&result.isChange){ 
        setIsSending(true)
        formData.append("description",result.description);
        formData.append("state",result.state);
        formData.append("file",(selectedFile===undefined)?new File([""], "filename"):selectedFile);
        formData.append("userId",user.userInf.id)  
             if(result.id!==0){  
             formData.append("id",result.id);
              try{  
                  const response=await axios({
                     method: "post",
                     url: `${Address}/action/goal/updateGoal.do`,
                     data: formData,
                     headers: { "enctype": "multipart/form-data" ,'Access-Token':`${user.token}`},
                   })
                   
                   const newGoal={...result}
                   newGoal.isChange=false
                   props.onchange(e,newGoal,index)
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
              } }
              else{
                 try{  
                     const response=await axios({
                        method: "post",
                        url: `${Address}/action/goal/saveGoal.do`,
                        data: formData,
                        headers: { "enctype": "multipart/form-data" ,'Access-Token':`${user.token}`},
                      })
                    const newGoal={...result}
                   newGoal.id=response.data.id;
                   newGoal.isChange=false
                   props.onchange(e,newGoal,index)
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
        
    }
    const addHandeler=(e)=>{
        
        e.preventDefault()
        createGoal(e)
    }
    const deleteHandler=async(e)=>{
        setIsSending(false)
        e.preventDefault();
        deleteGoal(e,goal.id)
         try{  
             const response=await axios({
                method: "get",
                url: `${Address}/action/admin/deleteGoal.do?goalId=${goal.id}`,
                headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}` },
              })
             deleteGoal(e,goal.id) 
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
    return ( 
        (user.userInf.goal||user.userInf.viewer)?<>
        <div key={uuidv4()} className="col-md-3 p-2">
                    <div key={uuidv4()} className="card" >
                        <form className="goal-form">
                        <img key={uuidv4()} src={image} className="card-img-top" alt="تصویر هدف" />
                        <input key={uuidv4()} type="file" name="file" id={props.itemKey} className="inputfile" encType="multipart/form-data" onChange={(e)=>uploadFile(e)}/>
                            <label key={uuidv4()} htmlFor={props.itemKey}><i className="fa fa-cloud-upload"  aria-hidden="true" ></i></label>
                        <div key={uuidv4()} className="card-body">
                            <input type='text' name="description" className="card-text" placeholder="شرح هدف" defaultValue={goal.description} onBlur={(e)=>handleChange(e)}/>
                        </div>
                        <label className="switch">
                                    <input type="checkbox" checked={goal.state === "active" ? true : false} onChange={onClickHandler} />
                                    <span className="slider round"></span>
                                </label>
                        <div className="row form-button">
                            <div>
                            <button className={goal.isChange ? 'btn btn-outline-danger' : ' btn btn-outline-success'} disabled={isSending} onClickCapture={submitHandler}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
                            <button type="button" className="btn btn-outline-primary" onClick={(e)=>addHandeler(e)} disabled={isSending}><i className="fa fa-plus" aria-hidden="true" ></i></button>
                            <button className="btn btn-outline-danger" disabled={isSending||isDisable} onClick={(e)=>deleteHandler(e)}><i className="fa fa-times" aria-hidden="true"></i></button>
                            </div>
                        </div>
                        <div className="row ">
                            <div className="doctor-update-des">
                                <p >{goal.user.family + ` ` + goal.user.name}   </p>
                                <p >({new Date((goal.date)).toLocaleDateString('fa-IR')})</p>
                            </div>
                        </div>
                        </form>
                        <ul>
                    {errors.length !== 0 && (errors.map((er) => {
                        return (
                            <li key={uuidv4()} className="Error-list">
                                <p key={uuidv4()} className="Errors" >{er}</p>
                            </li>
                        )
                    }))}
                </ul>

                    </div>
                    
                </div>

        </> :<>
        {goal.state == "active"?<>
         <div key={uuidv4()} className="col-md-3 p-2">
                    <div key={uuidv4()} className="card" >
                        <img key={uuidv4()} src={goal.image} className="card-img-top" alt="..." />
                        <div key={uuidv4()} className="card-body">
                            <p key={uuidv4()} className="card-text">{goal.description}</p>
                        </div>
                    </div>
                </div>
         </>:
         <></>}
        </>
         
        )
}
 
export default Goal;