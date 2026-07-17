import Chat from "@/models/Chat";
import User from "@/models/User";
import axios from "axios";
import { SystemActions } from "@/lib/SystemActions";
import { createSystemMessage } from "@/lib/createSystemMessage";
import { formatGroupChatResponse } from "@/lib/formatChatResponse";
import mongoose from "mongoose";
import Message from "@/models/Messages";
import cloudinary from "@/lib/cloudinary";
interface CreateGroupChatParams {
  creatorId: string;
  groupName: string;
  members: string[];
}

export const createGroupChatService = async ({
  creatorId,
  groupName,
  members,
}: CreateGroupChatParams) => {
  if (!groupName || !groupName.trim()) {
    throw new Error("Group name is required");
  }

  if (!Array.isArray(members)) {
    throw new Error("Members must be an array");
  }

  if (members.length < 1) {
    throw new Error("At least one member is required");
  }
  const invalidMember = members.find(
    (memberId) => !mongoose.Types.ObjectId.isValid(memberId),
  );

  if (invalidMember) {
    throw new Error(`Invalid member id: ${invalidMember}`);
  }
  const uniqueMembers = [
    ...new Set(members.filter((memberId) => memberId !== creatorId)),
  ];

  const allUsers = [creatorId, ...uniqueMembers];

  const group = await Chat.create({
    users: allUsers,
    isGroupChat: true,
    groupName: groupName.trim(),
    admin: creatorId,
    latestMessage: {
      text: `${groupName.trim()} was created`,
      sender: creatorId,
    },
  });

  const groupId = group._id.toString();

  await createSystemMessage({
    chatId: groupId,
    sender: creatorId,
    text: `${groupName.trim()} was created`,
    action: SystemActions.GROUP_CREATED,
  });

  const membersData = await User.find({
    _id: {
      $in: allUsers,
    },
  }).select("-password");

  const formattedGroup = formatGroupChatResponse({
    group,
    unseenCount: 0,
    members: membersData,
  });

  for (const memberId of uniqueMembers) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit`,
        {
          receiverId: memberId,
          event: "newChat",
          payload: formattedGroup,
        },
        {
          headers: {
            "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
          },
        },
      );
    } catch (error) {
      console.log("Socket newChat emit failed:", error);
    }
  }

  return {
    group: formattedGroup,
  };
};
interface AddMembersToGroupParams {
  chatId: string;
  adminId: string;
  members: string[];
}

export const addMembersToGroupService = async ({
  chatId,
  adminId,
  members,
}: AddMembersToGroupParams) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chat id");
  }

  if (!Array.isArray(members)) {
    throw new Error("Members must be an array");
  }

  if (members.length < 1) {
    throw new Error("At least one member is required");
  }

  const invalidMember = members.find(
    (memberId) => !mongoose.Types.ObjectId.isValid(memberId),
  );

  if (invalidMember) {
    throw new Error(`Invalid member id: ${invalidMember}`);
  }

  const group = await Chat.findById(chatId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (!group.isGroupChat) {
    throw new Error("This is not a group chat");
  }

  if (group.admin?.toString() !== adminId.toString()) {
    throw new Error("Only admin can add members");
  }

  const newMembers = members.filter(
    (memberId) =>
      !group.users.some(
        (existingUserId: string) =>
          existingUserId.toString() === memberId.toString(),
      ),
  );

  if (newMembers.length === 0) {
    throw new Error("Members already exist in group");
  }

  group.users.push(...newMembers);

  await group.save();
  const addedUsers = await User.find({
    _id: { $in: newMembers },
  }).select("name");
  const names = addedUsers.map((u) => u.name).join(", ");
  await createSystemMessage({
    chatId,
    sender: adminId,
    text: `${names} were added to the group`,
    action: SystemActions.MEMBER_ADDED,
  });

  const membersData = await User.find({
    _id: {
      $in: group.users,
    },
  }).select("-password");

  const unseenCount = await Message.countDocuments({
    chatId: group._id,
    sender: { $ne: adminId },
    "seenBy.userId": {
      $ne: adminId,
    },
  });

  const formattedGroup = formatGroupChatResponse({
    group,
    unseenCount,
    members: membersData,
  });

  for (const memberId of newMembers) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/join-room`,
        {
          userId: memberId,
          roomId: chatId,
        },
        {
          headers: {
            "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
          },
        },
      );

      await axios.post(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit`,
        {
          receiverId: memberId,
          event: "newChat",
          payload: formattedGroup,
        },
        {
          headers: {
            "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
          },
        },
      );
    } catch (error) {
      console.log("Socket join/newChat failed:", error);
    }
  }

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit-room`,
      {
        roomId: chatId,
        event: "groupUpdated",
        payload: {
          chatId,
          action: "members_added",
          message: `${names} joined the group`,
          updatedBy: adminId,
          group: formattedGroup,
          meta: {
            members: newMembers,
          },
        },
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );
  } catch (error) {
    console.log("Socket group Updated failed:", error);
  }

  return {
    group: formattedGroup,
  };
};

interface RemoveMemberFromGroupParams {
  chatId: string;
  adminId: string;
  memberId: string;
}

export const removeMemberFromGroupService = async ({
  chatId,
  adminId,
  memberId,
}: RemoveMemberFromGroupParams) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chat id");
  }

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    throw new Error("Invalid member id");
  }

  const group = await Chat.findById(chatId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (!group.isGroupChat) {
    throw new Error("This is not a group chat");
  }

  if (group.admin?.toString() !== adminId.toString()) {
    throw new Error("Only admin can remove members");
  }

  if (memberId.toString() === group.admin?.toString()) {
    throw new Error("Admin cannot remove himself from group");
  }

  const memberExists = group.users.some(
    (id: string) => id.toString() === memberId.toString(),
  );

  if (!memberExists) {
    throw new Error("Member not found in group");
  }

  group.users = group.users.filter(
    (id: string) => id.toString() !== memberId.toString(),
  );

  await group.save();
  const removedUser = await User.findById(memberId);

  await createSystemMessage({
    chatId,
    sender: adminId,
    text: `${removedUser?.name} was removed from the group`,
    action: SystemActions.MEMBER_REMOVED,
  });

  const membersData = await User.find({
    _id: {
      $in: group.users,
    },
  }).select("-password");

  const unseenCount = await Message.countDocuments({
    chatId: group._id,
    sender: { $ne: adminId },
    "seenBy.userId": {
      $ne: adminId,
    },
  });

  const formattedGroup = formatGroupChatResponse({
    group,
    unseenCount,
    members: membersData,
  });

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/leave-room`,
      {
        userId: memberId,
        roomId: chatId,
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );

    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit`,
      {
        receiverId: memberId,
        event: "removedFromGroup",
        payload: {
          chatId,
          message: "You have been removed from this group",
        },
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );

    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit-room`,
      {
        roomId: chatId,
        event: "groupUpdated",
        payload: {
          chatId,
          action: "member_removed",
          message: `${removedUser?.name} was removed from the group`,
          updatedBy: adminId,
          group: formattedGroup,
          meta: {
            memberId,
          },
        },
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );
  } catch (error) {
    console.log("Socket remove member events failed:", error);
  }

  return {
    group: formattedGroup,
  };
};
interface LeaveGroupParams {
  chatId: string;
  userId: string;
}

export const leaveGroupService = async ({
  chatId,
  userId,
}: LeaveGroupParams) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chat id");
  }

  const group = await Chat.findById(chatId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (!group.isGroupChat) {
    throw new Error("This is not a group chat");
  }

  const isMember = group.users.some(
    (id: string) => id.toString() === userId.toString(),
  );

  if (!isMember) {
    throw new Error("You are not a member of this group");
  }

  // If admin leaves, transfer admin to next member
  if (group.admin?.toString() === userId.toString()) {
    const nextAdmin = group.users.find(
      (id: string) => id.toString() !== userId.toString(),
    );

    // If no other member, delete group
    if (!nextAdmin) {
      await Message.deleteMany({ chatId });
      await Chat.findByIdAndDelete(chatId);

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit-room`,
          {
            roomId: chatId,
            event: "groupDeleted",
            payload: {
              chatId,
              message: "Group deleted because no members left",
            },
          },
          {
            headers: {
              "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
            },
          },
        );
      } catch (error) {
        console.log("Socket groupDeleted failed:", error);
      }

      return {
        message: "Group deleted because no members left",
        groupDeleted: true,
        group: null,
      };
    }

    group.admin = nextAdmin.toString();
  }

  group.users = group.users.filter(
    (id: string) => id.toString() !== userId.toString(),
  );

  await group.save();
  const user = await User.findById(userId);

  await createSystemMessage({
    chatId,
    sender: userId,
    text: `${user?.name} left the group`,
    action: SystemActions.MEMBER_LEFT,
  });

  const membersData = await User.find({
    _id: {
      $in: group.users,
    },
  }).select("-password");

  const unseenCount = await Message.countDocuments({
    chatId: group._id,
    sender: { $ne: userId },
    "seenBy.userId": {
      $ne: userId,
    },
  });

  const formattedGroup = formatGroupChatResponse({
    group,
    unseenCount,
    members: membersData,
  });

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/leave-room`,
      {
        userId,
        roomId: chatId,
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );

    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit`,
      {
        receiverId: userId,
        event: "removedFromGroup",
        payload: {
          chatId,
          message: "You left this group",
        },
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );

    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit-room`,
      {
        roomId: chatId,
        event: "groupUpdated",
        payload: {
          chatId,
          action: "member_left",
          message: `${user?.name} left the group`,
          updatedBy: userId,
          group: formattedGroup,
          meta: {
            memberId: userId,
            newAdmin: group.admin,
          },
        },
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );
  } catch (error) {
    console.log("Socket leave group events failed:", error);
  }

  return {
    message: "You left the group successfully",
    groupDeleted: false,
    group: formattedGroup,
  };
};
interface RenameGroupParams {
  chatId: string;
  adminId: string;
  groupName: string;
}

export const renameGroupService = async ({
  chatId,
  adminId,
  groupName,
}: RenameGroupParams) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chat id");
  }

  if (!groupName || !groupName.trim()) {
    throw new Error("Group name is required");
  }

  const group = await Chat.findById(chatId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (!group.isGroupChat) {
    throw new Error("This is not a group chat");
  }

  if (group.admin?.toString() !== adminId.toString()) {
    throw new Error("Only admin can rename group");
  }

  group.groupName = groupName.trim();

  await group.save();

  await createSystemMessage({
    chatId,
    sender: adminId,
    text: `Group renamed to ${groupName.trim()}`,
    action: SystemActions.GROUP_RENAMED,
  });

  const membersData = await User.find({
    _id: {
      $in: group.users,
    },
  }).select("-password");

  const unseenCount = await Message.countDocuments({
    chatId: group._id,
    sender: { $ne: adminId },
    "seenBy.userId": {
      $ne: adminId,
    },
  });

  const formattedGroup = formatGroupChatResponse({
    group,
    unseenCount,
    members: membersData,
  });

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit-room`,
      {
        roomId: chatId,
        event: "groupUpdated",
        payload: {
          chatId,
          action: "group_renamed",
          message: `Group renamed to ${groupName.trim()}`,
          updatedBy: adminId,
          group: formattedGroup,
          meta: {
            groupName: groupName.trim(),
          },
        },
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );
  } catch (error) {
    console.log("Socket group rename failed:", error);
  }

  return {
    group: formattedGroup,
  };
};
interface TransferGroupAdminParams {
  chatId: string;
  currentAdminId: string;
  newAdminId: string;
}

export const transferGroupAdminService = async ({
  chatId,
  currentAdminId,
  newAdminId,
}: TransferGroupAdminParams) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chat id");
  }

  if (!mongoose.Types.ObjectId.isValid(newAdminId)) {
    throw new Error("Invalid new admin id");
  }

  const group = await Chat.findById(chatId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (!group.isGroupChat) {
    throw new Error("This is not a group chat");
  }

  if (group.admin?.toString() !== currentAdminId.toString()) {
    throw new Error("Only current admin can transfer admin role");
  }

  const isNewAdminMember = group.users.some(
    (id: string) => id.toString() === newAdminId.toString(),
  );

  if (!isNewAdminMember) {
    throw new Error("New admin must be a group member");
  }

  if (group.admin?.toString() === newAdminId.toString()) {
    throw new Error("This user is already the admin");
  }

  const oldAdminId = group.admin;
  group.admin = newAdminId;

  await group.save();
  const newAdmin = await User.findById(newAdminId);
  await createSystemMessage({
    chatId,
    sender: currentAdminId,
    text: `Admin role transferred to ${newAdmin?.name}`,
    action: SystemActions.ADMIN_TRANSFERRED,
  });

  const membersData = await User.find({
    _id: {
      $in: group.users,
    },
  }).select("-password");

  const unseenCount = await Message.countDocuments({
    chatId: group._id,
    sender: { $ne: currentAdminId },
    "seenBy.userId": {
      $ne: currentAdminId,
    },
  });

  const formattedGroup = formatGroupChatResponse({
    group,
    unseenCount,
    members: membersData,
  });

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit-room`,
      {
        roomId: chatId,
        event: "groupUpdated",
        payload: {
          chatId,
          action: "admin_transferred",
          message: `${newAdmin?.name} is the new admin`,
          updatedBy: currentAdminId,
          group: formattedGroup,
          meta: {
            oldAdmin: oldAdminId,
            newAdmin: newAdminId,
          },
        },
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );
  } catch (error) {
    console.log("Socket admin transfer failed:", error);
  }

  return {
    group: formattedGroup,
  };
};
interface DeleteGroupParams {
  chatId: string;
  adminId: string;
}

export const deleteGroupService = async ({
  chatId,
  adminId,
}: DeleteGroupParams) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chat id");
  }

  const group = await Chat.findById(chatId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (!group.isGroupChat) {
    throw new Error("This is not a group chat");
  }

  if (group.admin?.toString() !== adminId.toString()) {
    throw new Error("Only admin can delete group");
  }

  // Optional: delete old group image from Cloudinary
  if (group.groupImage?.publicId) {
    try {
      await cloudinary.uploader.destroy(group.groupImage.publicId);
    } catch (error) {
      console.log("Failed to delete group image from Cloudinary:", error);
    }
  }

  await Message.deleteMany({
    chatId,
  });

  await Chat.findByIdAndDelete(chatId);

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit-room`,
      {
        roomId: chatId,
        event: "groupDeleted",
        payload: {
          chatId,
          message: "Group deleted successfully",
        },
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );
  } catch (error) {
    console.log("Socket group delete failed:", error);
  }

  return {
    message: "Group deleted successfully",
  };
};
interface UpdateGroupImageParams {
  chatId: string;
  adminId: string;
  image: File | null;
}

export const updateGroupImageService = async ({
  chatId,
  adminId,
  image,
}: UpdateGroupImageParams) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chat id");
  }

  if (!image) {
    throw new Error("Group image is required");
  }

  const group = await Chat.findById(chatId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (!group.isGroupChat) {
    throw new Error("This is not a group chat");
  }

  if (group.admin?.toString() !== adminId.toString()) {
    throw new Error("Only admin can update group image");
  }

  // Upload to Cloudinary
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "group-images",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        },
      )
      .end(buffer);
  });

  // Optional: delete old image
  if (group.groupImage?.publicId) {
    try {
      await cloudinary.uploader.destroy(group.groupImage.publicId);
    } catch (error) {
      console.log("Failed to delete old group image:", error);
    }
  }

  group.groupImage = {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };

  await group.save();

  await createSystemMessage({
    chatId,
    sender: adminId,
    text: "Group image updated",
    action: SystemActions.GROUP_IMAGE_UPDATED,
  });

  const membersData = await User.find({
    _id: {
      $in: group.users,
    },
  }).select("-password");

  const unseenCount = await Message.countDocuments({
    chatId: group._id,
    sender: { $ne: adminId },
    "seenBy.userId": {
      $ne: adminId,
    },
  });

  const formattedGroup = formatGroupChatResponse({
    group,
    unseenCount,
    members: membersData,
  });

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit-room`,
      {
        roomId: chatId,
        event: "groupUpdated",
        payload: {
          chatId,
          action: "group_image_updated",
          message: "Group image updated",
          updatedBy: adminId,
          group: formattedGroup,
          meta: {},
        },
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );
  } catch (error) {
    console.log("Socket group image update failed:", error);
  }

  return {
    group: formattedGroup,
  };
};
