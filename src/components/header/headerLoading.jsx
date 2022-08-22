import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
const HeaderLoading = () => {
    return (  
        <SkeletonTheme baseColor="#F3B40D" highlightColor="#444" width={50}>
            <Skeleton circle={true} width={20} height={20} className="socialSkeleton"/>
            <Skeleton circle={true} width={20} height={20} className="socialSkeleton"/>
            <Skeleton circle={true} width={20} height={20} className="socialSkeleton"/>
        </SkeletonTheme>
        
    );
}
 
export default HeaderLoading;