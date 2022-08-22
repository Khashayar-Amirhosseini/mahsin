import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { useEffect, useState } from "react"
import * as yup from 'yup';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


const DefineDiscountModal = (props) => {
    const handleShow = props.handleShow
    const [value, setValue] = useState(new Date())
    const [userList, setUserList] = useState([])
    const [loading, setLoading] = useState(true);
    const Address = props.address;
    const user = props.user;
    const [disc, setDisc] = useState({ name: "", description: "", creationDate: "", expiredDate:"", customerId: "", userId: "" });
    const [errors, setErrors] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const[activeUser,setActiveUser]=useState({});
    


    const handleChange = (e) => {
        const input = e.currentTarget;
        let newDisc = { ...disc }
        newDisc[input.name] = input.value;
        setDisc(newDisc)
    }
    const handleChange2 = (value) => {
        let newDisc = { ...disc };
        newDisc.creationDate = value.toDate().getTime();
        newDisc.expiredDate="";
        setDisc(newDisc);
    }
    const handleChange3 = (value) => {
        let newDisc = { ...disc };
        if(!newDisc.creationDate){
            setErrors(["اول باید تاریخ تعریف تخفیف  رو وارد کنی"])
        }
        else{
        if (value.toDate().getTime() > newDisc.creationDate) {
            newDisc.expiredDate = value.toDate().getTime();
            setDisc(newDisc);
            setErrors([])
        }
        else {
            setErrors(["تاریخ انقضا نمی تواند کمتر از تاریخ تولید تخفیف باشد."])
        }
    }
    }

    const handleChange4=async(e)=>{
        setErrors([])
        setActiveUser()
        const input = e.currentTarget;
        if(input.value){
        try {
            const response = await axios({
                method: "post",
                url: `${Address}/action/management/findOneUser.do?userId=${input.value}`,
                headers: {'Access-Token':`${user.token}` },
            })
            if(response.data.id){
                setActiveUser(response.data)
                let isUser=false;
                response.data.roles.map(r=>{
                    r.roleName==="user"&&(isUser=true);
                })
                if(isUser){
                    let newDisc = { ...disc }
                    newDisc[input.name] = input.value;
                    setDisc(newDisc)  
                }
                else{
                    setErrors(["کابر مورد نظر عضور فعال باشگاه مشتریان نیست."])
                }
                
            }
            else{
                setErrors(["کابر مورد نظر یافت نشد."])
            }

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
        }}

    }

    let schema = yup.object().shape({
        name: yup.string().required('فیلد نام تخفیف رو نباید خالی بذاری.'),
        description: yup.string().required('فیلد شرح تخفیف رو نباید خالی بذاری.'),
        customerId:yup.string().required('خب به کی میخای تخفیف بدی؟! .'),
        creationDate:yup.string().required("تاریخ تعریف تخفیف رو درست وارد نکردی"),
        expiredDate:yup.string().required("تاریخ انقضا تخفیف درست رو درست وارد نکردی")

    })
    const validate = async () => {
        try {
            const result = await schema.validate(disc, { abortEarly: false });
            console.log(result)
            return result
        }
        catch (error) {
            setErrors(error.errors)
            console.log(errors)
        }


    }
    const submitHandler = async (e) => {
        e.preventDefault();
        setErrors([])
        const result = await validate();
        const formData = new FormData;
        
        
        if (result&&user.userInf.id) {
            setIsSending(true)
            formData.append("id", result.id);
            formData.append("name", result.name);
            formData.append("description", result.description);
            formData.append("code", result.code);
            formData.append("customerId", result.customerId);
            formData.append("userId", user.userInf.id);
            formData.append("creationDate",result.creationDate);
            formData.append("expiredDate", result.expiredDate);
            formData.append("state", result.state);
             try {
                 const response = await axios({
                     method: "post",
                     url: `${Address}/action/discount/saveDiscount.do`,
                     data: formData,
                     headers: {'Access-Token':`${user.token}` },
                 })
                 setDisc(response.data)
                 setIsSending(false)
                 props.requestRefresh()
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
        <div className="modal show" tabIndex="2">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">تعریف تخفیف جدید</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleShow}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-6 p-1">
                                <label htmlFor="input-name" className="form-label">نام </label>
                                <input type="text" name='name' value={disc.name} className="form-control" id="input-name" placeholder="نام تخفیف " onChange={handleChange} />
                            </div>
                            <div className="col-12 p-1">
                                <label htmlFor="input-description" className="form-label">شرح تخفیف </label>
                                <textarea type="text" name='description' value={disc.description} className="form-control" id="input-description" placeholder="شرح تخفیف " onChange={handleChange} />
                            </div>
                            <div className="col-6 p-1">
                                <label htmlFor="input-createDate" className="form-label">تاریخ تعریف</label>
                                <DatePicker inputClass="form-control " id="input-createDate" calendar={persian} locale={persian_fa} value={value} onChange={(e) => handleChange2(e)} calendarPosition="bottom-right" />
                            </div>
                            <div className="col-6 p-1">
                                <label htmlFor="input-expiredDate" className="form-label">تاریخ انقضا</label>
                                <DatePicker inputClass="form-control " id="input-expiredDate" calendar={persian} locale={persian_fa} value={value} onChange={(e) => handleChange3(e)} calendarPosition="bottom-right" />
                            </div>
                            <div className="col-6 p-1">
                                <label htmlFor="input-customerId" className="form-label">کد کاربری مشتری </label>
                                <input type="text" name='customerId' defaultValue={disc.customerId} className="form-control" id="input-customerId" placeholder="کد کاربری مشتری " onBlur={handleChange4} />
                            </div>
                            <div className="col-6 p-1" style={{textAlign:"center"}}>
                                <br/>
                                {activeUser&&(<p>{activeUser.name} {activeUser.family}</p>)}
                            </div>
                        </div>
                        {disc.user&&(
                            <div className="row ">
                            <div className="doctor-update-des">
                                <p >{disc.user.family + ` ` + disc.user.name}   </p>
                            </div>
                        </div>
                        )}
                        
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
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleShow}>Close</button>
                        <button type="button" className="btn btn-primary" disabled={isSending} onClick={submitHandler}>save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DefineDiscountModal;