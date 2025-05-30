import groupChatPicture from '/group-chat.png'

export const getChatName = (chat, authUser) => {
  if(chat.users.length === 2) {
    const correctUser = chat.users.find((user) => user.username !== authUser.username);
    return correctUser.username;
  } else {
    return chat.groupName;
  }
};
export const getChatPic = (chat, authUser) => {
  if(chat?.users.length === 2) {
    const correctUser = chat?.users.find((user) => user.username !== authUser.username);
    return correctUser.profilePic;
  } else {
    return chat.groupPic || groupChatPicture;
  }
};
export const getMessagePreview = (chat, message) => {
  if (message) {
    return (
      chat.users.length > 2 ?
      message?.senderId?.username + ': ' + message?.text :
      message?.text
    );
  } else {
    return '[No messages]'
  }
};
