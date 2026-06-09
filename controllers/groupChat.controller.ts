import { ConnectToDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSessionAndGetUser } from "@/app/api/auth/use-cases/sessions";
import { createGroupChatService,addMembersToGroupService ,removeMemberFromGroupService,transferGroupAdminService, leaveGroupService, renameGroupService,deleteGroupService, updateGroupImageService} from "@/services/groupChat.service";

export const createGroupChatController = async (req: NextRequest) => {
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

    const body = await req.json();

    const result = await createGroupChatService({
      creatorId: currentUser.userId._id.toString(),
      groupName: body.groupName,
      members: body.members,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Group created successfully",
        group: result.group,
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create group",
      },
      { status: 500 },
    );
  }
};
export const addMembersToGroupController = async (
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
        { status: 401 },
      );
    }

    const currentUser = await validateSessionAndGetUser(session);

    const body = await req.json();

    const result = await addMembersToGroupService({
      chatId,
      adminId: currentUser.userId._id.toString(),
      members: body.members,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Members added successfully",
        group: result.group,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to add members",
      },
      { status: 500 },
    );
  }
};
export const removeMemberFromGroupController = async (
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
        { status: 401 },
      );
    }

    const currentUser = await validateSessionAndGetUser(session);

    const body = await req.json();

    const result = await removeMemberFromGroupService({
      chatId,
      adminId: currentUser.userId._id.toString(),
      memberId: body.memberId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Member removed successfully",
        group: result.group,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to remove member",
      },
      { status: 500 },
    );
  }
};
export const leaveGroupController = async (
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
        { status: 401 },
      );
    }

    const currentUser = await validateSessionAndGetUser(session);

    const result = await leaveGroupService({
      chatId,
      userId: currentUser.userId._id.toString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        group: result.group,
        groupDeleted: result.groupDeleted,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to leave group",
      },
      { status: 500 },
    );
  }
};
export const transferGroupAdminController = async (
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
        { status: 401 },
      );
    }

    const currentUser = await validateSessionAndGetUser(session);

    const body = await req.json();

    const result = await transferGroupAdminService({
      chatId,
      currentAdminId: currentUser.userId._id.toString(),
      newAdminId: body.newAdminId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin transferred successfully",
        group: result.group,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to transfer admin",
      },
      { status: 500 },
    );
  }
};
export const renameGroupController = async (
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
        { status: 401 },
      );
    }

    const currentUser = await validateSessionAndGetUser(session);

    const body = await req.json();

    const result = await renameGroupService({
      chatId,
      adminId: currentUser.userId._id.toString(),
      groupName: body.groupName,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Group renamed successfully",
        group: result.group,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to rename group",
      },
      { status: 500 },
    );
  }
};

export const deleteGroupController = async (
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
        { status: 401 },
      );
    }

    const currentUser = await validateSessionAndGetUser(session);

    const result = await deleteGroupService({
      chatId,
      adminId: currentUser.userId._id.toString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete group",
      },
      { status: 500 },
    );
  }
};
export const updateGroupImageController = async (
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
        { status: 401 },
      );
    }

    const currentUser = await validateSessionAndGetUser(session);

    const formData = await req.formData();

    const image = formData.get("image") as File | null;

    const result = await updateGroupImageService({
      chatId,
      adminId: currentUser.userId._id.toString(),
      image,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Group image updated successfully",
        group: result.group,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update group image",
      },
      { status: 500 },
    );
  }
};