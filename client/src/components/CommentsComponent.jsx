import { useContext } from "react";
import { BlogContext } from "../pages/BlogPage";
import CommentField from "../components/CommentField";
import axios from "axios";
import NoDataMessage from "./NoDataComponent";
import AnimationWrapper from "../common/PageAnimation";
import CommentCard from "../components/CommentCard"



export const fetchComments = async ({skip = 0, blog_id, setParentCommentCountFunc, comment_array = null})=>{

   let res;

  await axios.post(import.meta.env.VITE_HOST + '/get-blog-comments',{blog_id,skip})
 
  .then(({data})=>{
    

    data.map(comment=>{

      comment.childrenLevel = 0;

    })

    setParentCommentCountFunc(preVal => preVal + data.length);
    
    if(comment_array==null){

      res = {results:data}

    }else{

      res = {results:[...comment_array,...data]}
    }
   
  })
    return res;
    }

const CommentsContainer = () => {

  let {blog,blog:{_id,title,comments:{results:commentsArr},activity:{total_parent_comments}}, commentsWrapper, setCommentsWrapper,totalParentCommentsLoaded,setTotalParentCommentsLoaded,setBlog } = useContext(BlogContext);


  const loadMoreCommentsFunc=async()=>{

    let newCommentsArray = await fetchComments({skip:totalParentCommentsLoaded, blog_id:_id,setParentCommentCountFunc:setTotalParentCommentsLoaded,comment_array:commentsArr})

    setBlog({...blog,comments:newCommentsArray})

  }

  return (

    <div
      className={
        "max-sm:w-full fixed " +
        (commentsWrapper
          ? "top-0 sm:right-[0]"
          : "top-[100%] sm:right-[-100%]") +
        " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"}>

      <div className="relative">
        <h1 className="text-xl font-medium">
          Comments
          <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">{title}</p>
          <button onClick={()=>setCommentsWrapper(preVal => !preVal)} className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey ">
          <i className="fi fi-br-cross text-2xl mt-1"></i>
          </button>
        </h1>
      </div>

          <hr className="border-grey my-8 w-[120%] -ml-10"/>

          <CommentField action="comment"/>

          {
              commentsArr && commentsArr.length ? 
              commentsArr.map((comment,i)=>{

                return (<AnimationWrapper>
                  <CommentCard index={i} leftVal={comment.childrenLevel * 4}
                  commentData={comment}/>
                </AnimationWrapper>)

              }) : <NoDataMessage message="No Comments"/>
          }

          {
            total_parent_comments > totalParentCommentsLoaded ? <button onClick={loadMoreCommentsFunc} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2">
              Load More
            </button> : ""
          }

    </div>
  );
};

export default CommentsContainer;
