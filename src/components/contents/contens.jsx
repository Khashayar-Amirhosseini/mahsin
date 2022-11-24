import { useContext } from 'react';
import { ContentsContext } from '../../context/contensContexts';
import './contents.css';
import { v4 as uuidv4 } from 'uuid';
import headingPic from '../../assets/img/heading-cream.svg'
import { date } from 'yup';
import Skeleton from 'react-loading-skeleton';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReadMore from '../article/readMore';
import ContentsCard from './contentsCard';
import articleImage from '../../assets/img/article.jpg'

const Contents = (props) => {
    const user=props.user
    const { papers } = useContext(ContentsContext);
    const { isLoading } = useContext(ContentsContext);
    const [isDisable, setIsDisable] = useState(false);
    const[paperList,setPaperList]=useState([])
    const[showModal,setShowModal]=useState(false);
    const Address=props.address;
    
    useEffect(() => {
        if (paperList.length <= 1) {
            setPaperList(papers)
        }
       
    })
    const deletePaper = (e, id) => {
        e.preventDefault(e)
        if (paperList.length < 3) {
            setIsDisable(true)
        }
        const newPaperList = paperList.filter(d => d.id !== id)
        setPaperList([...newPaperList])
    }
    const createPaper = (e) => {
        e.preventDefault()
        const keywords={id:0,subtitle:"",user:user}
        const references={id:0,url:"",user:user}
        const paragraphsPic={id:0,url:""}
        const newPaper = { id: 0, title:"مقاله جدید",paragraphs:"",writer:"",paragraphsPic:paragraphsPic,keyword:[keywords], user: user, date: new Date,references:[references] ,image:articleImage,abstract:""}
        paperList.push(newPaper)
        setPaperList([...paperList])
    }

    return (
        
        <>
           {showModal&&( <div className="modal" style={{display:"block"}} id="paperModal">
                <div className="modal-dialog paperArchivse modal-dialog-scrollable">
                    <div className="modal-content ">
                        <div className="modal-header">
                            <h5 className="modal-title">آشیو مقالات</h5>
                            <button type="button" className="btn-close" onClick={()=>{setShowModal(false)}}></button>
                        </div>
                        <div className="modal-body">
                            <div className="row papers">
                                {isLoading ? <>
                                </> :
                                    <>
                                        {paperList.map((p,i) => {
                                            {
                                                if (p.state == "active") {
                                                    return (
                                                        <div key={uuidv4()} className="col-md-3">
                                                            <div key={uuidv4()} className="card" >
                                                                <img key={uuidv4()} src={p.image} className="card-img-top" alt="cover" />
                                                                <Link to={`/blog/${i}`} onClick={()=>{setShowModal(false)}}><h5>{p.title}</h5></Link>
                                                                <div key={uuidv4()} className="card-body">
                                                                    <h6 key={uuidv4()} className="card-text">
                                                                        <ReadMore>
                                                                            {p.abstract}
                                                                        </ReadMore></h6>
                                                                    <div className='row'>
                                                                        <div key={uuidv4()} className="likes col-6">
                                                                            <button key={uuidv4()} type="button" className="btn btn-Light position-relative">
                                                                                <i key={uuidv4()} className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                                                                                    {p.likes}
                                                                                    <span className="visually-hidden">unread messages</span>
                                                                                </span>
                                                                            </button>
                                                                        </div>
                                                                        <div className='col-6'>
                                                                
                                                                            <p>{new Date((p.date)).toLocaleDateString('fa-IR')}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            }
                                        })}
                                    </>}

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={()=>{setShowModal(false)}}>بستن</button>
                        </div>
                    </div>
                </div>
            </div>)}
            <div className='main-title'>
                <h2>مقالات</h2>
                <img className='headerPic' src={headingPic} />
            </div>
            <div className="row papers">
                {isLoading ?
                    <>
                        {Array(4).fill({}).map(() => {
                            return (
                                <div key={uuidv4()} className="col-md-3"  >
                                    <div key={uuidv4()} className="card" >
                                        <Skeleton height={100} />
                                        <h5><Skeleton /></h5>
                                        <div key={uuidv4()} className="card-body">
                                            <p key={uuidv4()} className="card-text">
                                                <Skeleton count={2} />
                                                <Skeleton width={50} />
                                            </p>
                                            <div className='row'>
                                                <div key={uuidv4()} className="likes col-md-2 col-2">
                                                    <Skeleton circle={true} width={50} height={50} />
                                                </div>
                                                <div className='col-md-4 col-4  offset-md-6 offset-8'>
                                                    <h6>تاریخ:</h6>
                                                    <Skeleton />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )
                        })}
                    </> :
                    <>
                        {paperList.map((p, index) => {
                            {
                                if (index > paperList.length - 5|| p.id===0) {        
                                return (
                                            <ContentsCard  key={uuidv4()} itemKey={uuidv4()} paper={p} index={(p.id)} user={user}  createPaper={createPaper} deletePaper={deletePaper} isDisable={isDisable} address={Address} />
                                        )
                                    
                                }
                            }
                        })}
                    </>}


            </div>
            <div className='readmore'>
                <button type="button" className="btn btn-outline-success" onClick={()=>{setShowModal(true);console.log(showModal)}}>آشیو مقالات</button>
            </div>
        </>
    );
}

export default Contents;