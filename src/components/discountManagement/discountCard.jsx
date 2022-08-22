import { useState } from "react";
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import "./discountManagement.css"
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import axios from "axios";

const DiscountCard = (props) => {
    const [disc, setDisc] = useState(props.discount);
    const [value, setValue] = useState(new Date());
    const [errors, setErrors] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const isDisable = props.isDisable;
    const [checked, setChacked] = useState(true)
    const Address = props.address
    const user=props.user


    const handleChange = (e) => {
        const input = e.currentTarget;
        let newDisc = { ...disc }
        newDisc[input.name] = input.value;
        if (newDisc[input.name] !== disc[input.name]) {
            newDisc.changed = true;
            props.onchange(e, newDisc, props.index)
        }
    }
    const handleChange4 = (value,e) => {
        if(value!==null){
        const newDisc={...disc};
        newDisc.creationDate=value.toDate().getTime();
        newDisc.changed = true;
        props.onchange(e,newDisc, props.index)}
    }

    const handleChange5 = (value,e) => {
        if(value!==null){
        const newDisc={...disc};
        newDisc.expiredDate=value.toDate().getTime();
        newDisc.changed = true;
        props.onchange(e,newDisc, props.index)}
    }
  
    let schema = yup.object().shape({
        name: yup.string().required('فیلد نام تخفیف رو نباید خالی بذاری.'),
        description: yup.string().required('فیلد شرح تخفیف رو نباید خالی بذاری.'),
    })
    const validate = async () => {
        try {
            const result = await schema.validate(disc, { abortEarly: false });
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
        if (result&&user.userInf.id) {
            formData.append("id", result.id);
            formData.append("name", result.name);
            formData.append("description", result.description);
            formData.append("code", result.code);
            formData.append("customerId", result.customer.id);
            formData.append("userId", user.userInf.id);
            formData.append("creationDate",result.creationDate);
            formData.append("expiredDate", result.expiredDate);
            formData.append("state", result.state);
           
                try {
                    const response = await axios({
                        method: "post",
                        url: `${Address}/action/discount/updateDiscount.do`,
                        data: formData,
                        headers: {'Access-Token':`${user.token}` },
                    })
                    const newDisc={...result};
                    newDisc.changed=false;
                    props.onchange(e,newDisc,props.index)

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

    const onClickHandler = (e) => {
        const newDisc = { ...disc }
        if (newDisc.state === "active") {
            newDisc.state = "inactive"
        }
        else {
            newDisc.state = "active"
        }
        newDisc.changed=true;
        props.onchange(e,newDisc,props.index)
        setChacked(!checked)
    }

    const deleteHandler = async (e) => {
        setIsSending(true)
        e.preventDefault();
        try {
             const response = await axios({
                 method: "get",
                 url: `${Address}/action/discount/deleteDiscount.do?code=${disc.code}`,
                 headers: {'Access-Token':`${user.token}` },
             })
            props.deleteDiscount(e, disc.id)
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
        <div key={uuidv4()} className="col-md-3 col-12">
            <div key={uuidv4()} className="card cardColor" style={{borderRadius:"1rem",boxShadow:"24px 24px 80px rgba(0,0,0,0.1)"}} >
                <div key={uuidv4()} className="card-body">
                    <h5 key={uuidv4()} className="card-title">
                        <input key={uuidv4()} type='text' style={{ width: '100%', border: 'none',borderRadius:"0.4rem",textAlign:"center" }} name="name" defaultValue={disc.name} onBlur={handleChange} />
                    </h5>
                    <p key={uuidv4()} style={{ marginBottom: 0,float:"right" }}>کد تخفیف:</p>
                    <p key={uuidv4()} style={{ marginBottom: 0,color:"#5F5D5D" }}>{disc.code}</p>
                    <p key={uuidv4()} style={{ marginBottom: 0,float:"right"  }}>نام مشتری:</p>
                    <p key={uuidv4()} style={{ marginBottom: 0,color:"#5F5D5D"  }}>{disc.customer.name} {disc.customer.family}</p>
                    <p key={uuidv4()} style={{ marginBottom: 0,float:"right" }}>ایجاد کننده:</p>
                    <p key={uuidv4()} style={{ marginBottom: 0,color:"#5F5D5D"  }}>{disc.user.name} {disc.user.family}</p>
                    <textarea key={uuidv4()} style={{borderRadius:"0.4rem"}} name="description" defaultValue={disc.description} onBlur={handleChange} ></textarea>
                    <label className="switch">
                                    <input type="checkbox" checked={disc.state === "active" ? true : false} onChange={onClickHandler} />
                                    <span className="slider round"></span>
                                </label>
                    <div key={uuidv4()} className="row">
                        <div key={uuidv4()} className="col-6 p-1">
                            <DatePicker style={{borderRadius:"0.4rem"}} inputClass="form-control " key={uuidv4()} calendar={persian} locale={persian_fa} value={disc.creationDate} onChange={(e) => handleChange4(e)} calendarPosition="bottom-right" />
                        </div>
                        <div key={uuidv4()} className="col-6 p-1">
                            <DatePicker style={{borderRadius:"0.4rem"}} inputClass="form-control " key={uuidv4()}  calendar={persian} locale={persian_fa} value={disc.expiredDate} onChange={(e) => handleChange5(e)} calendarPosition="bottom-right" />
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
                    <div key={uuidv4()} className="row form-button">
                        <div key={uuidv4()}>
                            <button key={uuidv4()} className={disc.changed ? 'btn btn-outline-danger' : 'btn btn-outline-success'} disabled={isSending} onClickCapture={submitHandler}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
                            <button key={uuidv4()} className="btn btn-outline-danger" disabled={isSending} onClick={deleteHandler}><i className="fa fa-times" aria-hidden="true"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DiscountCard;