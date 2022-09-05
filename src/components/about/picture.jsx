import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import axios from "axios";

const Picture = (props) => {
    const Address = props.address
    const user = props.user;
    const [picture, setPicture] = useState(props.picture)
    const [selectedFile, setSelectedFile] = useState(picture.files);
    const createPhoto=props.createPhoto;
    const deletePhoto=props.deletePhoto;
    const [isSending, setIsSending] = useState(false)
    const [errors, setErrors] = useState([])
    const isDisable=props.isDisable
    const index=props.index;
    
    const submitHandler = async (e) => {
        setIsSending(true)
        setErrors([])
        e.preventDefault();
        const formData = new FormData;
            formData.append("file", (selectedFile===undefined)?new File([""], "filename"):selectedFile);
            formData.append("userId", user.userInf.id)
                try {
                    const newPicture=picture;
                    if(picture.id===0){
                    const response = await axios({
                        method: "post",
                        url: `${Address}/action/picture/savePicture.do`,
                        data: formData,
                        headers: { "enctype": "multipart/form-data" ,'Access-Token':`${user.token}`},
                    })
                    newPicture.id=response.data.id;
                    
                }
                newPicture.changed=false;
                props.onchange(e,newPicture,index)
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
    const uploadFile = (e) => {
        const newPicture={...picture}
        newPicture.link=URL.createObjectURL(e.target.files[0])
        setPicture(newPicture)
        newPicture.changed=true;
        newPicture.files=e.target.files[0];
        props.onchange(e,newPicture,index)
    }
    const addHandler = (e) => {
        e.preventDefault()
        createPhoto(e)
    }
    const deleteHandler = async (e) => {
        setIsSending(false)
        e.preventDefault();
        try {
             const response = await axios({
                 method: "get",
                 url: `${Address}/action/admin/deletePicture.do?pictureId=${picture.id}`,
                 headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}` },
            })
            deletePhoto(e, picture.id)
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
        (user.userInf.picture||user.userInf.viewer) ?
        <li className="col-md-2 col-sm-3" > 
            <div className="picture-form" >
                <div className="row pic">
                <img key={uuidv4()} src={picture.link} alt="محل بارگذاری تصاویر" />
                </div>
                <div className="row up">
                    <input  key={uuidv4()} type="file" name="file" id={props.itemKey} className="inputfile lab" encType="multipart/form-data" onChange={(e) => uploadFile(e)} />
                    <label key={uuidv4()} htmlFor={props.itemKey}><i className="fa fa-cloud-upload lab" aria-hidden="true" ></i></label>
                </div>
                <div className="row" className="row form-button">
                            <div className="but">
                                <button className={!picture.changed ? ' btn btn-outline-success' : 'btn btn-outline-danger'} disabled={isSending} onClickCapture={submitHandler}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
                                <button type="button" className="btn btn-outline-primary" onClick={addHandler} disabled={isSending}><i className="fa fa-plus" aria-hidden="true" ></i></button>
                                <button className="btn btn-outline-danger" disabled={isSending||isDisable} onClick={deleteHandler}><i className="fa fa-times" aria-hidden="true"></i></button>
                            </div>
                </div>
                <div className="row ">
                            <div className="doctor-update-des">
                                <p >{picture.user.family + ` ` + picture.user.name}   </p>
                                <p >({new Date((picture.date)).toLocaleDateString('fa-IR')})</p>
                            </div>
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
            <></>
    );
}

export default Picture;