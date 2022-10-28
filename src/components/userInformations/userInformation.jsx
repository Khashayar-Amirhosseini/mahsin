import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import './userInformation.css';
import headingPic from '../../assets/img/heading-cream.svg'
import { computeStyles } from "@popperjs/core";
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

const UserInformation = (props) => {
    const Address = props.address;
    const user = props.user;
    const [userList, setUserList] = useState([])
    const[userList2,setUserList2]=useState([])
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [activeUser, setActiveUser] = useState({});
    const [isChanged, setIsChanged] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [errors, setErrors] = useState([]);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [checked, setChacked] = useState(true);
    const [roleList, setRoleList] = useState([
        { rolePersianName: 'تماس', roleName: 'footer' },
        { rolePersianName: 'تاریخچه', roleName: 'history' },
        { rolePersianName: 'پزشکان', roleName: 'doctor' },
        { rolePersianName: 'اهداف', roleName: 'goal' },
        { rolePersianName: 'خطی مشی', roleName: 'policy' },
        { rolePersianName: 'دستاوردها', roleName: 'achievement' },
        { rolePersianName: 'تصاویر', roleName: 'picture' },
        { rolePersianName: 'خدمات', roleName: 'service' },
        { rolePersianName: 'تجهیزات', roleName: 'facility' },
        { rolePersianName: 'مقالات', roleName: 'blogger' },
        { rolePersianName: 'عضو فعال', roleName: 'user' },
        { rolePersianName: 'کاربران', roleName: 'management' },
        { rolePersianName: 'دسترسی', roleName: 'role' },
        { rolePersianName: 'تخفیفات', roleName: 'discount' },
        { rolePersianName: 'مشاهده گر', roleName: 'viewer' },
    ])
    {useEffect(
        async () => {
            if(user.userInf.viewer){
            const response = await axios({
                method: 'get',
                url: `${Address}/action/viewer/userFindAll.do?`,
                headers: {'Access-Token':`${user.token}` }, 
            })
            if (response.status = 200) {
                setUserList(response.data);
                setUserList2(response.data)
                setLoading(false)
            }}
        }
    , [])}

    const handleChange = (e) => {
        const input = e.currentTarget;
        let newuser = { ...activeUser }
        newuser[input.name] = input.value;
        setActiveUser(newuser)
        setIsChanged(true)
    }

    const handleChange6 = (value) => {
        let newuser = { ...activeUser };
        newuser.birthDay = value.toDate().getTime();
        setActiveUser(newuser)
        setIsChanged(true)
    }
    const roleCheck = (providedUser, providedRoleName) => {
        let hasRole = false;
        providedUser.roles && (
            providedUser.roles.map(r => {
                if (r.roleName === providedRoleName) {
                    hasRole = true
                }
            }))
        return hasRole
    }

    const onClickHandler = async (newRole) => {
        if (activeUser.roles) {
            const newActiveUser = { ...activeUser }
            if (!roleCheck(activeUser, newRole.roleName)) {
                newActiveUser.roles.push(await submitAddRole(newRole.roleName))
                setActiveUser(newActiveUser)
            }
            else {
                let newRoleList = [];
                let roleId = 0;
                newActiveUser.roles.map(r => {
                    if (r.roleName !== newRole.roleName) {
                        newRoleList.push(r);
                    }
                }
                )
                newActiveUser.roles.map(r => {
                    if (r.roleName === newRole.roleName) {
                        roleId = r.id;
                    }
                })
                newActiveUser.roles = newRoleList;
                await submitRemoveRole(roleId)
                setActiveUser(newActiveUser)
            }
            setActiveUser(newActiveUser)

        }

    }

    let schema = yup.object().shape({
        name: yup.string().required('فیلد نام رو نباید خالی بذاری.'),
        family: yup.string().required('فیلد نام خانوادگی  رو نباید خالی بذاری.'),
        phoneNumber: yup.number().required('فیلد شماره تلفن رو نباید خالی بذاری.'),
        birthDay: yup.number().required('فیلد تاریخ تولد رو نباید خالی بذاری.'),
    })
    const validate = async () => {
        try {
            const result = await schema.validate(activeUser, { abortEarly: false });
            return result
        }
        catch (error) {
            setErrors(error.errors)
            setIsSending(false)
        }

    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setErrors([]);
        
        const result = await validate();
        const formData = new FormData;
        if (result&&isChanged) {
            setIsSending(true)
            formData.append("id", activeUser.id)
            formData.append("name", activeUser.name);
            formData.append("family", activeUser.family);
            formData.append("phoneNumber", activeUser.phoneNumber);
            formData.append("birthDay", activeUser.birthDay);
            formData.append("inviterCode", activeUser.inviterCode);
            try {
                const response = await axios({
                    method: "post",
                    url: `${Address}/action/user/userEdit.do`,
                    data: formData,
                    headers: {'Access-Token':`${user.token}` },
                })
                if(activeUser.password){
                    formData.delete("id");
                    formData.delete("name");
                    formData.delete("family");
                    formData.delete("phoneNumber");
                    formData.delete("birthDay");
                    formData.delete("inviterCode");
                    formData.append("userId", activeUser.id)
                    formData.append("newPassword",activeUser.password)
                        const response2 = await axios({
                            method: "post",
                            url: `${Address}/action/admin/changePassword.do`,
                            data: formData,
                            headers: {'Access-Token':`${user.token}` },
                        })}
                const newUser = { ...result };
                setIsChanged(false);
                setIsSuccessful(true);
                setIsSending(false);
                let newUserList=[...userList2];
                let index="";
                newUserList.map((u,i)=>{
                   if(u.id===newUser.id){
                       index=i;
                   }
                })
                newUserList[index]=newUser;
                setUserList2(newUserList);

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





    const submitAddRole = async (roleName) => {
        setIsSending(true)
        try {
            const response = await axios({
                method: "get",
                url: `${Address}/action/role/saveRole.do?roleName=${roleName}&userId=${activeUser.id}`,
                headers: {'Access-Token':`${user.token}` },

            })
            setIsSending(false)
            return response.data

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
    const submitRemoveRole = async (roleId) => {
        setIsSending(true)
        try {
            const response = await axios({
                method: "get",
                url: `${Address}/action/role/deleteRole.do?roleId=${roleId}`,
                headers: {'Access-Token':`${user.token}` },

            })
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

    ///////////////////////////////search box/////////
    const [value, setValue] = useState(new Date());
    
    const handleChange2 = (e) => {
        const input = e.currentTarget;
        const newUserList=[...userList];
        setUserList2(newUserList.filter(d=>d[input.name].indexOf(input.value)>-1));
    }
    const handleChange4 = (e) => {
        const input = e.currentTarget;
        if(!Number.isNaN(parseInt(input.value))){
        const newUserList=[...userList];
        setUserList2(newUserList.filter(d=>d[input.name]===parseInt(input.value)));}
        else{
            setUserList2(userList)
        }
    }
    const handleChange3=(value)=>{
        if (value!==null){
            setValue(value.toDate())
        
        const selectedDate= (value.toDate().getTime());
        const newUserList=[...userList];
        setUserList2(newUserList.filter(d=>d.joinDate<=selectedDate));
        }
        else{
            setUserList2(userList)
        }
        
    }
    const handleChange5=(value)=>{
        if (value!==null){
            setValue(value.toDate())
        const selectedDate= (value.toDate().getTime());
        const newUserList=[...userList];
        setUserList2(newUserList.filter(d=>d.birthDay<=selectedDate));
        }
        else{
            setUserList2(userList)
        }
        
    }


    return (
        <>
            <div className='main-title'>
                <h2>اطلاعات اعضای سایت</h2>
                <img className='headerPic' src={headingPic} />
            </div>
            <div className="form">
                <div className="row">
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-id" className="form-label">کد کاربری </label>
                        <input type="number" name='id' className="form-control" id="input-id" placeholder="کد کاربری " onChange={handleChange4} />
                    </div>
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-name" className="form-label"> نام </label>
                        <input type="text" name='name' className="form-control" id="input-name" placeholder="نام " onChange={handleChange2} />
                    </div>
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-family" className="form-label">نام خانوادگی</label>
                        <input type="text" name='family' className="form-control" id="input-family" placeholder="نام خانوادگی " onChange={handleChange2} />
                    </div>
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-email" className="form-label">ایمیل</label>
                        <input type="text" name='email' className="form-control" id="input-email" placeholder="ایمیل" onChange={handleChange2} />
                    </div>
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-joinDate" className="form-label">تاریخ عضویت</label>
                        <DatePicker  inputClass="form-control " id="input-createDate"  calendar={persian} locale={persian_fa} value={value} onChange={(e)=>handleChange3(e)} calendarPosition="bottom-right"/>
                    </div>
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-birthDay" className="form-label">تاریخ تولد</label>
                        <DatePicker  inputClass="form-control " id="input-birthDay"  calendar={persian} locale={persian_fa} value={value} onChange={(e)=>handleChange5(e)} calendarPosition="bottom-right"/>
                    </div>
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-phoneNumber" className="form-label">شماره تماس</label>
                        <input type="text" name='phoneNumber' className="form-control" id="input-phoneNumber" placeholder="ایمیل" onChange={handleChange2} />
                    </div>
                </div>
                <p style={{marginTop:10}}>تعداد نتایج:{userList2.length}</p>
               
            </div>
            {loading ?
                <>
                    <div className="row">
                        {Array(4).fill({}).map(() => {
                            return (
                                <div key={uuidv4()} className="col-md-3">
                                    <div key={uuidv4()} className="card ">
                                        <div key={uuidv4()} className="card-body">
                                            <h5 className="card-title"><Skeleton width={"80%"} /></h5>
                                            <Skeleton count={5} width={"50%"} />
                                            <Skeleton width={"20%"} style={{ margin: "auto" }} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </>
                :
                <div className="row">
                    {userList2.map((u, i) => {
                        return (
                            <div key={uuidv4()} className="col-md-3">
                                <div key={uuidv4()} className="card cardColor" style={{ borderRadius: "1rem", boxShadow: "24px 24px 80px rgba(0,0,0,0.1)" }}>
                                    <div key={uuidv4()} className="card-body">
                                        <h5 className="card-title">{u.name} {u.family}</h5>
                                        <p style={{ marginBottom: 0,float:"right"}}>کد کاربری:</p>
                                        <p  style={{ marginBottom: 0,color:"#5F5D5D" }}>{u.id}</p>
                                        <p style={{ marginBottom: 0,float:"right"}}>شماره تماس:</p>
                                        <p style={{ marginBottom: 0,color:"#5F5D5D" }}>{u.phoneNumber}</p>
                                        <p style={{ marginBottom: 0,float:"right"}}>ایمیل:</p>
                                        <p style={{ marginBottom: 0,color:"#5F5D5D" }}>{u.email}</p>
                                        <p style={{ marginBottom: 0,float:"right"}}>کد معرف</p>
                                        <p style={{ marginBottom: 0,color:"#5F5D5D" }} >{u.inviterCode?u.inviterCode:"ثبت نشده"}</p>
                                        <p style={{ marginBottom: 0,float:"right"}}>تاریخ تولد:</p>
                                        <p style={{ marginBottom: 0,color:"#5F5D5D" }} >{u.birthDay?new Date((u.birthDay)).toLocaleDateString('fa-IR'):"ثبت نشده"}</p>
                                        <p style={{ marginBottom: 0,float:"right"}}>تاریخ عضویت:</p>
                                        <p style={{ marginBottom: 20,color:"#5F5D5D" }} >{new Date((u.joinDate)).toLocaleDateString('fa-IR')}</p>
                                        
                                        <button type="button" className="btn btn-success" style={{ fontFamily: "Byekan" }} onClick={(e) => { setShowModal(true); setActiveUser(userList[i]) }}>ویرایش اطلاعات</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>}
            {showModal && (<div className="modal" style={{ display: "block" }}>
                <div className="modal-dialog" tabIndex="-1" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title row">ویرایش اطلاعات</h5>
                            <button type="button" className="btn-close" onClick={(e) => { setShowModal(false); setErrors([]); setIsSuccessful(false) }}></button>
                        </div>
                        <div className="modal-body">
                            <h2>اطلاعات عمومی کاربر</h2>
                            <div className="row">
                                <div className="mb-3 col-md-6 p-1">
                                    <label htmlFor="input-name" className="form-label">نام:</label>
                                    <input type="text" name="name" className="form-control" id="input-name" value={activeUser.name} onChange={(e) => handleChange(e)} />
                                </div>
                                <div className="mb-3 col-md-6 p-1">
                                    <label htmlFor="input-family" className="form-label">نام خانوادگی:</label>
                                    <input type="text" name="family" className="form-control" id="input-family" value={activeUser.family} onChange={(e) => handleChange(e)} />
                                </div>
                                <div className="mb-3 col-md-6 p-1">
                                    <label htmlFor="input-phoneNumber" className="form-label">شماره تماس</label>
                                    <input type="text" name="phoneNumber" className="form-control" id="input-phoneNumber" value={activeUser.phoneNumber} onChange={(e) => handleChange(e)} />
                                </div>
                                <div className="mb-3 col-md-6 p-1">
                                    <label htmlFor="input-inviterCode" className="form-label">کد معرف</label>
                                    <input type="text" name="inviterCode" className="form-control" id="input-inviterCode" value={activeUser.inviterCode} onChange={(e) => handleChange(e)} />
                                </div>
                                <div className="mb-3 col-md-6 p-1">
                                    <label htmlFor="input-birthDay" className="form-label">تاریخ تولد</label>
                                    <DatePicker inputClass="form-control " id="input-birthDay" calendar={persian} locale={persian_fa} value={activeUser.birthDay} onChange={(e) => handleChange6(e)} calendarPosition="bottom-right" />
                                </div>
                                {(user.userInf.admin||user.userInf.viewer)&&<div className="mb-3 col-md-6 p-1">
                                    <label htmlFor="input-password" className="form-label">رمز عبور</label>
                                    <input type="password" name="password" className="form-control " id="input-password"  value={activeUser.password} onChange={(e) => handleChange(e)} calendarPosition="bottom-right" />
                                </div>}

                            </div>
                            {user.userInf.role ?
                                <>
                                    <h2>دسترسی ها</h2>
                                    <div className="row">
                                        {roleList.map(r => {
                                            return (
                                                <div key={uuidv4()} className="col-md-4" style={{ textAlign: "left", marginBottom: 5 }} >
                                                    <p style={{ float: "right", margin: 5 }}>{r.rolePersianName}</p>
                                                    <label className="switch" style={{ margin: 0 }} >
                                                        <input type="checkbox" checked={roleCheck(activeUser, r.roleName)} onChange={() => { onClickHandler(r) }} />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </div>
                                            )
                                        })}
                                        {user.userInf.admin && (
                                            <div key={uuidv4()} className="col-md-4 col-sd-6" style={{ textAlign: "left", marginBottom: 5 }} >
                                                <p style={{ float: "right", margin: 5 }}>ادمین</p>
                                                <label className="switch" style={{ margin: 0 }} >
                                                    <input type="checkbox" checked={roleCheck(activeUser, "admin")} onChange={(e) => onClickHandler({ rolePersianName: 'ادمین', roleName: 'admin' })} />
                                                    <span className="slider round"></span>
                                                </label>
                                            </div>)}
                                    </div>
                                </> :
                                <></>}
                            <div>
                                <ul>
                                    {errors.length !== 0 && (errors.map((er) => {
                                        return (
                                            <li key={uuidv4()} className="Error-list">
                                                <p key={uuidv4()} className="Errors" >{er}</p>
                                            </li>
                                        )
                                    }))}
                                </ul>
                                {isSuccessful && (
                                    <div className="alert alert-success" style={{ marginTop: 10 }} role="alert">
                                        <p className='success'>اطلاعات کاربری با موفقیت ویرایش گردید.</p>
                                    </div>)}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={(e) => { setShowModal(false); setShowModal(false); setErrors([]); setIsSuccessful(false) }} >Close</button>
                            <button type="button" style={{ margin: "auto" }} className={isChanged ? 'btn btn-outline-danger' : 'btn btn-outline-success'} disabled={isSending} ><i className="fa fa-floppy-o" aria-hidden="true" onClick={e => submitHandler(e)}></i></button>
                        </div>
                    </div>
                </div>
            </div>)}
        </>
    )
}

export default UserInformation;