
import { useState,useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import axios from "axios";
import { number } from "yup";

const Doctrors = (props) => {

    const Address = props.address
    const [doctor, setDoctor] = useState(props.doctor)
    const [errors, setErrors] = useState([])
    const [isSending, setIsSending] = useState(false)
    const [checked, setChacked] = useState(true)
    const [selectedFile, setSelectedFile] = useState(doctor.file);
    const user = props.user;
    const [image, setImage] = useState(doctor.image)
    const createDoctor = props.createDoctor
    const isDisable=props.isDisable
    const index=props.index;
    const[like,setLike]=useState();
    const[disLike,setDislike]=useState();

    useEffect(async()=>{
        const response1=await axios({
            method: 'get',
            url: `${Address}/action/guest/findLikesByDoctors.do?doctorId=${doctor.id}&actionName=like`,
            withCredentials: false,
          })
          setLike(response1.data)  
    },[])

    useEffect(async()=>{
        const response1=await axios({
            method: 'get',
            url: `${Address}/action/guest/findLikesByDoctors.do?doctorId=${doctor.id}&actionName=disLike`,
            withCredentials: false,
          })
          const count=response1.data
          setDislike(response1.data)  
    },[])
    


    const handleChange = (e) => {
        const input = e.currentTarget;
        let doc = { ...doctor }
        doc[input.name] = input.value;
        if (doc[input.name] !== doctor[input.name]) {
            doc.changed=true;
            props.onchange(e,doc,index)
        }
         
    }


    const onClickHandler = (e) => {
        const newDoctor = { ...doctor }
        if (newDoctor.state === "active") {
            newDoctor.state = "inactive"
        }
        else {
            newDoctor.state = "active"
        }
        newDoctor.changed=true;
        props.onchange(e,newDoctor,index)
        setChacked(!checked)
    }
    let schema = yup.object().shape({
        name: yup.string().required('فیلد نام دکتر رو نباید خالی بذاری.'),
        family: yup.string().required('فیلد نام خانوادگی دکتر رو نباید خالی بذاری.'),
        medicalId: yup.number().required('فیلد شماره پروانه پزشکی دکتر رو نباید خالی بذاری.'),
        about: yup.string().required('در مورد دکتر یکم بنویس باهم اشنا شیم.'),
    })
    const validate = async () => {
        try {
            const result = await schema.validate(doctor, { abortEarly: false });
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
            formData.append("name", result.name);
            formData.append("family", result.family);
            formData.append("medicalId", result.medicalId);
            formData.append("about", result.about);
            formData.append("state", result.state);
            formData.append("file", (selectedFile===undefined)?new File([""], "filename"):selectedFile);
            formData.append("userId", user.userInf.id)
            if (result.id !== 0) {
                formData.append("id", result.id);
                try {
                    const response = await axios({
                        method: "post",
                        url: `${Address}/action/doctor/updateDoctor.do`,
                        data: formData,
                        headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}`},
                    })
                    const newDoctor={...result};
                    newDoctor.changed=false;
                    props.onchange(e,newDoctor,index)
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
                        url: `${Address}/action/doctor/saveDoctor.do`,
                        data: formData,
                        headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}` },
                    })
                    const newDoctor={...result};
                    newDoctor.changed=false;
                    newDoctor.id=response.data.id;
                    props.onchange(e,newDoctor,index)
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
    const uploadFile = (e) => {
        setSelectedFile(e.target.files[0])
        setImage(URL.createObjectURL(e.target.files[0]))
        const newDoctor={...doctor};
        newDoctor.changed=true;
        newDoctor.image=URL.createObjectURL(e.target.files[0]);
        newDoctor.file=e.target.files[0];
        props.onchange(e,newDoctor,index)
    }
    const addDoctor = (e) => {
        e.preventDefault()
        createDoctor(e)
    }
    const deleteHandler = async (e) => {
        setIsSending(false)
        e.preventDefault();
        try {
             const response = await axios({
                 method: "get",
                 url: `${Address}/action/admin/deleteDoctor.do?doctorId=${doctor.id}`,
                 headers: { "enctype": "multipart/form-data", 'Access-Token':`${user.token}` },
             })
            props.deleteDoctor(e, doctor.id)
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

    const onLike=async(e,doctorId,actionName)=>{
        e.preventDefault();
        setIsSending(true)
        if(user.userInf.user){
        try {
            const response = await axios({
                method: "get",
                url: `${Address}/action/user/userLikes.do?userId=${user.userInf.id}&doctorId=${doctorId}&actionName=${actionName}`,
                headers: { "enctype": "multipart/form-data",'Access-Token':`${user.token}`},
            })
            const response1=await axios({
                method: 'get',
                url: `${Address}/action/guest/findLikesByDoctors.do?doctorId=${doctor.id}&actionName=like`,
                withCredentials: false,
              })
             
              setLike(response1.data)
              
              const response2=await axios({
                method: 'get',
                url: `${Address}/action/guest/findLikesByDoctors.do?doctorId=${doctor.id}&actionName=disLike`,
                withCredentials: false,
              })
              setDislike(response2.data)
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
        user.userInf.doctor ?
            <>
                <div key={uuidv4()} className='doctor-form'>
                    <form>
                        <div key={uuidv4()} className='row'>
                            <div key={uuidv4()} className='col-md-4 text-center'>
                                <img key={uuidv4()} src={image} alt="محل بارگذاری عکس دکتر" />
                                <div>
                                    <input key={uuidv4()} type="file" name="file" id={props.itemKey} className="inputfile" encType="multipart/form-data" onChange={(e) => uploadFile(e)} />
                                    <label key={uuidv4()} htmlFor={props.itemKey}><i className="fa fa-cloud-upload" aria-hidden="true" ></i></label>
                                </div>
                            </div>
                            <div key={uuidv4()} className='col-md-8'>
                                <h3 key={uuidv4()}>
                                    <input className="doctor-form-name" type="text" name="name" defaultValue={doctor.name} placeholder="نام" onBlur={(e) => handleChange(e)} />
                                    <input className="doctor-form-family" type="text" name="family" defaultValue={doctor.family} placeholder="نام خانوادگی" onBlur={(e) => handleChange(e)} />
                                </h3>
                                <p key={uuidv4()}>شماره پروانه پزشکی:</p>
                                <input type="text" name="medicalId" defaultValue={doctor.medicalId} placeholder="000000" onBlur={(e) => handleChange(e)} />
                                <textarea name="about" defaultValue={doctor.about} placeholder="درباره ......" onBlur={(e) => { handleChange(e) }} />
                                <label className="switch">
                                    <input type="checkbox" checked={doctor.state === "active" ? true : false} onChange={onClickHandler} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>
                        <div className="row form-button">
                            <div>
                                <button className={doctor.changed ? 'btn btn-outline-danger' : 'btn btn-outline-success'} disabled={isSending} onClickCapture={submitHandler}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
                                <button type="button" className="btn btn-outline-primary" onClick={addDoctor} disabled={isSending}><i className="fa fa-plus" aria-hidden="true" ></i></button>
                                <button className="btn btn-outline-danger" disabled={isSending||isDisable} onClick={deleteHandler}><i className="fa fa-times" aria-hidden="true"></i></button>
                            </div>
                        </div>
                        <div className="row ">
                            <div className="doctor-update-des">
                                <p >{doctor.user.family + ` ` + doctor.user.name}   </p>
                                <p >({new Date((doctor.date)).toLocaleDateString('fa-IR')})</p>
                            </div>
                        </div>

                    </form>
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
            </> :

            (doctor.state == "active") ?
                
                    <div key={uuidv4()} className='row'>
                        <div key={uuidv4()} className='col-md-4 text-center'>
                            <a href={doctor.image} ><img key={uuidv4()} src={doctor.image} /></a>
                        </div>
                        <div key={uuidv4()} className='col-md-8'>
                            <h3 key={uuidv4()}>{doctor.name} {doctor.family}</h3>
                            <p key={uuidv4()}>شماره پروانه پزشکی:{doctor.medicalId}</p>
                            <p key={uuidv4()}>{doctor.about}</p>
                            <div key={uuidv4()} className='like'>
                                <div key={uuidv4()} className="row">
                                    <div key={uuidv4()} className="col-md-2 col-6">
                                        <button key={uuidv4()} type="button" className="btn btn-Light position-relative" disabled={isSending} onClick={(e)=> onLike(e,doctor.id,"like")}>
                                            <i key={uuidv4()} className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                                                {like}
                                                <span className="visually-hidden">unread messages</span>
                                            </span>
                                        </button>
                                    </div>
                                    <div key={uuidv4()} className="col-md-2 col-6">
                                        <button type="button" className="btn btn-Light position-relative" onClick={(e)=> onLike(e,doctor.id,"disLike")}>
                                            <i key={uuidv4()} className="fa fa-thumbs-o-down" aria-hidden="true"></i>
                                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                {disLike}
                                                <span className="visually-hidden">unread messages</span>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 :
                <></>
    );
}

export default Doctrors;