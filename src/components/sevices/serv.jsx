import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import axios from "axios";

const Serv = (props) => {
    const [service, setService] = useState(props.service)
    const [errors, setErrors] = useState([])
    const [isSending, setIsSending] = useState(false)
    const [checked, setChacked] = useState(true)
    const user = props.user;
    const createService = props.createService;
    const isDisable = props.deleteDisable;
    const Address = props.address;
    const mainServiceId = props.mainServiceId;
    const index=props.index;
    

    const handleChange = (e) => {
        const input = e.currentTarget;
        let serv = { ...service }
        serv[input.name] = input.value;
        serv.isChange=true
        props.onchange(e,serv,index)
    }
    let schema = yup.object().shape({
        title: yup.string().required('فیلد نام زیرخدمت رو نباید خالی بذاری.'),
    })
    const validate = async () => {
        try {
            const result = await schema.validate(service, { abortEarly: false });
            return result
        }
        catch (error) {
            setErrors(error.errors)
        }

    }
    const submitHandler = async (e) => {
        e.preventDefault();
        if (service.isChange === true) {
            
            setErrors([])
            const result = await validate();
            const formData = new FormData;
            if (result) {
                setIsSending(true)
                if (result.id !== 0) {
                    try {
                        const response = await axios({
                            method: "get",
                            url: `${Address}/action/service/updateService.do?id=${result.id}&title=${result.title}&description=${result.description}&state=${result.state}&userId=${user.userInf.id}`,
                            headers: { 'Access-Token':`${user.token}`}
                        })
                        const newService=result;
                        newService.isChange=false;
                        props.onchange(e,newService,index)
                        setIsSending(false) 
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
                            method: "get",
                            url: `${Address}/action/service/saveService.do?title=${result.title}&description=${result.description}&mainServiceId=${mainServiceId}&userId=${user.userInf.id}`,
                            headers: { 'Access-Token':`${user.token}`}
                        })
                        const newService=result;
                        newService.id=response.data.id
                        newService.isChange=false;
                        setService(newService)
                        props.onchange(e,newService,index)
                        setIsSending(false)
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

            }
            
        }
    }
    const addService = (e) => {
        e.preventDefault()
        createService(e)
    }
    const deleteHandler = async (e) => {
        setIsSending(false)
        e.preventDefault();
        props.deleteService(e, service.id)
        try {
            const response = await axios({
                method: "get",
                url: `${Address}/action/admin/deleteService.do?serviceId=${service.id}`,
                headers: { 'Access-Token':`${user.token}`}
            })
            props.deleteService(e, service.id)
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
    const onClickHandler = (e) => {
        const newService = { ...service }
        if (newService.state === "active") {
            newService.state = "inactive"
        }
        else {
            newService.state = "active"
        }
        setService(newService)
        setChacked(!checked)
        newService.isChange=true
        props.onchange(e,newService,index)
    }
    return (
        <>
            <div className="serv row">
                <input name="title" type="text" defaultValue={service.title} placeholder="نام زیر حدمت" onBlur={handleChange} />
                <textarea name="description" type="textaria" defaultValue={service.description} placeholder="شرح زیر خدمت" onBlur={handleChange} />
                <label className="switch">
                    <input type="checkbox" checked={service.state === "active" ? true : false} onChange={onClickHandler} />
                    <span className="slider round"></span>
                </label>
                <div className="row form-button">
                    <div>
                        <button className={!service.isChange ? ' btn btn-outline-success' : 'btn btn-outline-danger'} onClick={submitHandler}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
                        <button type="button" className="btn btn-outline-primary" onClick={addService} disabled={isSending}><i className="fa fa-plus" aria-hidden="true" ></i></button>
                        <button className="btn btn-outline-danger" disabled={isSending || isDisable} onClick={deleteHandler}><i className="fa fa-times" aria-hidden="true"></i></button>
                    </div>
                </div>
                <div className="row ">
                    <div className="cluster-update-des">
                        <p >{service.user.family + ` ` + service.user.name}   </p>
                        <p >({new Date((service.date)).toLocaleDateString('fa-IR')})</p>
                    </div>
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
            </div>
        </>
    );
}

export default Serv;