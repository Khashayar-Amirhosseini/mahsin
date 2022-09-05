
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import * as yup from 'yup';
import axios from "axios";
const Acheivement = (props) => {
    const [acheivment, setAcheivment] = useState(props.acheivment)
    const Address = props.address;
    const [errors, setErrors] = useState([])
    const [isSending, setIsSending] = useState(false)
    const [checked, setChacked] = useState(true)
    const user = props.user;
    const createAcheivment = props.createAchievment;
    const deleteAcheivment = props.deleteAcheivement;
    const isDisable=props.isDisable;
    const index=props.index;
    
    const handleChange = (e) => {
        const input = e.currentTarget;
        let ach = { ...acheivment }
        ach[input.name] = input.value;
        if (ach[input.name] !== acheivment[input.name]) {
            ach.changed=true;
            props.onchange(e,ach,index)
        }
    }


    const onClickHandler = (e) => {
        const newAcheivment = { ...acheivment }
        if (newAcheivment.state === "active") {
            newAcheivment.state = "inactive"
        }
        else {
            newAcheivment.state = "active"
        }
        setChacked(!checked)
        newAcheivment.changed=true;
        props.onchange(e,newAcheivment,index)
    }
    let schema = yup.object().shape({
        description: yup.string().required('شرح افتخارتونو افتخار بدین بنویسین :)'),
    })
    const validate = async () => {
        try {
            const result = await schema.validate(acheivment, { abortEarly: false });
            return result
        }
        catch (error) {
            setErrors(error.errors)
        }

    }
    const submitHandler = async (e) => {
        setErrors([])
        e.preventDefault();
        const result = await validate();
        const formData = new FormData;
        if (result&&result.changed) {
            setIsSending(true)
            formData.append("description", result.description);
            formData.append("userId", user.id)
            if (result.id !== 0) {
                formData.append("id", result.id);
                try {
                    const response = await axios({
                        method: "get",
                        url: `${Address}/action/achievement/achievementUpdate.do?id=${acheivment.id}&description=${acheivment.description}&state=${acheivment.state}&userId=${user.userInf.id}`,
                        headers: { 'Access-Token':`${user.token}`},
                    })
                    const newAcheivemet=result;
                    newAcheivemet.changed=false;
                    props.onchange(e,newAcheivemet,index)
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
                        url: `${Address}/action/achievement/achievementSave.do?description=${acheivment.description}&userId=${user.userInf.id}`,
                        headers: { 'Access-Token':`${user.token}`},
                    })
                    const newAcheivemet=result;
                    newAcheivemet.id=response.data.id;
                    newAcheivemet.changed=false;
                    props.onchange(e,newAcheivemet,index)
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

    const addHandler = (e) => {
        e.preventDefault()
        createAcheivment(e)
    }
    const deleteHandler = async (e) => {
        e.preventDefault();
        setIsSending(true)
        try {
            const response = await axios({
                method: "get",
                url: `${Address}/action/admin/deleteAchievement.do?achievementId=${acheivment.id}`,
                headers: { 'Access-Token':`${user.token}`},
            })
            deleteAcheivment(e, acheivment.id)

        }
        catch (e) {
            setErrors(["مشکل در سرور پیش اومده"])
        }

    }
    return (
        (user.userInf.achievement||user.userInf.viewer)?
            <>

                <li key={uuidv4()}>
                    <form className="acheivement-form">
                        <input type="text" name='description' defaultValue={acheivment.description} onBlur={handleChange} placeholder='شرح افتخار...' /><i className="fa fa-hand-o-left" aria-hidden="true"></i>
                        <label className="switch">
                            <input type="checkbox" checked={acheivment.state === "active" ? true : false} onChange={onClickHandler} />
                            <span className="slider round"></span>
                        </label>
                        <div className="row form-button">
                            <div>
                                <button className={!acheivment.changed ? ' btn btn-outline-success' : 'btn btn-outline-danger'} disabled={isSending} onClickCapture={submitHandler}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
                                <button type="button" className="btn btn-outline-primary" onClick={(e) => addHandler(e)} disabled={isSending}><i className="fa fa-plus" aria-hidden="true" ></i></button>
                                <button className="btn btn-outline-danger" disabled={isSending||isDisable} onClick={(e) => deleteHandler(e)}><i className="fa fa-times" aria-hidden="true"></i></button>
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
                </li>
            </> :
            <>
                {acheivment.state == "active"?
                <li key={uuidv4()}>{acheivment.description}<i className="fa fa-hand-o-left" aria-hidden="true"></i></li>:
                <></>}
            </>


    )
}

export default Acheivement;