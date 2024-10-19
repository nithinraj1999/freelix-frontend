import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectNotifications,markAsRead} from '../../../state/slices/notificationSlice';
const JobNotification: React.FC = () => {
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch();

  const handleNotificationClick = (id: string) => {
    dispatch(markAsRead(id)); // Mark notification as read in the Redux store
    // You can also send a request to the server here if needed
  };

  return (
    <div className='w-full bg-white'>
      {notifications.map((notification) => (
        <div 
          key={notification.id} 
          className={`h-[100px] p-4 cursor-pointer ${notification.isRead ? 'bg-gray-100' : 'bg-white'}`} 
          onClick={() => handleNotificationClick(notification.id)}
        >
          <div>
            <h1 className='font-bold text-slate-800'>{notification.jobTitle || 'Job Notification'}</h1>
            <p className='text-gray-500'>{notification.type === 'job' ? 'A new job has been posted' : 'New notification'}</p>
            <div className='flex justify-between'>
              <p className='text-gray-600'>Job ID: {notification.jobId}</p>
              <p className='text-gray-600'>{new Date(notification.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobNotification;
