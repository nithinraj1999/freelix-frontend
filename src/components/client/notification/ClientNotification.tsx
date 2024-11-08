import React from 'react'
import { useEffect,useState } from 'react';
import socket from '../../../socket/socket';
import { RootState } from '../../../state/store';
import { useSelector } from 'react-redux';
import { fetchAllNotifications } from '../../../api/client/clientServices';
const ClientNotification:React.FC = () => {
    const { user } = useSelector((state: RootState) => state.user); // Get user from Redux store

    interface jobID{
        title:string
    }
    interface freelancerID{
        name:string
    }
    interface notification {
        bidAmount?: number;
        freelancerName?:string;
        freelancerId:freelancerID;
        jobId: jobID;
        createdAt: Date;
      }
    const [notifications, setNotifications] = useState<notification[]>([]);
    const [notficationDB,setNotficationDB] = useState<notification[]>([]);
    
    useEffect(() => {
        socket.on("notification", (notification) => {
          console.log(notification);
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            notification,
          ]);
        });
        
        return () => {
          socket.off("notification");
        };
      }, []);

      const sortedNotifications = [...notifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const sortedNotificationsDoc = [...notficationDB].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
        
      useEffect(()=>{
        if(user?._id){
            
            async function fetchNotifications(userID:string ){
                const data = {
                    userID:userID
                }
                const response = await fetchAllNotifications(data)
                console.log("all notifications...",response);
                setNotficationDB(response.notifications)
            }
            fetchNotifications(user._id)
        }
       
      },[])

  return (
    <>
   
    <div className="w-full max-w-md  bg-white shadow-md rounded-lg">
      
    {sortedNotifications.map((notification, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-3 mb-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
       
        <div>
          <p className="text-gray-800 font-semibold">
            {notification.freelancerId.name} placed a bid on your post
          </p>
          <p className="text-gray-600 text-sm">Bid amount: ${notification.bidAmount}</p>
        </div>
        <p className="text-gray-500 text-xs">
          {new Date(notification.createdAt).toLocaleTimeString()}
        </p>
      </div>
    ))}
  </div>
  
  <div className="w-full max-w-md p-4 bg-white shadow-md rounded-lg">
    {sortedNotificationsDoc.map((notification, index) => (
      <div
        key={index}
        className="flex items-center justify-between p-3 mb-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div>
          <p className="text-gray-800 font-semibold">
            {notification.freelancerName} placed a bid on your post
          </p>
          <p className="text-gray-600 text-sm">Bid amount: ${notification.bidAmount}</p>
        </div>
        <p className="text-gray-500 text-xs">
          {new Date(notification.createdAt).toLocaleTimeString()}
        </p>
      </div>
    ))}
  </div>
  </>
  )
}

export default ClientNotification
