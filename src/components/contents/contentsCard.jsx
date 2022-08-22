import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import ReadMore from '../article/readMore';
import { useState } from "react";
import { HashLink } from 'react-router-hash-link';
import { NavLink } from 'react-router-dom';
import axios from "axios";
const ContentsCard = (props) => {
    const paper = props.paper
    const index = props.index
    const user = props.user
    const createPaper = props.createPaper;
    const deletePaper = props.deletePaper;
    const isDisable = props.isDisable
    const Address = props.address;

    const [errors, setErrors] = useState([])
    const [isSending, setIsSending] = useState(false)
    const addHandeler = (e) => {
        e.preventDefault()
        createPaper(e)
    }
    const deleteHandler = async (e) => {
        
        e.preventDefault();
        if(paper.paragraphPics.length>1){
            setErrors([" باید تمام عکسای مقاله رو پاک کنی"]) 
             
        }
        else if(paper.keywords.length>1){
            setErrors([" باید تمام کلمات کلیدی مقاله رو پاک کنی"])
        }
        else if(paper.references.length>1){
            setErrors([" باید تمام رفرنسای مقاله رو پاک کنی"])
        }

        else{
        try {
            setIsSending(true)
            const response = await axios({
                method: "get",
                url: `${Address}/action/admin/deletePost.do?postId=${paper.id}`,
                headers: { 'Access-Token': `${user.token}` }
            })
            
            deletePaper(e, paper.id);
            setIsSending(false)
        }
        catch (e) {
            if (e.response) {
                if (e.response.status === 700) {
                    setErrors(["دسترسی مورد نیاز فراهم نشده است."])
                }
            }
            else {
                setErrors(["مشکل در سرور پیش اومده"])
            }
            setIsSending(false)
        }}
    }
    return (
        user.userInf.blogger ?
            <>
                <div key={uuidv4()} className="col-md-3">
                    <div key={uuidv4()} className="card" >
                        <img key={uuidv4()} src={paper.image} className="card-img-top" alt="cover" />
                        <Link to={`/blog/${index}`}><h5>{paper.title}</h5></Link>
                        <div key={uuidv4()} className="card-body">
                            <h6 key={uuidv4()} className="card-text">
                                <ReadMore>
                                    {paper.abstract}
                                </ReadMore>
                            </h6>
                            <div className='row'>
                                <div key={uuidv4()} className="likes col-6">
                                    <button key={uuidv4()} type="button" className="btn btn-Light position-relative">
                                        <i key={uuidv4()} className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                                            {paper.likes}
                                            <span className="visually-hidden">unread messages</span>
                                        </span>
                                    </button>

                                </div>
                                <div className='col-6'>
                                    <p>{new Date((paper.date)).toLocaleDateString('fa-IR')}</p>
                                </div>
                            </div>
                            <div className="form-button">
                                <div>
                                    <button type="button" className="btn btn-outline-primary" onClick={(e) => addHandeler(e)} disabled={isSending}><i className="fa fa-plus" aria-hidden="true" ></i></button>
                                    {user.userInf.admin && (<button className="btn btn-outline-danger" disabled={isSending || isDisable} onClick={(e) => deleteHandler(e)}><i className="fa fa-times" aria-hidden="true"></i></button>)}
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
                        </div>
                    </div>
                </div>
            </> :
            (paper.state === "active") ?
                <div key={uuidv4()} className="col-md-3">
                    <div key={uuidv4()} className="card" >
                        <img key={uuidv4()} src={paper.image} className="card-img-top" alt="cover" />
                        <NavLink to={`/blog/${index}`}><h5>{paper.title}</h5></NavLink>
                        <div key={uuidv4()} className="card-body">
                            <h6 key={uuidv4()} className="card-text">
                                <ReadMore>
                                    {paper.abstract}
                                </ReadMore>
                            </h6>
                            <div className='row'>
                                <div key={uuidv4()} className="likes col-6">
                                    <button key={uuidv4()} type="button" className="btn btn-Light position-relative">
                                        <i key={uuidv4()} className="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                                            {paper.likes}
                                            <span className="visually-hidden">unread messages</span>
                                        </span>
                                    </button>

                                </div>
                                <div className='col-6'>
                                    <p>{new Date((paper.date)).toLocaleDateString('fa-IR')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <></>

    );
}

export default ContentsCard;