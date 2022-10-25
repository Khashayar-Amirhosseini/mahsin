import { getValue } from "@testing-library/user-event/dist/utils";
import axios from "axios";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import { ContentsContext } from "../../context/contensContexts";
import "./article.css"
import "./article.css"
import ArticleBody from "./articleBody";
import ReadMore from "./readMore";
import { v4 as uuidv4 } from 'uuid';
import ArticleFooter from "./articleFooter";
import ArticleTitle from "./articleTitle";
import articleImage from '../../assets/img/article.jpg'
import ArticlePicture from "./articlePicture";
import pictureProfile from '../../assets/img/image.png'
import Refrences from "./refrences";

const Article = (props) => {

    const { papers } = useContext(ContentsContext);
    const { isLoading } = useContext(ContentsContext);
    const [paperList, setPaperList] = useState([]);
   
    const user = props.user;
    const Address = props.address
    const id = useParams();
    const keywords = { id: 0, value: ""}
    const references = { id: 0, url: "", user: user }
    const newPaper = { id: 0, title: "مقاله جدید", paragraphs: "", writer: "", keywords: [keywords], user: user, date: new Date, references: [references], image: articleImage, paragraphPics: [{ id: 0, address: pictureProfile }] }
    const [currentPaper, setCurrentPaper] = useState(newPaper)
    const [isDisable, setIsDisable] = useState(false)
    const [photoList, setPhotoList] = useState([]);
    const [kerwordList,setKeywordList]=useState([]);
    const [refrenceList,setRefrenceList]=useState([]);
    const [like, setLike] = useState();
    const [Errors,setErrors]=useState([]);
    const[isSending,setIsSending]=useState(false)
    useEffect(() => {
        if (papers.length > 1 && paperList.length === 0) {
            setPaperList(papers)  
        }
    },[isLoading])
    const findPaper=async(id)=>{
        const response = await axios({
            method: 'get',
            url: `${Address}/action/guest/findOnePost.do?id=${id}`,
            withCredentials: false,
        })
        (response.data)?setCurrentPaper(response):setCurrentPaper(newPaper)  
    }
    useEffect(async() => {
       // const current = (papers[id.id] ? papers[id.id] : newPaper)
        if(id.id>0){
        if(papers.length>1){
            setCurrentPaper(papers.filter(p=>p.id==id.id)[0])
        }
        else{
            findPaper(id.id)}
        }

       
       // setCurrentPaper(current)
       
        if (currentPaper.paragraphPics !== undefined) {
            setPhotoList(currentPaper.paragraphPics)
        }
        if(currentPaper.keywords!==undefined){
            setKeywordList(currentPaper.keywords)
        }
        if(currentPaper.references!==undefined){
            setKeywordList(currentPaper.references)
        }
        
    }, [isLoading,id.id])
    
    useEffect(() => {
        if (currentPaper.paragraphPics !== undefined) {
                setPhotoList(currentPaper.paragraphPics)
        }
    }, [id.id,currentPaper])
    useEffect(() => {
        if (currentPaper.keywords !== undefined) {
            
                setKeywordList(currentPaper.keywords)
            
        }
    }, [id.id,currentPaper])
    useEffect(() => {
        if (currentPaper.references !== undefined) {
            
                setRefrenceList(currentPaper.references)
            
        }
    }, [id.id,currentPaper])
    useEffect(async () => {
        if(currentPaper.id&&!user.userInf.blogger){
        const response1 = await axios({
            method: 'get',
            url: `${Address}/action/guest/findLikesByPost.do?postId=${currentPaper.id}&actionName=like`,
            withCredentials: false,
        })
        setLike(response1.data)}
    }, [id.id])
    if (photoList.length === 0) {
        setPhotoList([{ id: 0, address: pictureProfile }])

    }
    if (kerwordList.length === 0) {
        setKeywordList([{ id: 0, value: "" }])

    }
    if (refrenceList.length === 0) {
        setRefrenceList([{ id: 0, value: "" }])

    }
    let nextId=0
    let previousId=0

    papers.map((p,i)=>{
            if(p.title===currentPaper.title){
                 nextId=i+1
                 previousId=i-1
            }                 
        })
   

    
    //const nextId = parseInt(id.id) + 1
    
    //const previousId = parseInt(id.id) - 1
    const onChangePaper = (e, state, index) => {
        setCurrentPaper(state);
    }
    const onChangePhoto = (e, state, index) => {
        const newPhoto = [...photoList];
        newPhoto[index] = state;
        setPhotoList(newPhoto);
        const newCurrentPaper={...currentPaper}
        newCurrentPaper.paragraphPics=newPhoto;
        setCurrentPaper(newCurrentPaper)
    }
    const createPhoto = (e) => {
        e.preventDefault()
        const newPhoto = { id: 0, address: pictureProfile }
        photoList.push(newPhoto);
        setPhotoList([...photoList]);
    }
    const deletePhoto = (e, id) => {
        e.preventDefault(e)
        if (photoList.length < 3) {
            setIsDisable(true)
        }
        const newPhotoList = photoList.filter(d => d.id !== id)
        setPhotoList([...newPhotoList])
        const newCurrentPaper={...currentPaper}
        newCurrentPaper.paragraphPics=newPhotoList;
        setCurrentPaper(newCurrentPaper)
    }
    const onChangeKeyword=(e,state,index)=>{
        const newKeywordList=[...kerwordList];
        newKeywordList[index]=state;
        setKeywordList(newKeywordList);
        const newCurrentPaper={...currentPaper}
        newCurrentPaper.keywords=newKeywordList;
        setCurrentPaper(newCurrentPaper)
    }

    const createKeyword=(e)=>{
        e.preventDefault()
        const newKeyword={ id: 0, value: ""}
        kerwordList.push(newKeyword)
        setKeywordList([...kerwordList])     
        const newCurrentPaper={...currentPaper}
        newCurrentPaper.keywords=kerwordList;
        setCurrentPaper(newCurrentPaper)
    }
    const deleteKeyword=(e,id)=>{
        e.preventDefault(e)
        if(kerwordList.length<2){
            setIsDisable(true)  
          }
        const newKeywordList= kerwordList.filter(d=>d.id!==id)
        setKeywordList([...newKeywordList])
        const newCurrentPaper={...currentPaper}
        newCurrentPaper.keywords=newKeywordList;
        setCurrentPaper(newCurrentPaper)
    }

    const onChangeRefrence=(e,state,index)=>{
        const newRefrenceList=[...refrenceList];
        newRefrenceList[index]=state;
        setRefrenceList(newRefrenceList);
        const newCurrentPaper={...currentPaper}
        newCurrentPaper.references=newRefrenceList;
        setCurrentPaper(newCurrentPaper)
    }

    const createRefrence=(e)=>{
        e.preventDefault()
        const newRefrence={ id: 0, value: ""}
        refrenceList.push(newRefrence)
        setRefrenceList([...refrenceList])
        const newCurrentPaper={...currentPaper}
        newCurrentPaper.references=newRefrence;
        setCurrentPaper(newCurrentPaper)     
    }
    const deleteRefrence=(e,id)=>{
        e.preventDefault(e)
        if(refrenceList.length<2){
            setIsDisable(true)  
          }
        const newRefrenceList= refrenceList.filter(d=>d.id!==id)
        setRefrenceList([...newRefrenceList])
        const newCurrentPaper={...currentPaper}
        newCurrentPaper.references=newRefrenceList;
        setCurrentPaper(newCurrentPaper)
    }
    return (
        isLoading ?
            <>
                <div className="row p-4 p-md-5 mb-4 text-white rounded mainTitle">
                    <div className="row">
                        <div className="col-md-6 px-0">
                            <SkeletonTheme key={uuidv4()} baseColor="#F3B40D" highlightColor="#444" width={50}>
                                <Skeleton key={uuidv4()} width="95%" className="display-4" />
                            </SkeletonTheme>
                            <br />
                            <SkeletonTheme key={uuidv4()} baseColor="#F3B40D" highlightColor="#444" width={50}>
                                <Skeleton key={uuidv4()} width="80%" count={3} />
                                <Skeleton key={uuidv4()} width="60%" />
                            </SkeletonTheme>
                            <br />
                        </div>
                        <div className="col-md-6 px-0 imageSection">
                            <SkeletonTheme key={uuidv4()} baseColor="#F3B40D" highlightColor="#444" width={50}>
                                <Skeleton key={uuidv4()} width="80%" height={200} />
                            </SkeletonTheme>
                            <br />
                        </div>
                    </div>
                    <div className="row paperInf ">
                        <div className="col-md-2">
                            <SkeletonTheme baseColor="#F3B40D" highlightColor="#444" width={50}>
                                <Skeleton key={uuidv4()} count={2} width="20%" height={20} className="socialSkeleton" />
                            </SkeletonTheme>
                        </div>
                    </div>
                </div>
                <div className="row mb-2 postCard">
                    {Array(2).fill({}).map(() => {
                        return (
                            <div key={uuidv4()} className="col-md-4 offset-md-1 ">
                                <div key={uuidv4()} className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                                    <div key={uuidv4()} className="col p-4 d-flex flex-column position-static">
                                        <h3 key={uuidv4()} className="mb-0"><Skeleton key={uuidv4()} width="95%" /></h3>
                                        <div key={uuidv4()} className="row">
                                            <h6 key={uuidv4()} className="card-text mb-auto col-6 ">
                                                <Skeleton key={uuidv4()} width="80%" count={3} />
                                                <Skeleton key={uuidv4()} width="60%" />
                                            </h6>
                                            <div key={uuidv4()} className="col-6 postCardImG">
                                                <Skeleton key={uuidv4()} width="60%" height="100%" />
                                            </div>
                                        </div>
                                    </div>
                                    <div key={uuidv4()} className="col-auto d-none ">
                                        <Skeleton key={uuidv4()} width="80%" height="100%" />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div key={uuidv4()} className="paper-body">
                    <h4 key={uuidv4()}><Skeleton key={uuidv4()} width="20%" /></h4>
                    <Skeleton key={uuidv4()} width="40%" height={100} className="paper-body-img" />
                    <p key={uuidv4()}><Skeleton count={4} key={uuidv4()} width="100%" />
                        <Skeleton key={uuidv4()} width="75%" /></p>

                </div>
                <div key={uuidv4()} className="row key-words">
                    <h5><Skeleton key={uuidv4()} width="10%" /></h5>
                    <div className="key-word-s">
                        <Skeleton key={uuidv4()} count={5} width="5%" inline={true} className="key-word-s-k" />
                    </div>
                </div>
            </> :
            <>
                <ArticleTitle paper={currentPaper} key={uuidv4()} itemKey={uuidv4()} user={user} address={Address} index={id.id} onchange={onChangePaper} like={like} />
                <div className="row mb-2 postCard">
                    {nextId < papers.length ?
                        <>
                            <div className="col-md-6">
                                <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                                    <div className="col p-4 d-flex flex-column position-static">
                                        <strong className="d-inline-block mb-2 text-success">پست بعدی</strong>
                                        <h3 className="mb-0">{papers[nextId].title}</h3>
                                        <div className="mb-1 text-muted">{new Date((papers[nextId].date)).toLocaleDateString('fa-IR')}</div>
                                        <div className="row">
                                            <h6 key={uuidv4()} className="card-text mb-auto col-6 ">
                                                <ReadMore >
                                                    {papers[nextId].abstract}
                                                </ReadMore>
                                            </h6>
                                            <div className="col-6 postCardImG">
                                                <img key={uuidv4()} src={papers[nextId].image} />
                                            </div>

                                        </div>
                                        <Link key={uuidv4()} to={`/mahsin/blog/${papers[nextId].id}`} >ادامه</Link>
                                    </div>
                                    <div className="col-auto d-none ">
                                        <img key={uuidv4()} src={papers[nextId].image} />
                                    </div>
                                </div>
                            </div>
                        </> :
                        <>
                        </>}
                    {previousId >= 0 ?
                        <>
                            <div className="col-md-6 ">
                                <div className="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                                    <div className="col p-4 d-flex flex-column position-static">
                                        <strong key={uuidv4()} className="d-inline-block mb-2 text-success">پست قبلی</strong>
                                        <h3 key={uuidv4()} className="mb-0">{papers[previousId].title}</h3>
                                        <div className="mb-1 text-muted">{new Date((papers[previousId].date)).toLocaleDateString('fa-IR')}</div>
                                        <div className="row">
                                            <h6 key={uuidv4()} className="card-text mb-auto col-6 ">
                                                <ReadMore>
                                                    {papers[previousId].abstract}
                                                </ReadMore>
                                            </h6>
                                            <div className="col-6 postCardImG">
                                                <img key={uuidv4()} src={papers[previousId].image} />
                                            </div>

                                        </div>
                                        <Link key={uuidv4()} to={`/mahsin/blog/${papers[previousId].id}`}>ادامه</Link>
                                    </div>

                                </div>
                            </div>
                        </> :
                        <></>}
                </div>
                <ArticleBody key={uuidv4()} itemKey={uuidv4()} user={user} address={Address} index={id.id} onchange={onChangePaper} paper={currentPaper} />
                <ul className='image-bar row'>
                    {photoList.map((p, i) => {
                        return (
                            <ArticlePicture key={uuidv4()} itemKey={uuidv4()} user={user} address={Address} index={id.id} onchange={onChangePhoto} picture={p} paper={currentPaper} createPhoto={createPhoto} picIndex={i} deletePhoto={deletePhoto} />
                        )
                    })}
                </ul>
                <h5>کلمات کلیدی:</h5>
                <ul>
                    <div className="row key-words">
                    {kerwordList.map((k, i) => {
                        return (
                            <ArticleFooter key={uuidv4()} itemKey={uuidv4()} user={user} address={Address} index={i} onchange={onChangePaper} paper={currentPaper} keyword={k} createKeyword={createKeyword}  deleteKeyword={ deleteKeyword} onchange={onChangeKeyword}></ArticleFooter>
                        )
                    })}
                    </div>
                </ul>
                <h5>فهرست منابع:</h5>
                <ul>
                    <div className="row refrences"> 
                    {refrenceList.map((k, i) => {
                        return (
                            <Refrences key={uuidv4()} itemKey={uuidv4()} user={user} address={Address} index={i} onchange={onChangePaper} paper={currentPaper} refrence={k} createRefrence={createRefrence}  deleteRefrence={ deleteRefrence} onchange={onChangeRefrence}></Refrences>
                        )
                    })}
                    </div>
                </ul>
            </>

    );
}

export default Article;