
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import axios from "axios";
import Serv from "./serv";
import Services from "./services";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";


const ServiceCard = (props) => {
    const Address = props.address;
    const [cluster, setCluster] = useState(props.cluster)
    const [errors, setErrors] = useState([])
    const [isSending, setIsSending] = useState(false)
    const [checked, setChacked] = useState(true)
    const [selectedFile, setSelectedFile] = useState(cluster.files);
    const user = props.user;
    const [image, setImage] = useState(cluster.image)
    const createCluster = props.createCluster
    const bullet = props.bullet
    const isDisable = props.isDisable
    const [deleteDisable, setDeleteDisable] = useState(false)
    const index=props.index;
    const papers=props.papers;
    const [serviceId,setServiceId]=useState();
     useEffect(
         ()=>{
             papers.map((p,i)=>{
                 p.title===cluster.title&&(
                 setServiceId(i))                
             })
         }
         ,[])
    


    if(cluster.services.length===0){
        const newCluster={...cluster}
        newCluster.services=[{id:0,title:"",description:"",user:user,date:new Date}]
        setCluster(newCluster)
    }

    const handleChange = (e) => {
        const input = e.currentTarget;
        let clus = { ...cluster }
        clus[input.name] = input.value;
        if (clus[input.name] !== cluster[input.name]) {
            clus.isChange=true
            props.onchange(e,clus,index)
        }
    }


    const onClickHandler = (e) => {
        const newCluster = { ...cluster }
        if (newCluster.state === "active") {
            newCluster.state = "inactive"
        }
        else {
            newCluster.state = "active"
        }
        setCluster(newCluster)
        setChacked(!checked)
        newCluster.isChange=true
        props.onchange(e,newCluster,index)
    }
    let schema = yup.object().shape({
        title: yup.string().required('فیلد شرح نام خدمت رو نباید خالی بذاری.'),
    })
    const validate = async () => {
        try {
            const result = await schema.validate(cluster, { abortEarly: false });
            return result
        }
        catch (error) {
            setErrors(error.errors)
        }

    }
    const submitHandler = async (e) => {
        e.preventDefault();
        if(cluster.isChange===true){
        
        setErrors([])
        const result = await validate();
        const formData = new FormData;
        if (result&&result.isChange) {
            setIsSending(true)
            formData.append("title", result.title);
            formData.append("description", result.description);
            formData.append("state", result.state);
            formData.append("file", (selectedFile===undefined)?new File([""], "filename"):selectedFile);
            formData.append("userId", user.userInf.id)

            if (result.id !== 0) {
                formData.append("id", result.id);
                 try {
                      const response = await axios({
                          method: "post",
                          url: `${Address}/action/service/updateMainService.do`,
                          data: formData,
                          headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}` },
                      })
                      const newCluster=result
                      newCluster.id=response.data.id;
                      newCluster.isChange=false
                      props.onchange(e,newCluster,index)
                 }
                 catch (e) {
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
            else {
                 try {
                      const response = await axios({
                        method: "post",
                        url: `${Address}/action/service/saveMainService.do`,
                       data: formData,
                       headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}` },
                     })
                    const newCluster=result
                    newCluster.id=response.data.id
                    newCluster.isChange=false
                    props.onchange(e,newCluster,index)
                    
                 }
                 catch (e) {
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
            setIsSending(false)
        }
        }
    }
    const uploadFile = (e) => {
        
        setImage(URL.createObjectURL(e.target.files[0]))
        const newCluster={...cluster}
        newCluster.image=URL.createObjectURL(e.target.files[0])
        newCluster.isChange=true
        newCluster.files=e.target.files[0]
        props.onchange(e,newCluster,index)
    }
    const addCluster = (e) => {
        e.preventDefault()
        createCluster(e)
    }
    const deleteHandler = async (e) => {
        setIsSending(true)
        e.preventDefault();
        if(cluster.services[0].id!==0){
            console.log(cluster.services[0].id)
            setErrors(["باید اول همه زیر خدمت ها این گروه رو حذف کنی"])
        }
        else{
        try {
             const response = await axios({
                 method: "get",
                 url: `${Address}/action/admin/deleteMainService.do?mainServiceId=${cluster.id}`,
                 headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}` },
             })
            props.deleteCluster(e, cluster.id)
        }
        catch (e) {
            if(e.response){
                if(e.response.status===700){
                    setErrors(["دسترسی مورد نیاز فراهم نشده است."]) 
                }}
                else{
                    setErrors(["مشکل در سرور پیش اومده"])  
                }
               setIsSending(false) 
        }}

    }
    const createService = (e) => {
        e.preventDefault()
        const newCluster = { ...cluster }
        const newService = {id:0,title:"",description:"",user:user,date:new Date}
        newCluster.services.push(newService)
        setCluster({ ...newCluster })
    }
    const deleteService = (e, id) => {
        e.preventDefault(e)
        const newCluster = { ...cluster }
        newCluster.services = newCluster.services.filter(d => d.id !== id)
        setCluster({ ...newCluster })
    }
    const onChangeService=(e,state,index)=>{
        const newCluster={...cluster}
        newCluster.services[index]=state;
        setCluster(newCluster);
    }




    return (
        user.userInf.service ?
            <>
                <li key={uuidv4()} className="services col-md-4 col-12">
                    <div key={uuidv4()} className='cluster-form row'>
                        <form>
                            <div className="ih-item square effect6 from_top_and_bottom">
                                <div>
                                    <img className="TitlePic" src={image} />
                                    <div className="info">
                                        <h3 >{cluster.title}</h3>
                                        {cluster.services.map((s) => {
                                            if (s.state == "active") {
                                                return <p key={uuidv4()} >{s.title}</p>
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <input key={uuidv4()} type="file" name="file" id={props.itemKey} className="inputfile" encType="multipart/form-data" onChange={(e) => uploadFile(e)} />
                                <label key={uuidv4()} htmlFor={props.itemKey}><i className="fa fa-cloud-upload" aria-hidden="true" ></i></label>
                            </div>
                            <div className='subTitle'>

                                <img className="bullet" src={bullet} />
                                <h4><input type="text" name="title" defaultValue={cluster.title} placeholder="گروه خدمت" onBlur={handleChange} /></h4>
                            </div>
                            <label className="switch">
                                <input type="checkbox" checked={cluster.state === "active" ? true : false} onChange={onClickHandler} />
                                <span className="slider round"></span>
                            </label>

                            <div className="row form-button">
                                <div>
                                    <button className={!cluster.isChange ? ' btn btn-outline-success' : 'btn btn-outline-danger'} disabled={isSending} onClickCapture={submitHandler}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
                                    <button type="button" className="btn btn-outline-primary" onClick={addCluster} disabled={isSending}><i className="fa fa-plus" aria-hidden="true" ></i></button>
                                    <button className="btn btn-outline-danger" disabled={isSending || isDisable} onClick={deleteHandler}><i className="fa fa-times" aria-hidden="true"></i></button>
                                </div>
                            </div>
                            </form>
                            <div className="row ">
                                <div className="cluster-update-des">
                                    <p >{cluster.user.family + ` ` + cluster.user.name}   </p>
                                    <p >({new Date((cluster.date)).toLocaleDateString('fa-IR')})</p>
                                </div>
                            </div>
                            
                                {cluster.services.map((s,i) => {
                                    return (
                                        <Serv key={uuidv4()} itemKey={uuidv4()} user={user} service={s} createService={createService} deleteService={deleteService} deleteDisable={deleteDisable} address={Address} mainServiceId={cluster.id} onchange={onChangeService} index={i}/>
                                    )
                                })}     
                    </div>

                    <ul>
                        {errors.length !== 0 && (errors.map((er) => {
                            return (
                                <li key={uuidv4()} className="Error-list">
                                    <p key={uuidv4()} className="Errors" >{er}</p>
                                </li>
                            )
                        }))}
                    </ul>
                </li>

            </> :

            (cluster.state == "active") ?
                <li key={uuidv4()} className="services col-md-4 col-12">
                    <div className=" ih-item square effect6 from_top_and_bottom">
                        <NavLink to={`/blog/${serviceId}`}>
                            <img className="TitlePic" src={cluster.image} />
                            <div className="info">
                                <h3>{cluster.title}</h3>
                                {cluster.services.map((s) => {
                                    if (s.state == "active") {
                                        return <p key={uuidv4()} >{s.title}</p>
                                    }
                                })}
                            </div>
                        </NavLink>
                    </div>
                    <div className=' subTitle'>
                        <h4>{cluster.title}</h4>
                    </div>
                </li> :
                <></>
    );
}

export default ServiceCard;