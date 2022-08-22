import { useContext } from 'react';
import headingPic from '../../assets/img/heading-cream.svg'
import { AboutContext } from '../../context/aboutContext';
import './about.css'
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import * as yup from 'yup';
import History from './History';
import Doctrors from './doctor';
import { useRef } from 'react';
import imageProfile from '../../assets/img/profile.jpg'
import goalProfile from '../../assets/img/goal.jpg'
import pictureProfile from '../../assets/img/image.png'
import Goal from './goal';
import Policy from './policy';
import Acheivement from './acheivement';
import Picture from './picture';
const About = (props) => {
    const Address = props.address
    const { history } = useContext(AboutContext)
    const {doctor}=useContext(AboutContext)
    const { isLoading } = useContext(AboutContext)
    const { acheivment } = useContext(AboutContext)
    const { goals } = useContext(AboutContext)
    const { policies } = useContext(AboutContext)
    const { photo } = useContext(AboutContext)
    const user = props.user
    const[doctorList,setDoctorList]=useState([])
    const[goalList,setGoalList]=useState([])
    const[policyList,setPolicyList]=useState([])
    const[acheivmentList,setAchivementList]=useState([])
    const[photoList,setPhotoList]=useState([])
    const[isDisable,setIsDisable]=useState(false)
    
    useEffect(()=>{
            setDoctorList(doctor)
    },[doctor.length])
    useEffect(()=>{
        
            setGoalList(goals)
        
     },[goals.length])
     useEffect(()=>{
            setPolicyList(policies)
     },[policies.length])
     useEffect(()=>{
            setAchivementList(acheivment)
     },[acheivment.length])
     useEffect(()=>{
            setPhotoList(photo)
     },[photo.length])
     

    
    
    const createDoctor=(e)=>{
        e.preventDefault()
        const newDoctor={id:0,name:"",family:"",medicalId:0,about:"",image:imageProfile,state:"inactive",user:user,date:new Date,isSaved:false}
        doctorList.push(newDoctor)   
        setDoctorList([...doctorList])     
    }
    const createGoal=(e)=>{
        e.preventDefault()
        const newGoal={id:0,description:"",image:goalProfile,state:"inactive",user:user,date:new Date}
        goalList.push(newGoal);
        setGoalList([...goalList])
    }
    const createPolicy=(e)=>{
        e.preventDefault()
        const newPolicy={id:0,description:"",state:"inactive",user:user,date:new Date}
        policyList.push(newPolicy);
        setPolicyList([...policyList]);
    }
    const createAchievment=(e)=>{
        e.preventDefault()
        const newAcheivemet={id:0,description:"",state:"inactive",user:user,date:new Date}
        acheivmentList.push(newAcheivemet);
        setAchivementList([...acheivmentList]);
    }
    const createPhoto=(e)=>{
        e.preventDefault()
        const newPhoto={id:0,link:pictureProfile,user:user,date:new Date}
        photoList.push(newPhoto);
        setPhotoList([...photoList]);
    }
    const deleteDoctor=(e,id)=>{
        e.preventDefault(e)
        if(doctorList.length<3){
          setIsDisable(true)  
        }
        const newDoctorList= doctorList.filter(d=>d.id!==id)
        setDoctorList([...newDoctorList])   
    }
    const deleteGoal=(e,id)=>{
        e.preventDefault(e)
        if(goalList.length<2){
            setIsDisable(true)  
          }
        const newGoalList= goalList.filter(d=>d.id!==id)
        setGoalList([...newGoalList])
    }
    const deletePolicy=(e,id)=>{
        e.preventDefault(e)
        if(policyList.length<3){
            setIsDisable(true)  
          }
        const newPolicyList= policyList.filter(d=>d.id!==id)
        setPolicyList([...newPolicyList])

    }
    const deleteAcheivement=(e,id)=>{
        e.preventDefault(e)
        if(acheivmentList.length<3){
            setIsDisable(true)  
          }
        const newAcheivemet= acheivmentList.filter(d=>d.id!==id)
        setAchivementList([...newAcheivemet])
    }
    const deletePhoto=(e,id)=>{
        e.preventDefault(e)
        if(photoList.length<3){
            setIsDisable(true)  
        }
        const newPhotoList= photoList.filter(d=>d.id!==id)
        setPhotoList([...newPhotoList])
    }
    const onChangeDoctor=(e,state,index)=>{
        const newDoctorList=[...doctorList];
        newDoctorList[index]=state;
        setDoctorList(newDoctorList);
    }
    const onChangeGoal=(e,state,index)=>{
        const newGoalList=[...goalList];
        newGoalList[index]=state;
        setGoalList(newGoalList);
    }
    const onChangePolicy=(e,state,index)=>{
        const newPolicyList=[...policyList];
        newPolicyList[index]=state;
        setPolicyList(newPolicyList);
    }
    const onChangeAchievement=(e,state,index)=>{
        const newAcheivemet=[...acheivmentList];
        newAcheivemet[index]=state;
        setAchivementList(newAcheivemet);
    }
    const onChangePhoto=(e,state,index)=>{
        const newPhoto=[...photoList];
        newPhoto[index]=state;
        setPhotoList(newPhoto);
    }


   
    return (
        <>
            <div className='main-title'>
                <h2>کلینیک  زیبایی ماه سین</h2>
                <img className='headerPic' src={headingPic} />
            </div>
            <div>
                <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="history">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                تاریخچه
                            </button>
                        </h2>
                        {<div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="history" data-bs-parent="#accordionExample">
                            {isLoading ?
                                <>
                                    <div className="accordion-body">
                                        <Skeleton count={2} height={20} className='m-1 ' />
                                        <Skeleton height={20} className='m-1 w-50' />
                                    </div>
                                </> :
                                <History user={user} address={Address} history={history}></History>}
                        </div>}
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="personel">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                کاردر پزشکی
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="personel" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div className='row doctors'>
                                    {isLoading ?
                                        <>
                                            {Array(2).fill({}).map(
                                                () => {
                                                    return (
                                                        <div key={uuidv4()} className='col-md-6'>
                                                            <div key={uuidv4()} className='row'>
                                                                <div key={uuidv4()} className='col-md-4 text-center'>
                                                                    <Skeleton height={100} />
                                                                </div>
                                                                <div key={uuidv4()} className='col-md-8'>
                                                                    <h3 key={uuidv4()}><Skeleton height={20} className='m-1 w-50' /></h3>
                                                                    <p key={uuidv4()}><Skeleton height={20} className='m-1 w-50' /></p>
                                                                    <p key={uuidv4()}><Skeleton height={20} className='m-1 w-50' /></p>
                                                                    <div key={uuidv4()} className='like'>
                                                                        <div key={uuidv4()} className="row">
                                                                            <div key={uuidv4()} className="col-md-2 col-6">
                                                                                <Skeleton circle={true} width={30} height={30} className='m-1' />
                                                                            </div>
                                                                            <div key={uuidv4()} className="col-md-2 col-6">
                                                                                <Skeleton circle={true} width={30} height={30} className='m-1' />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>)
                                                }
                                            )}
                                        </> :
                                        <>

                                             {doctorList.map((d,i) => {
                                                    return (
                                                        <div key={uuidv4()} className='col-md-6'>
                                                        <Doctrors key={uuidv4()} itemKey={uuidv4()} user={user}  doctor={d} address={Address} createDoctor={createDoctor} deleteDoctor={deleteDoctor} isDisable={isDisable} onchange={onChangeDoctor} index={i}/>
                                                        </div>
                                                        
                                                    )
                                                })} 
                                        </>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="goals">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsefour" aria-expanded="false" aria-controls="collapseThree">
                                اهداف
                            </button>
                        </h2>
                        <div id="collapsefour" className="accordion-collapse collapse" aria-labelledby="goals" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div className="row">
                                    {isLoading ?
                                        <>
                                            {Array(4).fill({}).map(() => {
                                                return <div key={uuidv4()} className="col-md-3 p-2">
                                                    <div key={uuidv4()} className="card" >
                                                        <Skeleton height={100} className='w-80' />
                                                        <div key={uuidv4()} className="card-body">
                                                            <Skeleton className='w-50' />
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            )}
                                        </> :
                                        <>
                                            {goalList.map((g,i) => {
                                                return(
                                                    <Goal key={uuidv4()} itemKey={uuidv4()} goal={g} user={user} address={Address} createGoal={createGoal} deleteGoal={deleteGoal} isDisable={isDisable} onchange={onChangeGoal} index={i}/>
                                                )
                                            })}
                                        </>}


                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="policies">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsefive" aria-expanded="false" aria-controls="collapseThree">
                                خطی مشی
                            </button>
                        </h2>
                        <div id="collapsefive" className="accordion-collapse collapse" aria-labelledby="policies" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                {isLoading ?
                                    <>
                                        <Skeleton count={4} className='w-50' />
                                    </> :
                                    <ul>
                                        {policyList.map((p,i) => {
                                            return(
                                                <Policy key={uuidv4()}  itemKey={uuidv4()} policy={p} user={user} address={Address} createPolicy={createPolicy} deletePolicy={deletePolicy} isDisable={isDisable} onchange={onChangePolicy} index={i}/>
                                            )  
                                        })}
                                    </ul>}
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="achievments">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsesix" aria-expanded="false" aria-controls="collapseThree">
                                افتخارات
                            </button>
                        </h2>
                        <div id="collapsesix" className="accordion-collapse collapse" aria-labelledby="achievments" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                {isLoading ?
                                    <>
                                        <Skeleton count={4} className='w-50' />
                                    </> :
                                    <ul>
                                        {acheivmentList.map((a,i) => {
                                            // if (a.state == "active") {
                                            //     return <li key={uuidv4()}>{a.description}<i className="fa fa-hand-o-left" aria-hidden="true"></i></li>
                                            // }
                                            return(<Acheivement key={uuidv4()}  itemKey={uuidv4()} acheivment={a} user={user} address={Address} createAchievment={createAchievment} deleteAcheivement={deleteAcheivement} isDisable={isDisable} onchange={onChangeAchievement} index={i}/>)
                                        })}
                                    </ul>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="history">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                گالری تصاویر
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="history" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <div className="row photos">
                                    <div className="col-md-6 col-12">
                                        {isLoading ?
                                            <>
                                                <Skeleton height={200} />
                                            </> :
                                            <>
                                            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                                                <div className="carousel-indicators">
                                                    {photoList.map((p, index) => {
                                                        if (index == 0) {
                                                            return <button key={uuidv4()} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                                        }
                                                        else {
                                                            return <button key={uuidv4()} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index} aria-label={"Slide " + index}></button>
                                                        }
                                                    })}
                                                </div>
                                                <div className="carousel-inner">
                                                    {photoList.map((p, index) => {
                                                        if (index === 0) {
                                                            return <div key={uuidv4()} className="carousel-item  active">
                                                                <img src={p.link} className="d-block w-100" alt="..." />
                                                            </div>

                                                        }
                                                        else {
                                                            return <div key={uuidv4()} className="carousel-item">
                                                                <img src={p.link} className="d-block w-100" alt="..." />
                                                            </div>
                                                        }
                                                    })}

                                                </div>
                                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                                    <span className="visually-hidden">Previous</span>
                                                </button>
                                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                                    <span className="visually-hidden">Next</span>
                                                </button>
                                            </div>  
                                            
                                            </>
                                            
                                        }

                                    </div>
                                    <ul className='image-bar row'>
                                            {photoList.map((p,i)=>{
                                                return( 
                                                    <Picture key={uuidv4()}  itemKey={uuidv4()} picture={p} user={user} address={Address} createPhoto={createPhoto} deletePhoto={deletePhoto} isDisable={isDisable} onchange={onChangePhoto} index={i}/>
                                                )
                                            })}
                                            </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

}

export default About;