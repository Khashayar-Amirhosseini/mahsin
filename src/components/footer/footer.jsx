
import { useState,useEffect } from 'react';
import { useContext } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { FooterContext } from '../../context/footerContext';
import axios from "axios";
import * as yup from 'yup';

import './footer.css'
const Footer = (props) => {

   const { contacts } = useContext(FooterContext)
   const Address=props.address
   const { isLoading } = useContext(FooterContext);
   const [contactInf, setContactInf]=useState({});
   const [isSaved, setIsSaved]=useState(true)
   const[errors,setErrors]=useState([])
   const [isSending,setIsSending]=useState(false)
   const user=props.user;
   useEffect(()=>{
      setContactInf(contacts[0])  
   },contacts)
   const handleChange=(e)=>{
      const input = e.currentTarget;
      let newContactInf={...contactInf};
      newContactInf[input.name]=input.value; 
      setContactInf(newContactInf)
      setIsSaved(false)
  }

  let schema=yup.object().shape({
   instagram:yup.string().required('باید لینک ایستاگرام کلینیک رو بزاری'),
   telegram:yup.string().required('باید لینک کانال تلگرام (خدا بیامورز) کلینیک رو بذاری'),
   email:yup.string().required('یه ایمیل باید از کلینیک بزاری'),
   tel1:yup.string().required('شماره کلینیک باید بدی'),
   address:yup.string().required('آدرس کلینیک رو باید بدی'),
   mapSRC:yup.string().required('موقعیت گوگل مپ کلینیک هم باید بدی'),

})
const validate=async()=>{
   try{
      const result= await schema.validate(contactInf,{abortEarly:false});
       return result
   }
   catch(error){
      setErrors(error.errors)  
   }
  
}

  const submitHandler= async(e)=>{
   setErrors([])
   e.preventDefault();
   const result=await validate();
   if(result){
   
      setIsSending(true)  
       try{
         const response = await axios({
            method: "get",
            url: `${Address}/action/footer/updateFooter.do?id=${result.id}&tel1=${result.tel1}&tel2=${result.tel2}&tel3=${result.tel3}
            &instagram=${result.instagram}&telegram=${result.telegram}&email=${result.email}
            &address=${result.address}&mapSRC=${result.mapSRC}
            &consultantNumber=${result.consultantNumber}
            &userId=${user.userInf.id}
            &state=active`,
            headers: {'Access-Token':`${user.token}` },
        })
           setIsSaved(true)
           setIsSending(false)
       }
       catch(e){
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
      <div className="footer">
         {isLoading ?
            <>
               <div className="row">
                  <div className='map col-md-6'>
                     <iframe src={contacts[0].mapSRC} width="50%" height="80%" allowFullScreen="" loading="lazy"></iframe>
                  </div>
                  <div className="col-md-4 offset-md-2 contact">
                     <h5>شماره تماس کلینیک:</h5>
                     <h6>
                        <SkeletonTheme baseColor="#F3B40D" highlightColor="#444" width={50}>
                           <Skeleton width={100} height={20} className="socialSkeleton" />
                        </SkeletonTheme>
                     </h6>
                     <h6>
                        <SkeletonTheme baseColor="#F3B40D" highlightColor="#444" width={50}>
                           <Skeleton width={100} height={20} className="socialSkeleton" />
                        </SkeletonTheme>
                     </h6>
                     <h6>
                        <SkeletonTheme baseColor="#F3B40D" highlightColor="#444" width={50}>
                           <Skeleton width={100} height={20} className="socialSkeleton" />
                        </SkeletonTheme>
                     </h6>

                     <h5>آدرس:</h5>
                     <h6>
                     <SkeletonTheme baseColor="#F3B40D" highlightColor="#444" width={50}>
                        <Skeleton width={300} height={20} className="socialSkeleton"/>
                     </SkeletonTheme>
                     </h6>
                     
                  </div>
               </div>
               <div className="row">
                  <div className="s1">
                     <div className="socials">
                     <SkeletonTheme baseColor="#F3B40D" highlightColor="#444" width={50}>
                        <Skeleton circle={true} width={25} height={25} className="socialSkeleton"/>
                     </SkeletonTheme>
                     <SkeletonTheme baseColor="#F3B40D" highlightColor="#444" width={50}>
                        <Skeleton circle={true} width={25} height={25} className="socialSkeleton"/>
                     </SkeletonTheme>
                     <SkeletonTheme baseColor="#F3B40D" highlightColor="#444" width={50}>
                        <Skeleton circle={true} width={25} height={25} className="socialSkeleton"/>
                     </SkeletonTheme>    
                     </div>
                  </div>
               </div>
               <div className="row copyright">
                  <p>تمامی حقوق مادی و معنوی این سایت متعلق به کلینیک زیبایی ماه سین است.</p>
               </div>


            </> :
            <>

               <div className="row">
                  <div className='map col-md-6'>
                     <iframe src={contactInf.mapSRC} width="50%" height="80%" allowFullScreen="" loading="lazy"></iframe>
                     {user.userInf.footer?
                     <h6><input type="text" name="mapSRC" value={contactInf.mapSRC}  onChange={handleChange} placeholder='لینک مکانی گوگل'/> </h6>
                     :<></>}
                  </div>
                  <div className="col-md-4 offset-md-2 contact">
                     <h5>شماره تماس کلینیک:</h5>
                     <h6><input type="tel" name="tel1" value={contactInf.tel1} readOnly={!user.userInf.footer} onChange={handleChange}/> </h6>
                     <h6><input type="tel" name="tel2" value={contactInf.tel2} readOnly={!user.userInf.footer} onChange={handleChange}/> </h6>
                     <h6><input type="tel" name="tel3" value={contactInf.tel3} readOnly={!user.userInf.footer} onChange={handleChange}/> </h6>
                     {user.role==="admin"?
                     <h6><input type="tel" name="consultantNumber" value={contactInf.consultantNumber} onChange={handleChange} readOnly={!user.userInf.footer} placeholder='شماره مشاوره رایگان'/> </h6>:
                     <></>}
                     <h5>آدرس:</h5>
                     <h6><input type="text" name="address" value={contactInf.address} style={{width:"100%",marginBottom:10}} readOnly={!user.userInf.footer} onChange={handleChange}/></h6>
                  </div>
               </div>
               <div className="row" style={{justifyContent:"center"}}>
                  <div className="s1">
                     <div className="socials">
                        <a href={contactInf.instagram} ><i className="fa fa-instagram"></i></a>
                        <a href={contactInf.telegram}><i className="fa fa-telegram"></i></a>
                        <a href={contactInf.email}><i className="fa fa-envelope"></i></a>  
                     </div>
                     <div className="row" style={{justifyContent:"center",marginTop:10}}>
                     {user.userInf.footer?
                        <>
                        <h6 style={{textAlign:"center"}} ><input type="text" name="instagram" value={contactInf.instagram} placeholder='instagram'  onChange={handleChange}/> </h6>
                        <h6 style={{textAlign:"center"}}><input type="text" name="telegram" value={contactInf.telegram} placeholder='telegram' onChange={handleChange}/> </h6>
                        <h6 style={{textAlign:"center"}}><input type="text" name="email" value={contactInf.email} placeholder='email'  onChange={handleChange}/> </h6>
                        </>
                        :<></>}
                     </div>
                  </div>
               </div>
               {user.userInf.footer?
               <div  style={{textAlign:"center"}}>
               <button  className={isSaved?'btn btn-outline-success':'btn btn-outline-danger' } disabled={isSending} onClick={submitHandler}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>  
               </div>:
               <></>}
                {
                errors.length!==0 &&(
                    <p className="Errors" >{errors}</p>
                )}

               <div className="row copyright" style={{justifyContent:"center"}}>
                  <p>تمامی حقوق مادی و معنوی این سایت متعلق به کلینیک زیبایی ماه سین است.</p>
               </div>
            </>}
      </div>)

}

export default Footer;