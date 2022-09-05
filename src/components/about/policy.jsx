import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import * as yup from 'yup';
import axios from "axios";

const Policy = (props) => {
    const [policy, setPolicy] = useState(props.policy)
    const Address = props.address
    const [errors, setErrors] = useState([])
    const [isSending, setIsSending] = useState(false)
    const [checked, setChacked] = useState(true)
    const user = props.user;
    const createPolicy = props.createPolicy;
    const deletePolicy = props.deletePolicy;
    const isDisable = props.isDisable;
    const index=props.index;
    

    const handleChange = (e) => {
        const input = e.currentTarget;
         let pol = { ...policy }
         pol[input.name] = input.value;
         if (pol[input.name] !== policy[input.name]) {
             pol.isChange=true
             props.onchange(e,pol,index)
         }
    }


    const onClickHandler = (e) => {
        const newPolicy = { ...policy }
        if (newPolicy.state === "active") {
            newPolicy.state = "inactive"
        }
        else {
            newPolicy.state = "active"
        }
        setChacked(!checked)
        newPolicy.isChange=true
        props.onchange(e,newPolicy,index)
    }
    let schema = yup.object().shape({
        description: yup.string().required('فیلد شرح خطی مشی رو نباید خالی بذاری.'),
    })
    const validate = async () => {
        try {
            const result = await schema.validate(policy, { abortEarly: false });
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
        if (result&&result.isChange) {
            setIsSending(true)
            formData.append("description", result.description);
            formData.append("userId", user.userInf.id)
            if (result.id !== 0) {
                formData.append("id", result.id);
                try {
                    const response = await axios({
                        method: "get",
                        url: `${Address}/action/policy/updatePolicy.do?id=${policy.id}&description=${policy.description}&state=${policy.state}&userId=${user.userInf.id}`,
                        headers: { 'Access-Token':`${user.token}`},
                    })
                    const newPolicy=result
                    newPolicy.isChange=false
                    props.onchange(e,newPolicy,index)
                }
                catch (e) {
                    if(e.response){
                        if(e.response.status===700){
                            setErrors(["دسترسی مورد نیاز فراهم نشده است."]) 
                        }}
                        else{
                            setErrors(["مشکل در سرور پیش اومده"])  
                        }
                       
                }
                setIsSending(false) 
            }
            else {
                try {
                    const response = await axios({
                        method: "get",
                        url: `${Address}/action/policy/savePolicy.do?description=${policy.description}&userId=${user.userInf.id}`,
                        headers: {'Access-Token':`${user.token}`},
                    })
                    const newPolicy=result
                    newPolicy.id=response.data.id
                    newPolicy.isChange=false
                    props.onchange(e,newPolicy,index)
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
        createPolicy(e)
    }
    const deleteHandler = async (e) => {
        e.preventDefault();
        setIsSending(true)

        try {
            const response = await axios({
                method: "get",
                url: `${Address}/action/admin/deletePolicy.do?policyId=${policy.id}`,
                headers: {'Access-Token':`${user.token}`},
            })
            deletePolicy(e, policy.id)

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
    return (
        (user.userInf.policy||user.userInf.viewer)?
            <>
                <li key={uuidv4()}>
                    <form className="policy-form">
                        <input type="text" name='description' defaultValue={policy.description} onBlur={handleChange} placeholder='شرح خطی مشی...' /><i className="fa fa-hand-o-left" aria-hidden="true"></i>
                        <label className="switch">
                            <input type="checkbox" checked={policy.state === "active" ? true : false} onChange={onClickHandler} />
                            <span className="slider round"></span>
                        </label>
                        <div className="row form-button">
                            <div>
                                <button className={policy.isChange ? 'btn btn-outline-danger' : ' btn btn-outline-success'} disabled={isSending} onClickCapture={submitHandler}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
                                <button type="button" className="btn btn-outline-primary" onClick={(e) => addHandler(e)} disabled={isSending}><i className="fa fa-plus" aria-hidden="true" ></i></button>
                                <button className="btn btn-outline-danger" disabled={isSending || isDisable} onClick={(e) => deleteHandler(e)}><i className="fa fa-times" aria-hidden="true"></i></button>
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
                {policy.state == "active"?
                <li key={uuidv4()}>{policy.description}<i className="fa fa-hand-o-left" aria-hidden="true"></i></li>:
                <></>}
            </>


    )


}

export default Policy;