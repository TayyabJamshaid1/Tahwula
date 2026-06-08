export const formatGroupChatResponse = ({
  group,
  unseenCount = 0,
  members = [],
}: {
  group: any;
  unseenCount?: number;
  members?: any[];
}) => {
  return {
    chatType: "group",

    groupInfo: {
      _id: group._id,
      groupName: group.groupName,
      groupImage: group.groupImage,
      admin: group.admin,
      users: group.users,
      members,
    },

    chat: {
      ...group.toObject(),
      latestMessage: group.latestMessage,
      unseenCount,
    },
  };
};
export const formatSingleChatResponse = ({
  chat,
  user,
  unseenCount = 0,
}: {
  chat: any;
  user: any;
  unseenCount?: number;
}) => {
  return {
    chatType: "single",
    user,
    chat: {
      ...chat.toObject(),
      latestMessage: chat.latestMessage,
      unseenCount,
    },
  };
};