import { useContext, useEffect, useState } from "react"
import {UserContext} from "../App"
import { filterPaginationData } from "../common/FilterPaginationData"
import axios from "axios"
import Loader from "../components/loader.component"
import AnimationWrapper from "../common/PageAnimation"
import NoDataMessage from "../components/NoDataComponent"
import NotificationCard from "../components/NotificationCard"
import LoadMoreDataBtn from "../components/LoadMoreDataBtn"

const NotificationsPage = () => {

  let {userAuth,userAuth:{access_token,new_notification_available},setUserAuth} = useContext(UserContext)

  const [filter,setFilter] = useState("all")

  let filters = ['all','like' , 'comment', 'reply']
  const [notifications,setNotifications] = useState(null)


  const fetchNotifications =({page,deletedDocCount = 0})=>{

    axios.post(import.meta.env.VITE_HOST + '/notifications',{
      page,filter,deletedDocCount},{

        headers:{

          "Authorization": `Bearer ${access_token}`
        }
        
      }).then(async({data:{notifications:data}})=>{

        if(new_notification_available){

          setUserAuth({...userAuth,new_notification_available:false})
        }


        let formattedData = await filterPaginationData({

          state:notifications,
          data,
          page,
          countRoute:"/all-notifications-count",
          data_to_send:{filter},
          user:access_token

        })

        setNotifications(formattedData)

      }).catch((err)=>{


      })
  }

  useEffect(()=>{


    if(access_token){

      fetchNotifications({page:1})

    }

  },[access_token,filter])


  const handleFilterFunc=(e)=>{

    let btn = e.target

    setFilter(btn.innerHTML)

    setNotifications(null)

  }

  return (

      <div>
        <h1 className="max-md:hidden">Recent Notifications</h1>
        <div className="my-8 flex gap-6">

            {filters.map((filterName,i)=>{

                return <button key={i} className={"py-2 " + (filter == filterName ? "btn-dark" : "btn-light")} onClick={handleFilterFunc}>{filterName}</button>

            })}
        </div>

        {
          notifications == null ? <Loader/> : <>

              {
                notifications.results.length ? notifications.results.map((notification,i)=>{

                      return <AnimationWrapper key={i} transition={{delay:i*0.08}}>

                              <NotificationCard data={notification} index={i} notificationState={{notifications,setNotifications}}/>
                      </AnimationWrapper>

                }) : <NoDataMessage message="Nothing available"/>
              }

              <LoadMoreDataBtn state={notifications} fetchDataFun={fetchNotifications} additionalParam={{deletedDocCount:notifications.deletedDocCount}}/>

          </>
        }
      </div>

    )
}

export default NotificationsPage