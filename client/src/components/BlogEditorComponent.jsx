import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "../common/PageAnimation";
import BlogBannerImg from "../imgs/blog banner.png";
import { uploadImage } from "../common/Aws";
import { useContext, useEffect, useRef } from "react";
import {Toaster,toast} from "react-hot-toast";
import { EditorContext } from "../pages/EditorPage";
import EditorJS from "@editorjs/editorjs";
import {tools} from "./ToolsComponent";
import axios from "axios";
import { UserContext } from "../App";

const BlogEditor = () => {

  // let blogBannerRef = useRef();
  let {blog,blog:{title,banner,content,tags,desc},setBlog,textEditor,setTextEditor,setEditorState} = useContext(EditorContext)

  const {userAuth:{access_token}} = useContext(UserContext)

  let {blog_id} = useParams() 

  let navigate = useNavigate()

  useEffect(()=>{

    if(!textEditor.isReady){

      // Create a editor from the editorjs library
    // Check where if there a editor already to avoid multiple texteditor
     setTextEditor(new EditorJS({

      holderId: "textEditor",
      data: Array.isArray(content) ? content[0] : content,
      tools:tools,
      placeholder: "Let's write an awesome story."

    }))

    }

    

  },[])


  const handleBannerUpload=(e)=>{

    let img = e.target.files[0];

    if(img){

      let loadingToast = toast.loading("Uploading...")

      uploadImage(img).then((url)=>{

        if(url){

          toast.dismiss(loadingToast);
          toast.success("Uploaded")
          
            // blogBannerRef.current.src=url;

            setBlog({...blog,banner:url})

        }

      }).catch(err=>{

        toast.dismiss(loadingToast);
        return toast.error(err)

      })
    }

    console.log(img);

  }


  const handleTitleKeyDown =(e)=>{

    if(e.keyCode == 13){
      e.preventDefault()
    }

  }


  const handleTitleChange =(e)=>{

    let input = e.target;

    input.style.height = 'auto'
    input.style.height = input.scrollHeight + 'px';

    setBlog({...blog,title:input.value})

  }

  const handleError=(e)=>{

    let img = e.target;
    img.src = BlogBannerImg

  }


  const handlePublishEvent=()=>{

    if(!banner.length){

      return toast.error("Upload a blog banner to publish it.")
    }

    if(!title.length){
      return toast.error("Write blog title to publish it.")
    }

    // When we refresh the page thers some delay when loading the editor
    // to avoid user clicking on the publish button we want to avoid that
    if(textEditor.isReady){

      textEditor.save().then((data)=>{

        if(data.blocks.length){

          setBlog({...blog,content:data})
          setEditorState("publish")

        }else{
          return toast.error("Write something in your blog to publish it.")
        }

      }).catch((err)=>{

        console.log(err);
      })
    }
  }

  const handleSaveDraft=(e)=>{

    
    if(e.target.className.includes("disable")){
      return;
    }

    if(!title.length){

      return toast.error("Write blog title before saving it as a draft")

    }

    let loadingToast = toast.loading("Saving Draft...")

    // Prevent user from submitting for twice
    e.target.classList.add("disable")

    if(textEditor.isReady){

      textEditor.save().then((content)=>{

        let blogObject = {

          title,banner,desc,content,tags,draft:true
        }

        axios.post(import.meta.env.VITE_HOST + "/create-blog", {...blogObject,id:blog_id}, {

          headers:{
            'Authorization': `Bearer ${access_token}`
          }
    
        }).then(()=>{
    
          e.target.classList.remove('disable')
          toast.dismiss(loadingToast)
          toast.success("Saved :)")
    
          setTimeout(()=>{
    
            navigate("/dashboard/blogs?tab=draft")
    
          },500)
    
        }).catch(({response})=>{
    
            e.target.classList.remove('disable')
            toast.dismiss(loadingToast)
            return toast.error(response.data.error)
        })

      })
    }

    

    

  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10 ">
          <img src={logo} />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">{title.length ? title : "New Blog"}</p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>Publish</button>
          <button className="btn-light" onClick={handleSaveDraft}>Save Draft</button>
        </div>
      </nav>
      <Toaster/>
      <AnimationWrapper>
      <section>
        <div className="mx-auto max-w-[900px] w-full">
          <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
            <label htmlFor="uploadBanner">
              <img 
              // ref ={blogBannerRef}
               src={banner} className="z-20"
                onError={handleError}/>
              <input
                id="uploadBanner"
                type="file"
                accept=".png, .jpg,.jpeg"
                hidden onChange={handleBannerUpload}/>
            </label>
          </div>

        <textarea 
          defaultValue={title}
        placeholder="Blog Title"
         className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 "
         onKeyDown={handleTitleKeyDown} onChange={handleTitleChange}>

        </textarea>

        <hr className="w-full opacity-10 my-5"/>

        <div id="textEditor" className="font-gelasio">

        </div>

        </div>
        </section>

      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
