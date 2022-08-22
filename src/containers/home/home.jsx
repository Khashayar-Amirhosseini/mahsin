
import { useEffect } from "react";
import About from "../../components/about/about";
import Contents from "../../components/contents/contens";
import Fasilites from "../../components/fasilities/fasilites";
import Footer from "../../components/footer/footer";
import Services from "../../components/sevices/services";
import AboutContextProvider, { AboutContext } from "../../context/aboutContext";
import ContentsContextProvider, { ContentsContext } from "../../context/contensContexts";
import FasilitiesProvider from "../../context/fasilitiesContext";
import ServiceContextProvider from "../../context/service-context";


const Home = (props) => {
    
    return (
        <>
            <div id='about'>
                <AboutContextProvider address={props.address} user={props.user}>
                    <About address={props.address} user={props.user}/>
                 </AboutContextProvider>
            </div>
            <div id="services">
                <ServiceContextProvider address={props.address} user={props.user}>
                    <ContentsContextProvider address={props.address} user={props.user} >
                        <Services address={props.address} user={props.user}/>   
                    </ContentsContextProvider>
                </ServiceContextProvider>
            </div>
            <div id="fasilites">
                <FasilitiesProvider address={props.address} user={props.user}>
                    <Fasilites  address={props.address} user={props.user}/>
                </FasilitiesProvider>
            </div>
            <div id='contents'>
                <ContentsContextProvider address={props.address} user={props.user}>
                    <Contents address={props.address} user={props.user}/>
                </ContentsContextProvider>
            </div>

        </>

    );
}

export default Home;