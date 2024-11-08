import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import socket from "../../../socket/socket";
const JobNotification: React.FC = () => {
  interface JobNotification {
    title: string;
    type: "job" | "bidding" | "message";
    fixedPrice?: number;
    hourlyPrice?: {
      from: number;
      to: number;
    };
    jobId: string;
    createdAt: Date;
  }

  const [notifications, setNotifications] = useState<JobNotification[]>([]);
const navigate =useNavigate()
  useEffect(() => {
    socket.on("newJobNotification", (notification) => {
      console.log(notification);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    return () => {
      socket.off("newJobNotification");
    };
  }, []);

  const handleNotificationClick = (jobId: string) => {
    localStorage.setItem("selectedJobId", jobId);
    navigate('/freelancer/job/details',{ state: { jobId }})
  };
 
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="w-full bg-white">
      {sortedNotifications.map((notification) => (
        <div
          key={notification.jobId}
          className={`h-[100px] p-4 cursor-pointer`}
          onClick={() => handleNotificationClick(notification.jobId)}
        >
          <div>
            <h1 className="font-bold text-slate-800">
              {notification.title.length > 40
                ? `${notification.title.substring(0, 40)}...`
                : notification.title}
            </h1>

            {/* <p className='text-gray-500'>{notification.type === 'job' ? 'A new job has been posted' : 'New notification'}</p> */}
            <div className="flex justify-between">
              <p className="text-gray-600 font-bold">
                {notification.fixedPrice
                  ? `Fixed Price: $${notification.fixedPrice}`
                  : notification.hourlyPrice
                  ? `Hourly Price: $${notification.hourlyPrice.from} - $${notification.hourlyPrice.to}`
                  : ""}
              </p>
              <p className="text-gray-600">
                {new Date(notification.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobNotification;
