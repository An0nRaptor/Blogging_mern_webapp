import {Toaster,toast} from "react-hot-toast";
import AnimationWrapper from "../common/PageAnimation";
import { useContext } from "react";
import { EditorContext } from "../pages/EditorPage";
import Tag from "./TagsComponent";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";



const PublishForm = () => {

  let characterLimit = 200;
  let tagLimit = 10;

  let {blog_id} = useParams()

  const {blog,blog:{banner,title,tags,desc,content},setEditorState,setBlog}= useContext(EditorContext)

  const {userAuth:{access_token}} = useContext(UserContext)
  const navigate = useNavigate()
  
  const handleCloseEvent = () => {

    setEditorState('editor')

  }

  const handleBlogTitleChange=(e)=>{

    let input = e.target
    setBlog({...blog,title: input.value});
  }

  const handleBlogDescChange=(e)=>{
    
    let input = e.target;
    setBlog({...blog,desc:input.value});
  }

  const handleTitleKeyDown=(e)=>{

    if(e.keyCode === 13){

      e.preventDefault();

    }
  }


  const handleKeyDownFunc=(e)=>{

    if(e.keyCode == 13 || e.keyCode == 188){

      e.preventDefault();

      let tag = e.target.value;

      if(tags.length < tagLimit){

        if(!tags.includes(tag) && tag.length){

            setBlog({...blog,tags:[...tags,tag]})
        }
        
      }else{
        toast.error(`You can add max ${tagLimit} Tags`)
      }

      e.target.value=""
    }


  }

  const publishBlogFunc =(e)=>{

    if(e.target.className.includes("disable")){
      return;
    }

    if(!title.length){

      return toast.error("Write blog title before publishing")

    }

    if(!desc.length || desc.length > characterLimit){

      return toast.error(`Write a description about your blog within ${characterLimit} characters to publish`)}

    if(!tags.length){

      return toast.error("Enter atleast 1 tag to help us rank your blog")
    }

    let loadingToast = toast.loading("Publishing...")

    // Prevent user from submitting for twice
    e.target.classList.add("disable")


    let blogObject = {
      
      title,banner,desc,content,tags,draft:false
    }

    axios.post(import.meta.env.VITE_HOST + "/create-blog", {...blogObject,id:blog_id}, {

      headers:{
        'Authorization': `Bearer ${access_token}`
      }

    }).then(()=>{

      e.target.classList.remove('disable')
      toast.dismiss(loadingToast)
      toast.success("Published :)")

      setTimeout(()=>{

        navigate("/dashboard/blogs")

      },500)

    }).catch(({response})=>{

        e.target.classList.remove('disable')
        toast.dismiss(loadingToast)

        return toast.error(response.data.error)
    })

  }

  return (
    <AnimationWrapper>

      <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster/>
        <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]" onClick={handleCloseEvent}>
          <i className="fi fi-br-cross"/>
        </button>

        <div className="max-w-[550px] center">
          <p className="text-dark-grey mb-1">Preview</p>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={banner}/>
          </div>
          <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>
          <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{desc}</p>
        </div>
        <div className="border-grey lg:border-1 lg:pl-8">
            <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
            <input className="input-box pl-4" type="text" placeholder="Blog Title" defaultValue={title} onChange={handleBlogTitleChange}/>

            <p className="text-dark-grey mb-2 mt-9">Short Description about your blog.</p>
            <textarea className="h-40 resize-none leading-7 input-box pl-4 " maxLength={characterLimit} defaultValue={desc} onChange={handleBlogDescChange} onKeyDown={handleTitleKeyDown}>

            </textarea>
            <p className="mt-1 text-dark-grey text-sm text-right">{characterLimit - desc.length} characters left</p>
            <p className="text-dark-grey mb-2 mt-9">Topics - ( Helps in searching and ranking your blog post )</p>
            <div className="relative input-box pl-2 py-2 pb-4">
              <input type="text" className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white" placeholder="Topics" onKeyDown={handleKeyDownFunc}/>
              {tags.map((tag,i)=>{
                return <Tag tag={tag} tagIndex={i} key={i}/>
              })} 
            </div>
            <p className="mt-1 mb-4 text-dark-grey text-right">
                {tagLimit - tags.length} tags left
              </p>
              <button className="btn-dark px-8" onClick={publishBlogFunc}>
                Publish
              </button>
        </div>
      </section>

    </AnimationWrapper>
  )
}

export default PublishForm;