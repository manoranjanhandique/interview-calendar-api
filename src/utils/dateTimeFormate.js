function formatTimeWithAmPm(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; 
    const formattedMinutes = minutes === 0 ? '00' : minutes.toString().padStart(2, '0'); 
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
module.exports={formatTimeWithAmPm}