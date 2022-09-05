import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import headingPic from '../../assets/img/heading-cream.svg'
import "./discountManagement.css"
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import DiscountCard from './discountCard';
import { v4 as uuidv4 } from 'uuid';
import DefineDiscountModal from './defineDiscountModal';

const DiscountManagement = (props) => {
    const Address = props.address;
    const user = props.user;
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [discount, setDiscount] = useState({});
    const [discountList, setDiscountList] = useState([]);
    const [discountList2, setDiscountList2] = useState([]);
    const [value, setValue] = useState(new Date());
    const [ref,setRef]=useState(false);

    useEffect(
        async () => {
            const response = await axios({
                method: 'get',
                url: `${Address}/action/viewer/findAll.do?`,
                headers:{'Access-Token':`${user.token}`}
            })
            if (response.status = 200) {
                setDiscountList(response.data);
                setDiscountList2(response.data);
                setLoading(false)
            }
        }
        , [ref])
    const handleChange = (e) => {
        const input = e.currentTarget;
        const newDiscountList=[...discountList];
        setDiscountList2(newDiscountList.filter(d=>d[input.name].indexOf(input.value)>-1));
    }
    const handleChange3 = (e) => {
        const input = e.currentTarget;
        const newDiscountList=[...discountList];
        setDiscountList2(newDiscountList.filter(d=>d.user.id.toString().indexOf(input.value.toString())>-1));
     
    }
    const handleChange2 = (e) => {
        const input = e.currentTarget;
        const newDiscountList=[...discountList];
        setDiscountList2(newDiscountList.filter(d=>d.customer.id.toString().indexOf(input.value.toString())>-1));
     
    }
    const handleChange4=(value)=>{
        if(value!==null){
        setValue(value.toDate())
        const selectedDate= (value.toDate().getTime());
        const newDiscountList=[...discountList];
        setDiscountList2(newDiscountList.filter(d=>d.creationDate<=selectedDate));}
    }
    const handleChange5=(value)=>{
        if(value!==null){
        setValue(value.toDate())
        const selectedDate= (value.toDate().getTime());
        const newDiscountList=[...discountList];
        setDiscountList2(newDiscountList.filter(d=>d.creationDate<=selectedDate));}
    }
    //////////////////////////////////////////////////////////////

    const deleteDiscount=(e,id)=>{
        const newDiscountList= discountList2.filter(d=>d.id!==id)
        setDiscountList2([...newDiscountList])
    }
    const onChangeDiscount=(e,state,index)=>{
        const newDiscountList=[...discountList2];
        newDiscountList[index]=state;
        setDiscountList2(newDiscountList); 
    }

    //////////////////////////////////////////
    const[showModal,setShowModal]=useState(false);
    
    const handleShow=()=>{
        setShowModal(!showModal);
    }

    const requestRefresh=()=>{
      setRef(!ref)  
    }
    return (
        <>
            <div className='main-title'>
                <h2>مدیریت تخفیفات</h2>
                <img className='headerPic' src={headingPic} />
            </div>

            <div className="form">
                <div className="row">
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-code" className="form-label">کد </label>
                        <input type="number" name='code'  className="form-control" id="input-code" placeholder="کد " onChange={handleChange} />
                    </div>
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-name" className="form-label">نام </label>
                        <input type="text" name='name'  className="form-control" id="input-name" placeholder="نام " onChange={handleChange} />
                    </div>
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-createDate" className="form-label">تاریخ تعریف</label>
                        <DatePicker  inputClass="form-control " id="input-createDate"  calendar={persian} locale={persian_fa} value={value} onChange={(e)=>handleChange4(e)} calendarPosition="bottom-right"/>
                    </div>
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-expiredDate" className="form-label">تاریخ انقضا</label>
                        <DatePicker  inputClass="form-control " id="input-expiredDate"  calendar={persian} locale={persian_fa} value={value} onChange={(e)=>handleChange5(e)} calendarPosition="bottom-right"/>
                    </div>
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-state" className="form-label">وضعیت</label>
                        <input type="text" name='state'  className="form-control" id="input-state" placeholder="وضعیت" onChange={handleChange} />
                    </div>
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-customer" className="form-label">کد مشتری</label>
                        <input type="number" name='customer'  className="form-control" id="input-customer" placeholder="کد مشتری" onChange={handleChange2} />
                    </div>
                    <div className="col-md-3 col-6 p-1">
                        <label htmlFor="input-user" className="form-label">کد کاربر</label>
                        <input type="number" name='user'  className="form-control" id="input-user" placeholder="کد کاربر" onChange={handleChange3} />
                    </div>
                    <div className="col-md-3 col-6 p-1" style={{textAlign:"center"}}>
                        <br/>
                        <button type="button" className="btn btn-success defineDiscount" onClick={handleShow}>تعریف تخفیف جدید</button>
                    </div>
                </div>
                <p style={{marginTop:10}}>تعداد نتایج:{discountList2.length}</p>
            </div>
            <div className="row">
            {discountList2.map((d,i)=>{
                return(
                <DiscountCard key={uuidv4()} address={Address} user={user} discount={d} index={i} deleteDiscount={deleteDiscount} onchange={onChangeDiscount} />)
            })}
            </div>
            {showModal&&(<DefineDiscountModal handleShow={handleShow} address={Address} user={user} requestRefresh={requestRefresh}/>)}
            
        </>
    );
}

export default DiscountManagement;