import { useEffect } from "react";
import Article from "../../components/article/article";
import ContentsContextProvider from "../../context/contensContexts";
const Blog = (props) => {
    useEffect(()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    },[])
    return ( 
        <div id='blog'>
            <ContentsContextProvider address={props.address} user={props.user}>
            <Article address={props.address} user={props.user} />
            </ContentsContextProvider>       
        </div>
     );
}
 
export default Blog;