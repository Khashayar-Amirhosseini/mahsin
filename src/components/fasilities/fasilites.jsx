import { useContext, useState } from "react";
import { FasilitiesContext } from "../../context/fasilitiesContext";
import './fasilities.css'
import headingPic from '../../assets/img/heading-cream.svg'
import { v4 as uuidv4 } from 'uuid';
import Skeleton from "react-loading-skeleton";
import { useEffect } from "react";
import Fasility from "./fasility";
import facilityImage from "../../assets/img/image.png"

const Fasilites = (props) => {
    const { fasility } = useContext(FasilitiesContext)
    const { isLoading } = useContext(FasilitiesContext);
    const user = props.user
    const [fasilityList, setFasilityList] = useState([{ id: 0, name: "", utility: "", description: "", user: user, date: new Date }])
    
    useEffect(() => {
        if (fasilityList.length === 1) {
            setFasilityList(fasility)
        }
    })
    const [show, setShow] = useState([fasilityList[0].utility, fasilityList[0].description, fasility[0].image])
    const Address = props.address


    const [isDisable, setIsDisable] = useState(false)
    const createFasility = (e) => {
        e.preventDefault()
        const newFasility = { id: 0, name: "", utility: "", image: facilityImage, description: "", user: user, date: new Date }
        fasilityList.push(newFasility)
        setFasilityList([...fasilityList])
    }
    const deleteFasility = (e, id) => {
        e.preventDefault(e)
        if (fasilityList.length < 3) {
            setIsDisable(true)
        }
        const newFasility = fasilityList.filter(d => d.id !== id)
        setFasilityList([...newFasility])
    }
    const onChangeFasility = (e, state, index) => {
        const newFasility = [...fasilityList];
        newFasility[index] = state;
        setFasilityList(newFasility);
    }


    return (
        <div className="row">
            <div className='main-title'>
                <h2>تجهیزات کلینیک زیبایی ماه سین</h2>
                {isLoading ?
                    <>
                        <div className="row">
                            <div className="col-md-4 facility-img ">
                                <Skeleton width={100} height={200} />
                            </div>
                            <div className="col-md-6">
                                <div className="tab-content" id="myTabContent" >
                                    <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                        <div className="facility-dis">
                                            <Skeleton width={100} />
                                            <Skeleton count={4} />
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </> :
                    <>
                        <img className='headerPic' src={headingPic} />
                        <div className="row">
                            <div className="col-md-4 facility-img ">
                                <img className='headerPic' src={show[2]} />
                            </div>
                            <div className="col-md-8">
                                <ul className="nav nav-tabs" id="myTab" role="tablist">
                                    {fasilityList.map(

                                        (f, index) => {

                                            if (f.state == "active") {
                                                return (
                                                    <li key={index} className="nav-item" role="presentation">
                                                        <button className="nav-link" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="false" onClick={() => setShow([fasilityList[index].utility, fasilityList[index].description, fasilityList[index].image])} >{f.name} </button>
                                                    </li>
                                                )
                                            }
                                        }
                                    )}
                                    
                                </ul>
                                <div className="tab-content" id="myTabContent" >
                                        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                            <div className="facility-dis ">
                                                <h5>
                                                    {show[0] == "" &&
                                                        fasility[0].utility
                                                    }
                                                    {
                                                        show[0]
                                                    }
                                                </h5>
                                            </div>
                                            <div className="facility-dis">
                                                {show[1] == "" &&
                                                    fasility[0].description
                                                }
                                                {show[1]}
                                            </div>
                                        </div>
                                    </div>
                            </div>



                        </div>
                        {user.userInf.facility?<div className="row fasilities">
                            {fasilityList.map((f, i) => {
                                return (
                                    <Fasility key={uuidv4()} itemKey={uuidv4()} user={user} fasility={f} address={Address} createFasility={createFasility} deleteFasility={deleteFasility} isDisable={isDisable} onchange={onChangeFasility} index={i} />
                                )
                            }
                            )}
                        </div>:
                        <></>}

                    </>
                }

            </div>

        </div>


    )





}

export default Fasilites;