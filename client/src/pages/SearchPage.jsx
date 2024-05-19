import { useParams } from "react-router-dom"
import InPageNavigation from "../components/InPageNavigation";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/PageAnimation";
import BlogPostCard from "../components/BlogPostComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import {filterPaginationData} from "../common/filterPaginationData";
import NoDataMessage from "../components/NoDataComponent";
import LoadMoreDataBtn from "../components/LoadMoreDataBtn";
import UserCardComponent from "../components/UserCardComponent";

const SearchPage = () => {

    let { query} = useParams();
    let [blogs,setBlogs] = useState(null);
    let [users,setUsers] = useState(null);

    const searchBlogs = ({page = 1, create_new_arr = false})=>{

        axios.post(import.meta.env.VITE_HOST + "/search-blogs",{query,page})
        
        .then(async({ data }) => {
          
          let formattedData = await filterPaginationData({
  
              state:blogs,
              data:data.blogs,
              page,
              countRoute:"/search-blogs-count",
              data_to_send:{query},
              create_new_arr
  
          })
          
          setBlogs(formattedData);
       
        }).catch((err) => console.log(err))}


        
        const fetchUsers = ()=>{

            axios.post(import.meta.env.VITE_HOST + "/search-users",{query})
            .then(({data:{users}})=>{

                setUsers(users)
            })

        }

            useEffect(()=>{
                
                resetState()
            
                searchBlogs({page:1,create_new_arr:true})

                fetchUsers()
    
        },[query])


        const resetState=()=>{

            setBlogs(null)
            setUsers(null)

        }
    
        const UserCardWrapper=()=>{

            return (
                <>
                    {
                        users == null ? <Loader/> : users.length ? 
                        users.map((user,i)=>{
                            return <AnimationWrapper key={i} transition={{duration:1, delay:i * 0.08}}>
                            <UserCardComponent user={user}/>
                            </AnimationWrapper>
                        })
                        : <NoDataMessage message="No user found"/>
                    }
                </>
            )
        }

  
  return (

    <section className="h-cover flex justify-center gap-10"> 

        <div className="w-full">

            <InPageNavigation routes={[`Search Results from "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>

            <>
              {blogs == null ? (
              
                <Loader />
              
              ) : (
                  blogs.results.length ? blogs.results.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}>
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}/>
                    </AnimationWrapper>
                  );

                }) : <NoDataMessage message="No blogs published"/>

              )}

              <LoadMoreDataBtn state={blogs} fetchDataFun={searchBlogs}/>
            </>
            <UserCardWrapper/>
            </InPageNavigation>

        </div>
        <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden">

                <h1 className="font-medium text-xl mb-8">User related to search
                    <i className="fi fi-rr-user mt-1 ml-1"></i>
                </h1>
                <UserCardWrapper/>
        </div>
    </section>


  )
            }

export default SearchPage