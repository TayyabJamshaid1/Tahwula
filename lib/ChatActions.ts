export const FetchAllChats = async () => {
  try {
    const res = await fetch(`/api/chat/fetch-all-chats`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await res.json();

    if (!data?.success) {
      return { success: false, message: data?.message };
    }

    return { success: true, message: data?.message, users: data?.allChats };
  } catch (err) {
    console.log(err);
    
    return { success: false, message: "Fetch all chats Failed" };
  }
};

export const createNewChat = async (otherUserId: string) => {
  try {
    const res = await fetch(`/api/chat/new`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        otherUserId,
      }),
    });

    const data = await res.json();

    if (!data?.success) {
      return { success: false, message: data?.message };
    }
    return { success: true, message: data?.message, chatId: data?.chatId };
  } catch (err) {
    console.log(err, "err in create new chat");

    return { success: false, message: "Create new chat Failed" };
  }
};

export const MessagesByChatId = async (chatId: string) => {
  try {
    const res = await fetch(`/api/chat/messages/${chatId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await res.json();

    if (!data?.success) {
      return { success: false, message: data?.message };
    }

    return { success: true, messages: data?.messages,selectedChatUser:data?.user};
  } catch (err) {
    return { success: false, message: "User Logout Failed" };
  }
};
export const sendMessage = async (
  formData: FormData,
) => {
  try {
    const res = await fetch(
      `/api/chat/send-message`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

    if (!data?.success) {
      return {
        success: false,
        message: data?.message,
      };
    }

    return {
      success: true,
      message: data?.message,
      sender: data?.sender,
    };
  } catch (err) {
    return {
      success: false,
      message:
        "User Logout Failed",
    };
  }
};
export const createGroupChat = async (
  groupName: string,
  members: string[],
) => {
  try {
    const res = await fetch(`/api/chat/group/new`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        groupName,
        members,
      }),
    });

    const data = await res.json();

    if (!data?.success) {
      return {
        success: false,
        message: data?.message,
      };
    }

    return {
      success: true,
      message: data?.message,
      group: data?.group,
    };
  } catch (err) {
    return {
      success: false,
      message: "Create group failed",
    };
  }
};
export const renameGroupChat = async (chatId: string, groupName: string) => {
  const res = await fetch(`/api/chat/group/rename-group/${chatId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ groupName }),
  });

  const data = await res.json();

  if (!data?.success) {
    return { success: false, message: data?.message };
  }

  return {
    success: true,
    message: data?.message,
    group: data?.group,
  };
};

export const addMembersToGroup = async (
  chatId: string,
  members: string[],
) => {
  const res = await fetch(`/api/chat/group/add-members/${chatId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ members }),
  });

  const data = await res.json();

  if (!data?.success) {
    return { success: false, message: data?.message };
  }

  return {
    success: true,
    message: data?.message,
    group: data?.group,
  };
};

export const leaveGroupChat = async (chatId: string) => {
  const res = await fetch(`/api/chat/group/leave/${chatId}`, {
    method: "PATCH",
  });

  const data = await res.json();

  if (!data?.success) {
    return { success: false, message: data?.message };
  }

  return {
    success: true,
    message: data?.message,
    group: data?.group,
    groupDeleted: data?.groupDeleted,
  };
};
export const removeMemberFromGroup = async (
  chatId: string,
  memberId: string,
) => {
  const res = await fetch(
    `/api/chat/group/remove-member/${chatId}`,
    {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        memberId,
      }),
    },
  );

  const data = await res.json();

  if (!data?.success) {
    return {
      success: false,
      message: data?.message,
    };
  }

  return {
    success: true,
    message: data?.message,
    group: data?.group,
  };
};
export const transferGroupAdmin = async (
  chatId: string,
  newAdminId: string,
) => {
  const res = await fetch(
    `/api/chat/group/transfer-admin/${chatId}`,
    {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        newAdminId,
      }),
    },
  );

  const data = await res.json();

  if (!data?.success) {
    return {
      success: false,
      message: data?.message,
    };
  }

  return {
    success: true,
    message: data?.message,
    group: data?.group,
  };
};
export const updateGroupImage = async (
  chatId: string,
  image: File,
) => {
  const formData = new FormData();
  formData.append("image", image);

  const res = await fetch(`/api/chat/group/image/${chatId}`, {
    method: "PATCH",
    body: formData,
  });

  const data = await res.json();
  if (!data?.success) {
    return {
      success: false,
      message: data?.message,
    };
  }

  return {
    success: true,
    message: data?.message,
    group: data?.group,
  };
};
export const deleteGroupChat = async (chatId: string) => {
  const res = await fetch(`/api/chat/group/delete/${chatId}`, {
    method: "DELETE",
  });

  const data = await res.json();
  if (!data?.success) {
    return {
      success: false,
      message: data?.message,
    };
  }

  return {
    success: true,
    message: data?.message,
  };
};