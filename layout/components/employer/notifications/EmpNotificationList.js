import React from "react";
import EmployerNotification from "./EmployerNotification";
import { NotificationService } from "@/layout/service/NotificationService";
import { ScrollPanel } from "primereact/scrollpanel";

const EmpNotificationList = ({ notifications, setNotifications }) => {
  const handleRead = async (notificationId) => {
    await NotificationService.setEmpNotificationRead(notificationId);

    // Update the notification list
    setNotifications((notifications) =>
      notifications.map((notification) => {
        if (notification.notification_id === notificationId) {
          notification.read = true;
        }
        return notification;
      })
    );
  };

  // Sort notifications by most recent
  const sortedNotifications = [...notifications].sort(
    (a, b) => b.notification_id - a.notification_id
  );

  return (
    <div className="notification-list">
      <ScrollPanel className="w-full h-25rem">
        {sortedNotifications.map((notification) => (
          <EmployerNotification
            key={notification.notification_id}
            notification={notification}
            onRead={handleRead}
          />
        ))}
      </ScrollPanel>
    </div>
  );
};

export default EmpNotificationList;
