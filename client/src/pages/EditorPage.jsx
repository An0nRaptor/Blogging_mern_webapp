import { createContext, useContext, useEffect, useState } from "react"
import { UserContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/BlogEditorComponent";
import PublishForm from "../components/PublishFormComponent";
import Loader from "../components/loader.component";
import axios from "axios";


const blogStructure={

  title:'',
  banner:'',
  content:[],
  tags:[],
  desc:'',
  author:{personal_info:{}}

}


export const EditorContext = createContext({})


const EditorPage = () => {


  let {blog_id} = useParams()

    const [blog,setBlog] = useState(blogStructure)

    const [editorState,setEditorState] = useState("editor");
    const [textEditor,setTextEditor] = useState({isReady:false})
    const [loading,setLoading] = useState(true)

    const {userAuth:{access_token}} = useContext(UserContext)


    useEffect(()=>{

      if(!blog_id){

        return setLoading(false);

      }

      axios.post(import.meta.env.VITE_HOST + '/get-blog' , {

              blog_id,draft:true,mode:'edit'})

            .then(({data:{blog}})=>{

              setBlog(blog);
              setLoading(false);
            })
            .catch((err)=>{

              setBlog(null);
              setLoading(false)
            })

    },[])


  return (
    
    <EditorContext.Provider value={{blog,setBlog,editorState,setEditorState,textEditor,setTextEditor}}>
    
      {
        
        access_token === null ? <Navigate to="/signin"/>
       :
        loading ? <Loader/> : editorState == "editor" ? <BlogEditor/> :<PublishForm/>}

    </EditorContext.Provider>
   

  )
}

export default EditorPage