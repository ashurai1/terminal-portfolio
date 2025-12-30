export const formatTime = (date) => {
    return date.toTimeString().split(' ')[0];
};

export const getLastLogin = () => {
    const date = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Format: Last login: Tue Jan 14 09:42:11 on ttys000
    return `Last login: ${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()} ${formatTime(date)} on ttys000`;
};
