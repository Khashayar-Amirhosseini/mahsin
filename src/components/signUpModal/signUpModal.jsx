import { useState } from 'react';
import './signUpModal.css'
import * as yup from 'yup'
import axios from "axios";
import emailjs from 'emailjs-com';
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { useRef } from 'react';
const SignUpModal = (props) => {
    const Address = props.address
    const [signUpInf, setSignUpInf] = useState({
        name: "",
        family: '',
        tel: "",
        email: "",
        moaref: '',
        birthDay:'',
        password1: '',
        password2: '',
    })
    const [errors, setErrors] = useState([])
    const [isValid, setIsValid] = useState(false);
    const [signUpSuccessful, setSignUpSuccessful] = useState(false)
    const [userInf,setuserInf]=useState({});
    const newUserInf={id:"",token:""};
    const [value, setValue] = useState(new Date())


    let schema = yup.object().shape({
        email: yup.string().email('فرمت ایمیل صحیح نیست').required('فیلد ایمیل الزامی است.'),
        password1: yup.string().min(6, 'پسورد حداقل 6 کاراکتر است.'),
        name: yup.string().required('فیلد نام الزامی است.'),
        family: yup.string().required('فیلد نام خانوادگی الزامی است.'),
        tel: yup.string().required('فیلد شماره تماس الزامی است.'),
        birthDay: yup.string().required('فیلد تاریخ تولد الزامی است..'),
    })

    const validate = async () => {
        try {
            const result = await schema.validate(signUpInf, { abortEarly: false });
            return result
        }
        catch (error) {
            setErrors(error.errors)
            setIsSending(false)
        }

    }

    function handleChange(e) {
        const input = e.currentTarget;
        let inf = { ...signUpInf }
        inf[input.id] = input.value;
        setSignUpInf(inf)
    }

    const handleChange2 = (value) => {
        let inf = { ...signUpInf };
        inf.birthDay = value.toDate().getTime();
        setSignUpInf(inf)
    }
    

    const passwordValidation = () => {
        signUpInf.password1 === signUpInf.password2 ? setIsValid(true) : setErrors(["رمز عبورهای وارد شده همخوانی ندارند."]); setIsSending(false)
    }


    const submitHandler = async (e) => {
        setErrors([])
        setIsSending(true)
        e.preventDefault();
        const result = await validate();
        passwordValidation();
        const formData = new FormData;
        if (result && isValid) {
            formData.append("name", result.name);
            formData.append("family", result.family);
            formData.append("phoneNumber", result.tel);
            formData.append("userName", result.email);
            formData.append("birthDay", result.birthDay);
            formData.append("inviterCode", result.moaref);
            formData.append("providedPassword", result.password1);
            
            try {
                const response = await axios({
                    method: "post",
                    url: `${Address}/action/userSignUp.do`,
                    data: formData,
                })
                if (response.data.state === "ok") {
                    setSignUpSuccessful(true)
                    setuserInf({id:response.data.userId,token:response.data.token}) 
                    sendEmail(response.data.token);
                }
                else {
                    setErrors([response.data.message])
                }
                setIsSending(false)

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
                         user_name:signUpInf.name,
                         user_email:signUpInf.email
                     }
           emailjs.send('service_5q2j7mb', 'template_hafp27y',template_params, 'd_qZS5h-vWXQ7xB8x')
               .then((result) => {
                  console.log(result.text);
                  setIsSending(false)
               }, (error) => {
                   console.log(error.text);
               });
      };

    const [isSending, setIsSending] = useState(false);


    return (
        <>
            <div className="modal fade" id="signUp" tabIndex="-1" aria-labelledby="signUp" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="signUp">فرم ثبت نام</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body signUpInf">
                            <form >
                                <label htmlFor="name" className="form-label" required>نام:</label>
                                <input type="text" className="form-control col-md-6" id="name" placeholder="نام" value={signUpInf.name} onChange={handleChange}></input>
                                <label htmlFor="family" className="form-label">نام خانوادگی:</label>
                                <input type="text" className="form-control" id="family" placeholder="نام خانوادگی" value={signUpInf.family} onChange={handleChange}></input>
                                <label htmlFor="tel" className="form-label">شماره تماس:</label>
                                <input type="number" className="form-control" id="tel" placeholder="شماره تماس" value={signUpInf.tel} onChange={handleChange}></input>
                                <label htmlFor="email" className="form-label">ایمیل:</label>
                                <input type="text" className="form-control" id="email" placeholder="ایمیل" value={signUpInf.email} onChange={handleChange}></input>
                                <label htmlFor="moaref" className="form-label">معرف:</label>
                                <input type="text" className="form-control" id="moaref" placeholder="در این قسمت کد معرف را وارد نمایید." value={signUpInf.moaref} onChange={handleChange}></input>
                                <label htmlFor="input-birthDay" className="form-label">تاریخ تولد</label>
                                <DatePicker inputClass="form-control " id="input-birthDay" calendar={persian} locale={persian_fa} value={value} onChange={(e) => handleChange2(e)} calendarPosition="bottom-right" />
                                <label htmlFor="password1" className="form-label">رمز عبور:</label>
                                <input type="password" className="form-control" id="password1" placeholder="******" value={signUpInf.password1} onChange={handleChange}></input>
                                <label htmlFor="password2" className="form-label">تکرار رمز عبور:</label>
                                <input type="password" className="form-control" id="password2" placeholder="******" value={signUpInf.password2} onChange={handleChange}></input>
                                <div className='submitButton'>
                                    <button type='submit' className="btn btn-primary offset-md-6" disabled={isSending} onClick={(e) => submitHandler(e)}>ثبت نام</button>
                                </div>
                            </form>
                            {errors.length !== 0 && (
                                <div className='alert alert-danger signUpErrors'>
                                    <ul>
                                        {errors.map((e, i) => <li key={i}>{e}</li>)}
                                    </ul>
                                </div>
                            )
                            }
                            {signUpSuccessful && (
                                <div className="alert alert-success" style={{ marginTop: 10 }} role="alert">
                                    <p className='success'>لینک تائید ایمیل برای شما ارسال گردید.</p>
                                </div>)}

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary " data-bs-dismiss="modal">بستن</button>
                        </div>
                    </div>
                </div>
            </div>
            

        </>
    );
}

export default SignUpModal;