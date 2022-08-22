import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import "./article.css"

import * as yup from 'yup';
import axios from "axios";
import { useEffect, useRef } from "react";

const ArticleTitle = (props) => {
    const par1 = useRef()
    const par2 = useRef()
    const [paper, setPaper] = useState(props.paper)
    const [image, setImage] = useState(paper.image)
    const [isSending, setIsSending] = useState(false)
    const [selectedFile, setSelectedFile] = useState(paper.file);
    const Address = props.address
    const user = props.user
    const isDisable = props.isDisable
    const index = props.index
    const [checked, setChacked] = useState(true)
    const [errors, setErrors] = useState([]);
    const [height1, setHeight1] = useState("inherit")
    const [height2, setHeight2] = useState("inherit")
    
    
    

    useEffect(() => {
        if (par1.current && par1.current) {
            setHeight1(par1.current.scrollHeight)
            setHeight2(par2.current.scrollHeight)
        }
    }
        , []
    )
    const handleChange = (e) => {
        const input = e.currentTarget;
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`
        let newPaper = { ...paper }
        newPaper[input.name] = input.value
        newPaper.changed = true
        props.onchange(e, newPaper, index)
    }
    const uploadFile = (e) => {
        setSelectedFile(e.target.files[0])
        const newPaper = { ...paper };
        newPaper.changed = true;
        newPaper.image = URL.createObjectURL(e.target.files[0]);
        newPaper.file = e.target.files[0];
        props.onchange(e, newPaper, index)
    }
    const onClickHandler = (e) => {
        const newPaper = { ...paper }
        if (newPaper.state === "active") {
            newPaper.state = "inactive"
        }
        else {
            newPaper.state = "active"
        }
        newPaper.changed = true;
        props.onchange(e, newPaper, index)
        setChacked(!checked)
    }
    let schema = yup.object().shape({
        title: yup.string().required('فیلد عنوان مقاله رو نباید خالی بذاری.'),
        writer: yup.string().required('اسم نویسنده مقاله رو بنویس'),
        abstract: yup.string().required('مختصری راجب مقالت باید بنویسی.'),
    })
    const validate = async () => {
        try {
            const result = await schema.validate(paper, { abortEarly: false });
            return result
        }
        catch (error) {
            setErrors(error.errors)
        }

    }


    const submitHandler = async (e) => {
        let paperId = 0;
        setErrors([])
        e.preventDefault();
        setIsSending(true);
        if (paper.changed === true) {
            const result = await validate();
            const formData = new FormData;
            if (result) {
                formData.append("title", result.title);
                formData.append("writer", result.writer);
                formData.append("abstractParagraph", result.abstract);
                formData.append("paragraph", result.paragraphs);
                formData.append("userId",user.userInf.id);
                formData.append("state", result.state);
                formData.append("file", (selectedFile === undefined) ? new File([""], "filename") : selectedFile);
                if (result.id !== 0) {
                    formData.append("id", result.id);
                    setIsSending(true)
                    try {
                        const response = await axios({
                            method: "post",
                            url: `${Address}/action/blogger/updatePost.do`,
                            data: formData,
                            headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}` },
                        })
                        const newPaper = { ...result };
                        newPaper.changed = false;
                        props.onchange(e, newPaper, index)
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
                            method: "post",
                            url: `${Address}/action/blogger/savePost.do`,
                            data: formData,
                            headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}` },
                        })
                        const newPaper = { ...result };
                        newPaper.changed = false;
                        newPaper.id = response.data.id;
                        paperId = response.data.id
                        props.onchange(e, newPaper, index)
                        console.log(newPaper)
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
    const onLike = async (e, paperId, actionName) => {
        e.preventDefault();
        if(user.userInf.user){
        setIsSending(true)
        try {
            const response = await axios({
                method: "get",
                url: `${Address}/action/uer/userLikesPost.do?userId=${user.userInf.id}&postId=${paper.id}&actionName=${actionName}`,
                headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}` },
            })
            const response1 = await axios({
                method: 'get',
                url: `${Address}/action/guest/findLikesByPost.do?postId=${paper.id}&actionName=like`,
                withCredentials: false,
            })
            props.onchange(e, paper, index)
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

    return (
        user.userInf.blogger ?
            <div className="row p-4 p-md-5 mb-4 text-white rounded mainTitle" id="articleTitle">
                <div className="row">
                    <div className="col-md-6 px-0">
                        <h1 className="display-4 fst-italic">
                            <textarea name="title" ref={par1} style={{ height: height1 }} defaultValue={paper.title} onBlur={handleChange} placeholder="عنوان" />
                        </h1>
                        <p className="lead my-3"><textarea ref={par2} style={{ height: height2 }} name="abstract" defaultValue={paper.abstract} onBlur={handleChange} placeholder="چکیده" /></p>
                    </div>
                    <div className="col-md-6 px-0 imageSection">
                        <div className="row title-image">
                            <img key={uuidv4()} src={paper.image} />
                        </div>
                        <div className="input-image">
                            <input key={uuidv4()} type="file" name="file" id={props.itemKey} className="inputfile" encType="multipart/form-data" onChange={(e) => uploadFile(e)} />
                            <label key={uuidv4()} htmlFor={props.itemKey}><i className="fa fa-cloud-upload" aria-hidden="true" ></i></label>
                        </div>
                    </div>

                </div>
                <div className="row paperInf ">
                    <div className="col-md-2">
                        <i className="fa fa-calendar-o" aria-hidden="true"></i>
                        {<p > {new Date((paper.date)).toLocaleDateString('fa-IR')}</p>}
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                        <p ><input name="writer" type="text" className="writer-input" defaultValue={paper.writer} onBlur={handleChange} placeholder="نام نویسنده" /></p>
                    </div>
                </div>

                <label className="switch">
                    <input type="checkbox" checked={paper.state === "active" ? true : false} onChange={onClickHandler} />
                    <span className="slider round"></span>
                </label>
                <div className="row form-button">
                    <div>
                        <button className={paper.changed ? 'btn btn-outline-danger' : 'btn btn-outline-success'} disabled={isSending} onClick={submitHandler} ><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
                    </div>
                </div>
                <div className="row ">
                    <div className="article-update-des">
                        <p >{paper.user.name + ` ` + paper.user.family}   </p>
                        <p >({new Date((paper.date)).toLocaleDateString('fa-IR')})</p>
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
            :
            <>
                <div className="row p-4 p-md-5 mb-4 text-white rounded mainTitle">
                    <div className="row">
                        <div className="col-md-6 px-0">
                            <h1 className="display-4 fst-italic">{paper.title}</h1>
                            <p className="lead my-3">{paper.abstract}</p>
                        </div>
                        <div className="col-md-6 px-0 imageSection">
                            <img key={uuidv4()} src={paper.image} />
                        </div>
                    </div>
                    <div className="row paperInf ">
                        <div className="col-md-2">
                            <i className="fa fa-calendar-o" aria-hidden="true"></i>
                            {<p > {new Date((paper.date)).toLocaleDateString('fa-IR')}</p>}
                            <i className="fa fa-pencil" aria-hidden="true"></i>
                            {<p > {paper.writer}</p>}
                        </div>
                    </div>
                    <div key={uuidv4()} className='like'>
                        <div key={uuidv4()} className="row" style={{ justifyContent: "left" }}>
                            <div key={uuidv4()} className="col-md-2 col-6" style={{ textAlign: "left" }}>
                                <button key={uuidv4()} type="button" className="btn btn-Light position-relative" disabled={isSending} onClick={(e) => onLike(e, paper.id, "like")}>
                                    <i key={uuidv4()} className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                                        {props.like}
                                        <span className="visually-hidden">unread messages</span>
                                    </span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

            </>
    )


}

export default ArticleTitle;