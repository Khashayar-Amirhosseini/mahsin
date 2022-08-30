import { useContext } from "react";
import { ServiceContext } from "../../context/service-context";
import headingPic from '../../assets/img/heading-cream.svg'
import bullet from '../../assets/img/s-bullet.svg'
import './services.css'
import { v4 as uuidv4 } from 'uuid';
import Skeleton from "react-loading-skeleton";
import { useState } from "react";
import { useEffect } from "react";
import ServiceCard from "./serviceCard";
import serviceImage from "../../assets/img/image.png"
import { ContentsContext } from "../../context/contensContexts";


const Services = (props) => {
    const Address = props.address
    const { cluster } = useContext(ServiceContext)
    const { isLoading } = useContext(ServiceContext)
    const{papers}=useContext(ContentsContext);
    const [paperList,setPaperList]=useState([])
    const[clusterList,setClusterList]=useState([])
    const user = props.user
    const[isDisable,setIsDisable]=useState(false)
    
    useEffect(()=>{
            setClusterList(cluster)
     },[cluster.length])
     
    useEffect(()=>{
             setPaperList(papers) 
      },[papers.length])
    const createCluster=(e)=>{
        e.preventDefault()
        const newCluster={id:0,title:"",description:"",image:serviceImage,services:[{id:0,title:"",description:"",user:user,date:new Date}],user,date:new Date}
        clusterList.push(newCluster)
        setClusterList([...clusterList])  
    }
    const deleteCluster=(e,id)=>{
        e.preventDefault(e)
        if(clusterList.length<3){
            setIsDisable(true)  
          }
        const newClusterList= clusterList.filter(d=>d.id!==id)
        setClusterList([...newClusterList])
    }
    const onChangeCluster=(e,state,index)=>{
        const newCluster=[...clusterList];
        newCluster[index]=state;
        setClusterList(newCluster);
    }
    return (
        <div className="row">
            <div className='main-title'>
                <h2>خدمات کلینیک زیبایی ماه سین</h2>
                <img className='headerPic' src={headingPic} />
            </div>
            

            <ul className="col-md-12 serviceList">
                {(isLoading)?
                <>
                    {Array(3).fill({}).map(()=>{
                        return <li className="col-4 services" key={uuidv4()}>
                            <Skeleton height={200} />
                            <Skeleton height={40} />
                        </li>
                    }
                    )}
                </>:
                <>
                    {clusterList.map((c, i) => {
                        return(
                        <ServiceCard key={uuidv4()} itemKey={uuidv4()} user={user}  cluster={c} address={Address} createCluster={createCluster} deleteCluster={deleteCluster} bullet={bullet} isDisable={isDisable} address={Address} onchange={onChangeCluster} index={i} papers={paperList}/>
                        )
                    })
                }
                </>}
            </ul>
        </div>


    );
}

export default Services;