import { useState } from "react";
import './userProfile.css';
import * as yup from 'yup';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from "react";
import UserInformation from "../../components/userInformations/userInformation";
import emailjs from 'emailjs-com';
import { useRef } from "react";
import { NavLink } from "react-router-dom";
import headingPic from '../../assets/img/heading-cream.svg'
import DiscountManagement from "../../components/discountManagement/discountManagement";


const UserProfile = (props) => {
    const [user, setUser] = useState(props.user);
    const [isChanged, setIsChanged] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [errors, setErrors] = useState([]);
    const Address = props.address;
    const [isSuccessful,setIsSuccessful]=useState(false);
    const [userInfo, setUserInfo] = useState({ name: user.userInf.name, family: user.userInf.family, phoneNumber: user.userInf.phoneNumber })
    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    },[])

    const handleChange = (e) => {
        const input = e.currentTarget;
        let newuser = { ...userInfo }
        newuser[input.name] = input.value;
        setUserInfo(newuser)
        setIsChanged(true)
    }
    
    let schema = yup.object().shape({
        name: yup.string().required('فیلد نام رو نباید خالی بذاری.'),
        family: yup.string().required('فیلد نام خانوادگی  رو نباید خالی بذاری.'),
        phoneNumber: yup.number().required('فیلد شماره تلفن رو نباید خالی بذاری.'),

    })
    const validate = async () => {
        try {
            const result = await schema.validate(userInfo, { abortEarly: false });
            return result
        }
        catch (error) {
            setErrors(error.errors)
            setIsSending(false)
        }

    }

    const submitHandler = async (e) => {
       e.preventDefault();
       setIsSending(true)
        setErrors([])
        const result = await validate();

        const formData = new FormData;
        if (result) {
            formData.append("id", user.userInf.id)
            formData.append("name", userInfo.name);
            formData.append("family", userInfo.family);
            formData.append("phoneNumber", userInfo.phoneNumber);
            try {
                const response = await axios({
                    method: "post",
                    url: `${Address}/action/user/userEdit.do`,
                    data: formData,
                })
                const newDoctor = { ...result };
                setIsChanged(false);
                setIsSuccessful(true);
                setIsSending(false)
                
            }
            catch (e) {
                setErrors(["مشکل در سرور پیش اومده"])
            }
        }
    }
    //////////////////////////////////////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    const [userPassword, setUserPassword] = useState({ oldPassword: "", newPassword1: "", newPassword2: "" });
    const [isValid, setIsValid] = useState(false);
    const[isChangeSuccessful,setIsChangeSuccessful]=useState(false)
    const passwordValidation = () => {
        userPassword.newPassword1 === userPassword.newPassword2 ? setIsValid(true) : setErrors(["رمز عبورهای وارد شده همخوانی ندارند."]); setIsSending(false)
    }
    const handleChange2 = (e) => {
        const input = e.currentTarget;
        let newUserPassword = { ...userPassword }
        newUserPassword[input.name] = input.value;
        setUserPassword(newUserPassword)
    }

    let schema2 = yup.object().shape({
        oldPassword: yup.string().required('پسورد قبلی خود را وارد نکرده اید.'),
        newPassword1: yup.string().required('پسورد جدید را واد نکرده اید')
    })
    const validatePassword = async () => {
        try {
            const result = await schema2.validate(userPassword, { abortEarly: false });
            return result
        }
        catch (error) {
            setErrors(error.errors)
        }

    }

    const submitHandler2 = async (e) => {
         e.preventDefault();
         setIsSending(true)
         setErrors([])
         const result = await validatePassword();
         passwordValidation()
         const formData = new FormData;
         if (result && isValid) {
             formData.append("oldPassword", userPassword.oldPassword)
             formData.append("newPassword", userPassword.newPassword1);
             formData.append("id",user.userInf.id)
             
             try {
                 const response = await axios({
                     method: "post",
                     url: `${Address}/action/user/changePassword.do`,
                     data: formData,
                 })
                 setIsSending(false)
                 if(response.data.state=="ok"){
                    setIsChangeSuccessful(true);
                 }
                 else{
                    setErrors(["رمز قبلی خود را درست وارد ننموده اید.."])
                 }
                 
             }
             catch (e) {
                 setErrors(["مشکل در سرور پیش اومده"])
             }
         }
     }

    const sendEmail = (token) => {
        setIsSending(true)
        var template_params={
                          message:Address+`/action/userActivate.do?token=${token}`,
                          user_name:user.userInf.name,
                          user_email:user.userInf.email
                      }
            emailjs.send('service_5q2j7mb', 'template_hafp27y',template_params, 'd_qZS5h-vWXQ7xB8x')
                .then((result) => {
                   console.log(result.text);
                   setIsSending(false)
                }, (error) => {
                    console.log(error.text);
                });
                props.logout()
                window.location.href = "/"
       };


    return (
        <>
            <div className='main-title'>
                <h2>اطلاعات کاربری</h2>
                <img className='headerPic' src={headingPic} />
            </div>
            <form className="userInf">
                <div className="row">
                    <div className="col-4 ml-2" style={{ paddingRight: 10, marginBottom: 15 }}>
                        <label htmlFor="user-name" className="form-label" required>نام:</label>
                        <input type="text" name="name" className="form-control" id="user-name" placeholder="نام" value={userInfo.name} onChange={handleChange}></input>
                    </div>
                    <div className="col-4" style={{ paddingRight: 10, marginBottom: 15 }}>
                        <label htmlFor="user-family" className="form-label" required>نام خانوادگی:</label>
                        <input type="text" name="family" className="form-control" id="user-family" placeholder="نام" value={userInfo.family} onChange={handleChange}></input>
                    </div>
                    <div className="col-4" style={{ paddingRight: 10, marginBottom: 15 }}>
                        <label htmlFor="user-tel" className="form-label" required>شماره تماس:</label>
                        <input type="tel" name="phoneNumber" className="form-control" id="user-tel" placeholder="نام" value={userInfo.phoneNumber} onChange={handleChange}></input>
                    </div>
                    
                    <div className="row" style={{ justifyContent: "center", paddingBottom: 10 }} >
                        <button type="button" className="btn btn-outline-primary" disabled={isSending} style={{ width: 140, height: 40 }} aria-current="page" data-bs-toggle="modal" data-bs-target="#changePassword" to="#changePassword"><i className="fa fa-key" aria-hidden="true"></i><p>تغییر رمز عبور</p></button>
                        {!user.userInf.user&&(<button type="button" className="btn btn-outline-primary" disabled={isSending} style={{ width: 140, height: 40 ,marginRight:10}} onClick={e=>sendEmail(user.token)} ><i className="fa fa-cogs" aria-hidden="true"></i><p> فعال سازی </p></button> )}
                    </div>
                </div>
                <div className="row" style={{ textAlign: 'center' }}>
                    <div>
                        <button type="button" className={isChanged ? 'btn btn-outline-danger' : 'btn btn-outline-success'} disabled={isSending} onClick={e => submitHandler(e)} ><i className="fa fa-floppy-o" aria-hidden="true" ></i></button>
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
            {isSuccessful&&(
                            <div className="alert alert-success" style={{marginTop:10}} role="alert">
                            <p className='success'>اطلاعات کاربری با موفقیت ویرایش گردید.</p>
                            </div>)}
            <div className="modal fade" id="changePassword" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">تغییر رمز عبور</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="userInf">
                                <label htmlFor="user-old-password" className="form-label" required>رمزعبور قبلی</label>
                                <input type="password" name="oldPassword" className="form-control" id="user-old-password" placeholder="نام" value={userPassword.oldPassword} onChange={handleChange2}></input>
                                <label htmlFor="user-new-password1" className="form-label" required>رمزعبور جدید</label>
                                <input type="password" name="newPassword1" className="form-control" id="user-new-password" placeholder="نام" value={userPassword.newPassword1} onChange={handleChange2}></input>
                                <label htmlFor="user-new-password2" className="form-label" required>تکرار رمز عبور </label>
                                <input type="password" name="newPassword2" className="form-control" id="-new-password1" placeholder="نام" value={userPassword.newPassword2} onChange={handleChange2}></input>
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
                            {isChangeSuccessful&&(
                            <div className="alert alert-success" style={{marginTop:10}} role="alert">
                            <p className='success'>رمز عبور با موفقیت ویرایش گردید.</p>
                            </div>)}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={submitHandler2} >تغییر رمز عبور </button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {user.userInf.management&&(<UserInformation user={user} address={Address}/>)}
            {user.userInf.discount&&(<DiscountManagement user={user} address={Address}/>)}
            
             
            
        </>
    );
}

export default UserProfile;