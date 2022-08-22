import "./article.css"
import { v4 as uuidv4 } from 'uuid'
import { useState } from "react";
import * as yup from 'yup';
import axios from "axios";
import { reference } from "@popperjs/core";
const Refrences = (props) => {
    const user = props.user;
    const Address = props.address;
    const index = props.index;
    const [isDisable, setIsDisable] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [errors, setErrors] = useState([]);
    const paper = props.paper;
    const refrence = props.refrence;
    const createRefrence = props.createRefrence;
    const deleteRefrence = props.deleteRefrence;

    const handleChange = (e) => {
        const input = e.currentTarget;
        let newRefrence = { ...refrence }
        newRefrence[input.name] = input.value;
        if (newRefrence[input.name] !== refrence[input.name]) {
            newRefrence.isChange = true
            props.onchange(e, newRefrence, index)
        }

    }

    const addHandler = (e) => {
        e.preventDefault()
        createRefrence(e)
    }
    const deleteHandler = async (e) => {
        
        e.preventDefault();
        try {
            setIsSending(true)
            const response = await axios({
                method: "get",
                url: `${Address}/action/blogger/deleteReference.do?referenceId=${refrence.id}`,
                headers: {'Access-Token':`${user.token}` },
            })
            setIsSending(false)
            deleteRefrence(e, refrence.id)
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
    let schema = yup.object().shape({
        value: yup.string().required('فیلد آدرس منبع رو نباید خالی بذاری.'),
    })
    const validate = async () => {
        try {
            const result = await schema.validate(refrence, { abortEarly: false });
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
        if (result && result.isChange) {
            setIsSending(true)
            if (result.id !== 0) {
                try {
                    const response = await axios({
                        method: "get",
                        url: `${Address}/action/blogger/updateReference.do?id=${result.id}&value=${result.value}`,
                        headers: { 'Access-Token': `${user.token}` },
                    })
                    const newRefrence = result
                    newRefrence.isChange = false
                    props.onchange(e, newRefrence, index)
                    setIsSending(false)
                }
                catch (e) {
                    if (e.response) {
                        if (e.response.status === 700) {
                            setErrors(["دسترسی مورد نیاز فراهم نشده است."])
                        }
                    }
                    else {
                        setErrors(["مشکل در سرور پیش اومده"])
                    }
                    setIsSending(false)
                }
            }
            else {
                try {
                    const response = await axios({
                        method: "get",
                        url: `${Address}/action/blogger/saveReference.do?value=${result.value}&postId=${paper.id}`,
                        headers: { 'Access-Token': `${user.token}` },
                    })
                    const newRefrence = result
                    newRefrence.id = response.data.id
                    newRefrence.isChange = false
                    props.onchange(e, newRefrence, index)
                    setIsSending(false)
                }
                catch (e) {
                    if (e.response) {
                        if (e.response.status === 700) {
                            setErrors(["دسترسی مورد نیاز فراهم نشده است."])
                        }
                    }
                    else {
                        setErrors(["مشکل در سرور پیش اومده"])
                    }
                    setIsSending(false)
                }
            }

        }
    }

    return (
        user.userInf.blogger ?
            <li>
                <div className="row" style={{marginTop:10}}>
                    <div className="col-11">
                        <p style={{float:"right",marginLeft:10,marginRight:10}}>{index+1}</p>
                        <input style={{width:'80%'}} type="text" name="value" defaultValue={refrence.value} onBlur={handleChange} placeholder="آدرس منبع" />
                    </div>
                </div>
                <div className="row" className="row form-button">
                    <div className="but">
                        <button className={!refrence.isChange ? ' btn btn-outline-success' : 'btn btn-outline-danger'} disabled={isSending} onClickCapture={submitHandler}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
                        <button type="button" className="btn btn-outline-primary" onClick={addHandler} disabled={isSending}><i className="fa fa-plus" aria-hidden="true" ></i></button>
                        <button className="btn btn-outline-danger" disabled={isSending || isDisable} onClick={deleteHandler}><i className="fa fa-times" aria-hidden="true"></i></button>
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

            </li>
            :
            <li>
                <div className="row">
                    <div className="col-11">
                       <p style={{float:"right",marginLeft:10,marginRight:10,marginBottom:0}}>{index+1}</p><a href={refrence.value}>{refrence.value}</a>
                    </div>
                </div>
            </li>


    );
}

export default Refrences;