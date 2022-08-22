import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import axios from "axios";

const Fasility = (props) => {
    const Address = props.address
    const user = props.user
    const [fasility, setFasility] = useState(props.fasility)
    const [selectedFile, setSelectedFile] = useState(fasility.files);
    const [image, setImage] = useState(fasility.image)
    const [checked, setChacked] = useState(true)
    const [errors, setErrors] = useState([])
    const [isSending, setIsSending] = useState(false)
    const createFasility = props.createFasility;
    const deleteFasility = props.deleteFasility;
    const isDisable = props.isDisable
    const index = props.index;
    
    const handleChange = (e) => {
        const input = e.currentTarget;
        let newFasility = { ...fasility };
        newFasility[input.name] = input.value;
        setFasility({ ...newFasility })
        if (newFasility[input.name]!== fasility[input.name]) {
            newFasility.isChange = true
            props.onchange(e, newFasility, index)
        }

    }
    const uploadFile = (e) => {
        setSelectedFile(e.target.files[0])
        setImage(URL.createObjectURL(e.target.files[0]))
        const newFasility = { ...fasility };
        newFasility.image = URL.createObjectURL(e.target.files[0]);
        newFasility.isChange = true
        newFasility.files=e.target.files[0]
        props.onchange(e, newFasility, index)
    }
    const onClickHandler = (e) => {
        const newFasility = { ...fasility }
        if (newFasility.state === "active") {
            newFasility.state = "inactive"
        }
        else {
            newFasility.state = "active"
        }
        setChacked(!checked)
        newFasility.isChange = true
        props.onchange(e, newFasility, index)
    }
    let schema = yup.object().shape({
        name: yup.string().required('اسم دستگاه باید بنویسی.'),
        utility: yup.string().required('کاربرد اصلی دستگاه بنویس.'),
        description: yup.string().required('مختصری راجب سایر قایلیت های دستگاه بنویس.')
    })
    const validate = async () => {
        try {
            const result = await schema.validate(fasility, { abortEarly: false });
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
            formData.append("name", result.name);
            formData.append("utility", result.utility);
            formData.append("description", result.description);
            formData.append("state", result.state);
            formData.append("file", (selectedFile===undefined)?new File([""], "filename"):selectedFile);
            formData.append("userId", user.userInf.id);
            if (result.id !== 0) {
                formData.append("id", result.id);
                try {
                    console.log(selectedFile)
                     const response = await axios({
                         method: "post",
                         url: `${Address}/action/facility/updateFacility.do`,
                         data: formData,
                         headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}` },
                     })
                    const newFasility = { ...result }
                    newFasility.isChange = false
                    props.onchange(e, newFasility, index)
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
                          url: `${Address}/action/facility/saveFacility.do`,
                          data: formData,
                          headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}`},
                      })
                     const newFasility = { ...result }
                     newFasility.id = response.data.id;
                     newFasility.isChange = false
                     props.onchange(e, newFasility, index)
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
    const addHandeler = (e) => {

        e.preventDefault()
        createFasility(e)
    }
    const deleteHandler = async (e) => {
        setIsSending(true)
        e.preventDefault();
        deleteFasility(e, fasility.id)
        try {
            const response = await axios({
                method: "get",
                url: `${Address}/action/admin/deleteFacility.do?facilityId=${fasility.id}`,
                headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}` },
            })
            deleteFasility(e, fasility.id)
        }
        catch (e) {
            setErrors(["مشکل در سرور پیش اومده"])
        }
        setIsSending(false)
    }


    return (
        <>
            <form className="form-fasility col-md-5">
                <div className="row">
                    <div key={uuidv4()} className='col-md-3 text-center fasility-image'>
                        <img key={uuidv4()} src={image} alt="محل بارگذاری عکس تجهیز" />
                        <div className="co">
                            <input key={uuidv4()} type="file" name="file" id={props.itemKey} className="inputfile" encType="multipart/form-data" onChange={(e) => uploadFile(e)} />
                            <label key={uuidv4()} htmlFor={props.itemKey}><i className="fa fa-cloud-upload" aria-hidden="true" ></i></label>
                        </div>
                    </div>

                    <div className="col-9 row">
                        <div className="col-3 m-2">
                            <input type='text' className="form-control" name='name' defaultValue={fasility.name} placeholder="نام تجهیز" onBlur={handleChange}/>
                        </div>
                        <div className="col-8 m-2">
                            <input type='text' className="form-control" name='utility' defaultValue={fasility.utility} placeholder="کاربرد" onBlur={handleChange} />
                        </div>
                        <div className="row fasility-description">
                             <textarea name='description' className="form-control" defaultValue={fasility.description} placeholder="شرح تجهیز" onBlur={handleChange}/>
                        </div>
                        <div>
                        <label className="switch row">
                            <input type="checkbox" checked={fasility.state === "active" ? true : false} onChange={onClickHandler} />
                            <span className="slider round"></span>
                        </label>
                        </div>
                    </div>
                    <div className="form-button">
                            <div>
                                <button className={fasility.isChange ? 'btn btn-outline-danger' : ' btn btn-outline-success'} disabled={isSending} onClickCapture={submitHandler}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
                                <button type="button" className="btn btn-outline-primary" onClick={(e) => addHandeler(e)} disabled={isSending}><i className="fa fa-plus" aria-hidden="true" ></i></button>
                                <button className="btn btn-outline-danger" disabled={isSending || isDisable} onClick={(e) => deleteHandler(e)}><i className="fa fa-times" aria-hidden="true"></i></button>
                            </div>
                        </div>
                        <div className="fasility-update-des">
                            <p >{fasility.user.family + ` ` + fasility.user.name}   </p>
                            <p >({new Date((fasility.date)).toLocaleDateString('fa-IR')})</p>
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

            </form>
        </>
    );
}

export default Fasility;