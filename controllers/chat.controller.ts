import { ConnectToDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { validateSessionAndGetUser } from "@/app/api/auth/use-cases/sessions";

import {
  createNewChatService,
  fetchAllChatsService,
  getMessagesByChatService,
  sendMessageService,
} from "@/services/chat.service";

export const createNewChatController = async (req: NextRequest) => {
  try {
    await ConnectToDatabase();
    const cookieStore = await cookies();

    const session = cookieStore.get("session")?.value;
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const currentUser = await validateSessionAndGetUser(session);

    const { otherUserId } = await req.json();

    if (!otherUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "Other userId is required",
        },
        { status: 400 },
      );
    }

    const result = await createNewChatService(
      currentUser.userId._id.toString(),
      otherUserId,
    );

    return NextResponse.json(
      {
        success: true,
        message: result.alreadyExists
          ? "Chat already exists"
          : "New Chat Created",
        chatId: result.chatId,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create chat",
      },
      { status: 500 },
    );
  }
};

export const fetchAllChatsController = async () => {
  try {
    await ConnectToDatabase();

    const cookieStore = await cookies();

    const session = cookieStore.get("session")?.value;

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const currentUser = await validateSessionAndGetUser(session);

    const chats = await fetchAllChatsService(currentUser.userId._id);

    return NextResponse.json(
      {
        success: true,
        allChats: chats,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch chats",
      },
      { status: 500 },
    );
  }
};
export const getMessagesByChatController = async (
  req: NextRequest,
  chatId: string,
) => {
  try {
    await ConnectToDatabase();

    const cookieStore = await cookies();

    const session = cookieStore.get("session")?.value;

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const currentUser = await validateSessionAndGetUser(session);

    const result = await getMessagesByChatService(
      chatId,
      currentUser.userId._id.toString(),
    );

    return NextResponse.json({
      success: true,
      messages: result.messages,
      user: result.user,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch messages",
      },
      {
        status: 500,
      },
    );
  }
};
export const sendMessageController = async (req: NextRequest) => {
  try {
    await ConnectToDatabase();

    const cookieStore = await cookies();

    const session = cookieStore.get("session")?.value;

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const currentUser = await validateSessionAndGetUser(session);

    const formData = await req.formData();

    const chatId = formData.get("chatId") as string;

    const text = formData.get("text") as string;

    const image = formData.get("image") as File | null;
console.log( chatId,
      text,
      image,"controller");

    const result = await sendMessageService({
      senderId: currentUser.userId._id.toString(),
      chatId,
      text,
      image,
    });

    return NextResponse.json(
      {
        success: true,
        message: result,
        sender: currentUser.userId._id.toString(),
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to send message",
      },
      {
        status: 500,
      },
    );
  }
};
