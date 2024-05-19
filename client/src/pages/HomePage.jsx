import axios from "axios";
import AnimationWrapper from "../common/PageAnimation";
import InPageNavigation from "../components/InPageNavigation";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/BlogPostComponent";
import MinimalBlogPost from "../components/NoBannerBlogPosts";
import {activeTabRef } from "../components/InPageNavigation";
import NoDataMessage from "../components/NoDataComponent";
import { filterPaginationData } from "../common/FilterPaginationData";
import LoadMoreDataBtn from "../components/LoadMoreDataBtn";

const HomePage = () => {
  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState,setPageState] = useState("home")

  let categories = [
    "programming",
    "bollywood",
    "hollywood",
    "frontend",
    "tech",
    "nature",
    "travel",
  ];

  const fetchLatestBlogs = ({page=1}) => {

    axios.post(import.meta.env.VITE_HOST + "/latest-blogs",{page})
      .then(async({ data }) => {

        console.log(data.blogs);
        
        let formattedData = await filterPaginationData({

  
            state:blogs,
            data:data.blogs,
            page,
            countRoute:"/all-latest-blogs-count"

        })
        console.log(formattedData);

        setBlogs(formattedData);

      }).catch((err) => console.log(err.message));
  };

  const fetchTrendingBlogs = () => {
    
    axios.get(import.meta.env.VITE_HOST + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => console.log(err));
  };


  const fetchBlogsbyCategory=({page = 1})=>{

    axios.post(import.meta.env.VITE_HOST + "/search-blog" ,{tag:pageState,page})
    .then(async({data})=>{

      let formattedData = await filterPaginationData({

            state:blogs,
            data:data.blogs,
            page,
            countRoute:"/search-blogs-count",
            data_to_send:{tag:pageState} 

        })
        console.log(formattedData);

        setBlogs(formattedData);
    }).catch((err)=>{
      console.log(err);
    })

  }

  const loadBlogByCategory=(e)=>{

    
    let category = e.target.innerText.toLowerCase();
    console.log(category);
    setBlogs(null);

    if(pageState == category){

      setPageState("home")
      return
    }

    setPageState(category)
  }

  useEffect(() => {

    activeTabRef.current.click();

    if(pageState == "home"){

      fetchLatestBlogs({page:1});
    }else{
      fetchBlogsbyCategory({page:1})
    }

    if(!trendingBlogs){
      fetchTrendingBlogs();

    }
  }, [pageState]);


  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest blogs */}
        <div className="w-full">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
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
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                }) : <NoDataMessage message="No blogs published"/>
              )}

              <LoadMoreDataBtn state={blogs} fetchDataFun={(pageState == "home" ? fetchLatestBlogs : fetchBlogsbyCategory)}/>
            </>

            {trendingBlogs == null ? (

              <Loader />
            
            ) : (

              trendingBlogs.length ? trendingBlogs.map((blog, i) => {
            
                return (
                  <AnimationWrapper
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}>
                    <MinimalBlogPost blog={blog} index={i} />
                  </AnimationWrapper>
                );
              }) : <NoDataMessage message="No trending blogs"/>
            )}
          </InPageNavigation>
        </div>

        {/*  Filters and trending blogs*/}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden ">
          <div className="flex flex-col gap-10 ">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all Intrests
              </h1>

              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button key={i} className={"tag " + (pageState == category ? "bg-black text-white" : " ")} onClick={loadBlogByCategory}>
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {trendingBlogs == null ? (
                <Loader />

              ) : (

              trendingBlogs.length ? trendingBlogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimationWrapper>
                  );
                }) : <NoDataMessage message="No trending blogs"/>
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
