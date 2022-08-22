import { useState } from 'react';
import SignUpModal from '../signUpModal/signUpModal';
import './signInModal.css';
import * as yup from 'yup';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import emailjs from 'emailjs-com';
import { useRef } from 'react';
import { useEffect } from 'react';
const SignInModal = (props) => {

    const [isLoaded,setIsLoaded]=useState(false)
    const [account, setAccount] = useState({
        email: '',
        password: ''
    })
    


    const Address = props.address;
    const [errors, setErrors] = useState([])
    const [isSending, setIsSending] = useState(false)
    const [isLoginSuccessful,setIsLoginSuccessFul]=useState(false);
    
    

    const handleChange = (e) => {
        const input = e.currentTarget;
        let newAccount = { ...account }
        newAccount[input.name] = input.value;
        setAccount(newAccount)
    }
    let schema = yup.object().shape({
        email: yup.string().email('فرمت ایمیل صحیح نیست').required('فیلد ایمیل الزامی است.'),
        password: yup.string().min(6, 'پسورد حداقل 6 کاراکتر است.')
    })
    const validate = async () => {
        try {
            const result = await schema.validate(account, { abortEarly: false });
            return result
        }
        catch (error) {
            setErrors(error.errors)
        }

    }
    const submitHandler = async (e) => {
        setErrors([])
        setIsLoginSuccessFul(false)
        e.preventDefault();
        const result = await validate();
        const formData = new FormData;
        if (result) {
            setIsSending(true)
            formData.append("userName", result.email);
            formData.append("password", result.password);
            try {
                const response = await axios({
                    method: "post",
                    url: `${Address}/action/login.do`,
                    data: formData,
                })
        
                if(response.data.token){
                    setIsLoginSuccessFul(true);
                    props.login(response.data);
                    localStorage.setItem("user",JSON.stringify(response.data)) ;
                    
                }  
            }
            catch (e) {
                setErrors(["مشکل در سرور پیش اومده"])
            }
            setIsSending(false)
        }

    }
//////////////////////password fogotten/////////////////////
const [isSuccessful,setIsSuccessFul]=useState(false);
const [securityKey,setSecurityKey]=useState();
let schema2 = yup.object().shape({
    email: yup.string().email('فرمت ایمیل صحیح نیست').required('فیلد ایمیل الزامی است.'),
})


const validate2 = async () => {
    try {
        const result = await schema.validate(account, { abortEarly: false });
        return result
    }
    catch (error) {
        setErrors(error.errors)
    }

}
const submitHandler2 = async (e) => {
    setErrors([])
    e.preventDefault();
    const result = await validate2();
    const formData = new FormData;
    if (result) {
        setIsSending(true)
        formData.append("userName", result.email);
        try {
            const response = await axios({
                method: "post",
                url: `${Address}/action/forgotPassword.do`,
                data: formData,
            })
            if(response.data.securityKey){
               sendEmail(response.data.securityKey)
               setIsSuccessFul(true)
            }
            else{
                setErrors(["حساب کاربری یافت نشد."]) 
            }  
        }
        catch (e) {
            setErrors(["مشکل در سرور پیش اومده"])
        }
        setIsSending(false)
    }

}


    

    const sendEmail = (sk) => {
        setIsSending(true)
        var template_params={
                          message:Address+`changePassword.jsp?securityKey=${sk}`,
                        
                          user_email:account.email
                      }
            emailjs.send('service_5q2j7mb', 'template_hafp27y',template_params, 'd_qZS5h-vWXQ7xB8x')
                .then((result) => {
                   console.log(result.text);
                   setIsSending(false)
                }, (error) => {
                    console.log(error.text);
                });}
              

    


    return (
        <>
            <div className="modal fade" id="signIn" tabIndex="-1" aria-labelledby="signIn" aria-hidden="true">
                <div className="modal-dialog signInModal">
                    <div className="modal-content ">
                        <div className="modal-header">
                            <h5 className="modal-title" id="signIn">ورود</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            <form >
                                <div className="mb-3">
                                    <label htmlFor="emailIn" className="form-label">آدرس ایمیل</label>
                                    <input type="email" name='email' value={account.email} className="form-control" id="emailIn" placeholder="name@example.com" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="passwordIn" className="form-label">کلمه عبور</label>
                                    <input type="password" name='password' value={account.password} className="form-control" id="passwordIn" placeholder="******" onChange={handleChange} />
                                </div>
                                <div className="col-md-12 mt-1">
                                    <button type="button " className="btn btn-success Enter col-md-4 col-3" disabled={isSending} onClick={submitHandler}>ورود</button>
                                    <button type="button forgetPassword" className="btn btn-danger col-md-4 col-6" disabled={isSending} onClick={submitHandler2}>فراموشی رمز عبور</button>
                                </div>
                                <div className="col-md-12 mt-1 register">
                                    <button type="button" className="btn btn-primary mx-auto col-md-4 col-6" disabled={isSending} data-bs-toggle="modal" data-bs-target="#signUp">ثبت نام</button>
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
                            {isLoginSuccessful&&(
                            <div className="alert alert-success" style={{marginTop:10}} role="alert">
                            <p className='success'>خوش آمدید.</p>
                            </div>)}
                            {isSuccessful&&(
                            <div className="alert alert-success" style={{marginTop:10}} role="alert">
                            <p className='success'>لینک بازیابی رمز عبور به ایمیل شما ارسال گردید.</p>
                            </div>)}

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">بستن</button>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default SignInModal;