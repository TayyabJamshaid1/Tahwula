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