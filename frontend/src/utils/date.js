export const formatDate = (isoDateString) => {
    if (!isoDateString) return '';
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-UK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
};

export const formatChatTimeStamp = (dateString) => {
  if (!dateString) return;
  const date = new Date(dateString);
  const currentDate = new Date();

  const isToday = 
  date.getDate() === currentDate.getDate() &&
  date.getMonth() === currentDate.getMonth() &&
  date.getFullYear() === currentDate.getFullYear();

  const isYesterday = (() => {
    const yesterday = new Date();
    yesterday.setDate(currentDate.getDate() - 1);
    return(
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  })();

  if(isToday) {
    return date.toLocaleTimeString('en-UK', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } else if (isYesterday) {
    return 'yesterday';
  } else {
    return date.toLocaleDateString('en-UK', {
      year: '2-digit',
      month: '2-digit',
      day: 'numeric',
    });
  }
};
  