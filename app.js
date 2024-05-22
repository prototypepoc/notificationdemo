document.addEventListener('DOMContentLoaded', () => {
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationList = document.getElementById('notificationList');
    const redDot = document.getElementById('redDot');

    // Initialize notification system
    let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    let unreadCount = notifications.filter(n => !n.read).length;
    updateRedDot(unreadCount);
    renderNotifications();

    // Simulate receiving a notification
    setInterval(() => {
        receiveNotification(`New message at ${new Date().toLocaleTimeString()}`);
    }, 5000);

    notificationIcon.addEventListener('click', () => {
        markAllAsRead();
        renderNotifications();
        updateRedDot(0);
    });

    function receiveNotification(message) {
        const notification = {
            id: Date.now(),
            message,
            read: false
        };
        notifications.push(notification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        logAction('receive', notification);
        animateNotificationIcon();
        updateRedDot(++unreadCount);
        renderNotifications();
    }

    function animateNotificationIcon() {
        notificationIcon.classList.add('animate');
        setTimeout(() => {
            notificationIcon.classList.remove('animate');
        }, 300);
    }

    function updateRedDot(count) {
        redDot.style.display = count > 0 ? 'block' : 'none';
    }

    function renderNotifications() {
        notificationList.innerHTML = '';
        notifications.forEach(notification => {
            const li = document.createElement('li');
            li.textContent = notification.message;
            if (!notification.read) {
                li.classList.add('unread');
            }
            notificationList.appendChild(li);
            li.addEventListener('click', () => {
                notification.read = true;
                localStorage.setItem('notifications', JSON.stringify(notifications));
                renderNotifications();
                updateRedDot(--unreadCount);
            });
        });
    }

    function markAllAsRead() {
        notifications.forEach(notification => notification.read = true);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        logAction('markAllAsRead', null);
    }

    function logAction(action, data) {
        const logs = JSON.parse(localStorage.getItem('logs')) || [];
        logs.push({ action, data, timestamp: new Date().toISOString() });
        localStorage.setItem('logs', JSON.stringify(logs));
    }
});
