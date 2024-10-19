import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface JobNotification {
  id: string; // Unique identifier for the notification
  userId: string; // ID of the user receiving the notification
  type: 'job' | 'bidding' | 'message'; // Type of notification
  jobTitle:string;
  jobId: string; // ID of the job related to the notification
  isRead: boolean; // Flag to indicate if the notification has been read
  createdAt: Date; // Timestamp of when the notification was created
}

interface NotificationsState {
  notifications: JobNotification[]; // Array to hold notifications
}

const initialState: NotificationsState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Action to add a new notification
    addNotification: (state, action: PayloadAction<JobNotification>) => {
      state.notifications.push(action.payload);
    },
    // Action to mark a notification as read
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.isRead = true;
      }
    },
    // Action to remove a notification
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    // Action to set all notifications
    setNotifications: (state, action: PayloadAction<JobNotification[]>) => {
      state.notifications = action.payload;
    },
  },
});

// Export actions to use in components
export const {
  addNotification,
  markAsRead,
  removeNotification,
  setNotifications,
} = notificationsSlice.actions;

// Selector to get all notifications
export const selectNotifications = (state: { notifications: NotificationsState }) => state.notifications.notifications;

// Export the reducer to use in the store
export default notificationsSlice.reducer;
