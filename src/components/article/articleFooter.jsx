import "./article.css"
import { v4 as uuidv4 } from 'uuid'
import { useState } from "react";
import * as yup from 'yup';
import axios from "axios";
const ArticleFooter = (props) => {
    const user = props.user;
    const Address = props.address
    const index = props.index
    const [isDisable, setIsDisable] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [errors, setErrors] = useState([])
    const paper = props.paper
    const keyword=props.keyword;
    const createKeyword =props.createKeyword
    const deleteKeyword=props.deleteKeyword
   

    const handleChange = (e) => {
        const input = e.currentTarget;
        
         let newKeyword = { ...keyword }
         newKeyword[input.name] = input.value;
         if (newKeyword[input.name] !== keyword[input.name]) {
             newKeyword.isChange=true
             props.onchange(e,newKeyword,index)
         }
    }

    const addHandler = (e) => {
        e.preventDefault()
        createKeyword(e)
    }
    const deleteHandler = async (e) => {
        e.preventDefault();
         try{ 
            setIsSending(true) 
             const response=await axios({
                method: "get",
                url: `${Address}/action/blogger/deleteKeyword.do?keywordId=${keyword.id}`,
                headers: { 'Access-Token': `${user.token}` },
              })
             deleteKeyword(e,keyword.id) 
             setIsSending(false) 
         }  
         catch(e){
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
    let schema = yup.object().shape({
        value: yup.string().required('فیلد کلمه کلیدی رو نباید خالی بذاری.'),
    })
    const validate = async () => {
        try {
            const result = await schema.validate(keyword, { abortEarly: false });
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
        if (result&&result.isChange) { 
            setIsSending(true)
            if (result.id !== 0) {   
                try {
                    const response = await axios({
                        method: "get",
                        url: `${Address}/action/blogger/updateKeyword.do?id=${result.id}&value=${result.value}`,
                        headers: {'Access-Token':`${user.token}` },
                    })
                    const newKeyword=result
                    newKeyword.isChange=false
                    props.onchange(e,newKeyword,index)
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
                        url: `${Address}/action/blogger/saveKeyword.do?value=${result.value}&postId=${paper.id}`,
                        headers: {'Access-Token':`${user.token}` },
                    })
                    const newKeyword=result
                    newKeyword.id=response.data.id
                    newKeyword.isChange=false
                    props.onchange(e,newKeyword,index)
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
    return (
        
        user.userInf.blogger?
                <li key={uuidv4()}>
                    <input type="text" name="value" className="btn btn-outline-secondary" defaultValue={keyword.value} onBlur={handleChange}/><i className="fa fa-tag" aria-hidden="true"></i>
                    <div className="row" className="row form-button">
                            <div className="but">
                                <button className={!keyword.isChange ? ' btn btn-outline-success' : 'btn btn-outline-danger'} disabled={isSending} onClickCapture={submitHandler}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
                                <button type="button" className="btn btn-outline-primary" onClick={addHandler} disabled={isSending}><i className="fa fa-plus" aria-hidden="true" ></i></button>
                                <button className="btn btn-outline-danger" disabled={isSending||isDisable} onClick={deleteHandler}><i className="fa fa-times" aria-hidden="true"></i></button>
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
                </li>:
                <li key={uuidv4()}>
                <a type="button" className="btn btn-outline-secondary" href={`https://www.google.com/search?q=${keyword.value}`}><i className="fa fa-tag" aria-hidden="true"></i>{keyword.value}</a>
                </li>
        
    )
}

export default ArticleFooter;