"use client";

import { User } from "@/app/store/AuthSlice";
import { Crown, UserCircle, Users, X, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import GroupActionConfirmModal from "./ConfirmationRemovalChatBox";

interface GroupInfoModalProps {
  currentChatDetails: any;
  loggedInUser: User | null;
  users: User[];
  deleteGroup: (payload: { chatId: string; onSuccess?: () => void }) => void;
  isDeletingGroup: boolean;
  renameGroup: (payload: {
    chatId: string;
    groupName: string;
    onSuccess?: () => void;
  }) => void;

  addGroupMembers: (payload: {
    chatId: string;
    members: string[];
    onSuccess?: () => void;
  }) => void;

  leaveGroup: (payload: { chatId: string; onSuccess?: () => void }) => void;

  isRenamingGroup: boolean;
  isAddingMembers: boolean;
  isLeavingGroup: boolean;
  removeGroupMember: (payload: {
    chatId: string;
    memberId: string;
    onSuccess?: () => void;
  }) => void;

  isRemovingMember: boolean;
  onClose: () => void;
  transferAdmin: (payload: {
    chatId: string;
    newAdminId: string;
    onSuccess?: () => void;
  }) => void;
  updateGroupImage: (payload: {
    chatId: string;
    image: File;
    onSuccess?: () => void;
  }) => void;

  isUpdatingGroupImage: boolean;
  isTransferringAdmin: boolean;
}

const GroupInfoModal = ({
  currentChatDetails,
  transferAdmin,
  isTransferringAdmin,
  loggedInUser,
  updateGroupImage,
  isUpdatingGroupImage,
  users,
  removeGroupMember,
  isRemovingMember,
  renameGroup,
  addGroupMembers,
  leaveGroup,
  isRenamingGroup,
  isAddingMembers,
  isLeavingGroup,
  deleteGroup,
  isDeletingGroup,
  onClose,
}: GroupInfoModalProps) => {
  if (!currentChatDetails) return null;

  const members = currentChatDetails.users || [];
  const adminId = currentChatDetails.groupAdmin;

  const isLoggedInUserAdmin = loggedInUser?._id === adminId;
  const [memberToRemove, setMemberToRemove] = useState<User | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newGroupName, setNewGroupName] = useState(
    currentChatDetails.groupName || "",
  );
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false);
  const [groupImageFile, setGroupImageFile] = useState<File | null>(null);
  const [memberToMakeAdmin, setMemberToMakeAdmin] = useState<User | null>(null);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [selectedNewMembers, setSelectedNewMembers] = useState<string[]>([]);

  const availableUsers = users.filter(
    (u) =>
      u._id !== loggedInUser?._id &&
      !members.some((member: User) => member._id === u._id),
  );

  const toggleSelectUser = (userId: string) => {
    setSelectedNewMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleRenameGroup = () => {
    if (!newGroupName.trim()) {
      toast.error("Group name is required");
      return;
    }

    renameGroup({
      chatId: currentChatDetails._id,
      groupName: newGroupName,
      onSuccess: () => {
        setIsEditingName(false);
      },
    });
  };

  const handleAddMembers = () => {
    if (selectedNewMembers.length === 0) {
      toast.error("Select at least one member");
      return;
    }

    addGroupMembers({
      chatId: currentChatDetails._id,
      members: selectedNewMembers,
      onSuccess: () => {
        setSelectedNewMembers([]);
        setShowAddMembers(false);
      },
    });
  };

  const handleLeaveGroup = () => {
    leaveGroup({
      chatId: currentChatDetails._id,
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md max-h-[92vh] overflow-y-auto bg-gray-900 border border-gray-700 rounded-xl p-4 sm:p-5 text-white">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Group Info</h2>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-3 overflow-hidden">
            {currentChatDetails?.groupImage?.url ? (
              <img
                src={currentChatDetails.groupImage.url}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <Users className="w-10 h-10 text-gray-300" />
            )}
          </div>
          {isLoggedInUserAdmin && (
            <div className="flex flex-col items-center gap-2 mb-3">
              <label className="text-xs text-blue-400 cursor-pointer hover:underline">
                Change group image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isUpdatingGroupImage}
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file && file.type.startsWith("image/")) {
                      setGroupImageFile(file);
                    }
                  }}
                />
              </label>

              {groupImageFile && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {groupImageFile.name}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        updateGroupImage({
                          chatId: currentChatDetails._id,
                          image: groupImageFile,
                          onSuccess: () => {
                            setGroupImageFile(null);
                          },
                        });
                      }}
                      disabled={isUpdatingGroupImage}
                      className="text-xs bg-green-600 px-3 py-1 rounded-lg disabled:opacity-50"
                    >
                      {isUpdatingGroupImage ? "Uploading..." : "Upload"}
                    </button>

                    <button
                      onClick={() => setGroupImageFile(null)}
                      disabled={isUpdatingGroupImage}
                      className="text-xs bg-gray-700 px-3 py-1 rounded-lg disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {isEditingName ? (
            <div className="w-full flex gap-2">
              <input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />

              <button
                onClick={handleRenameGroup}
                disabled={isRenamingGroup}
                className="px-3 py-2 bg-blue-600 rounded-lg text-sm disabled:opacity-50"
              >
                {isRenamingGroup ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => {
                  setIsEditingName(false);
                  setNewGroupName(currentChatDetails.groupName || "");
                }}
                disabled={isRenamingGroup}
                className="px-3 py-2 bg-gray-700 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                {currentChatDetails.groupName}
              </h3>

              {isLoggedInUserAdmin && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>
          )}

          <p className="text-sm text-gray-400 mt-1">{members.length} members</p>
        </div>

        {isLoggedInUserAdmin && (
          <button
            onClick={() => setShowAddMembers((prev) => !prev)}
            disabled={isAddingMembers}
            className="w-full mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
          >
            {showAddMembers ? "Cancel Add Members" : "Add Members"}
          </button>
        )}

        {showAddMembers && (
          <div className="mb-4 border border-gray-700 rounded-lg p-3 bg-gray-950">
            <h4 className="text-sm text-gray-400 mb-2">Select users to add</h4>

            {availableUsers.length > 0 ? (
              <div className="space-y-2 max-h-44 overflow-y-auto">
                {availableUsers.map((u) => {
                  const isSelected = selectedNewMembers.includes(u._id);

                  return (
                    <button
                      key={u._id}
                      onClick={() => toggleSelectUser(u._id)}
                      disabled={isAddingMembers}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${
                        isSelected ? "bg-blue-600" : "bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <UserCircle className="w-6 h-6 text-gray-300" />

                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>

                      {isSelected && <Check className="w-5 h-5 text-white" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No users available to add</p>
            )}

            {availableUsers.length > 0 && (
              <button
                onClick={handleAddMembers}
                disabled={isAddingMembers || selectedNewMembers.length === 0}
                className="w-full mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
              >
                {isAddingMembers ? "Adding..." : "Add Selected"}
              </button>
            )}
          </div>
        )}

        <div>
          <h4 className="text-sm text-gray-400 mb-2">Members</h4>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {members.map((member: User) => {
              const isAdmin = member._id === adminId;
              const isMe = member._id === loggedInUser?._id;

              return (
                <div
                  key={member._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-6 h-6 text-gray-300" />

                    <div>
                      <p className="font-medium">
                        {member.name} {isMe && "(You)"}
                      </p>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {isAdmin && (
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        <Crown className="w-4 h-4" />
                        Admin
                      </div>
                    )}

                    {isLoggedInUserAdmin && !isAdmin && !isMe && (
                      <>
                        <button
                          onClick={() => setMemberToMakeAdmin(member)}
                          disabled={isTransferringAdmin}
                          className="text-yellow-400 text-xs hover:underline disabled:opacity-50"
                        >
                          Make Admin
                        </button>

                        <button
                          onClick={() => setMemberToRemove(member)}
                          disabled={isRemovingMember}
                          className="text-red-400 text-xs hover:underline disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleLeaveGroup}
          disabled={isLeavingGroup}
          className="w-full mt-5 bg-red-600 hover:bg-red-700 py-2 rounded-lg disabled:opacity-50"
        >
          {isLeavingGroup ? "Leaving..." : "Leave Group"}
        </button>
        {isLoggedInUserAdmin && (
          <button
            onClick={() => setShowDeleteGroupConfirm(true)}
            disabled={isDeletingGroup}
            className="w-full mt-3 bg-red-800 hover:bg-red-900 py-2 rounded-lg disabled:opacity-50"
          >
            {isDeletingGroup ? "Deleting..." : "Delete Group"}
          </button>
        )}
      </div>
      <GroupActionConfirmModal
        open={!!memberToRemove}
        title="Remove Member"
        description={`Remove ${memberToRemove?.name} from group?`}
        confirmText="Remove"
        isLoading={isRemovingMember}
        onCancel={() => setMemberToRemove(null)}
        onConfirm={() => {
          if (!memberToRemove) return;

          removeGroupMember({
            chatId: currentChatDetails._id,
            memberId: memberToRemove._id,
            onSuccess: () => {
              setMemberToRemove(null);
            },
          });
        }}
      />
      <GroupActionConfirmModal
        open={showDeleteGroupConfirm}
        title="Delete Group"
        description="Are you sure you want to delete this group? This action cannot be undone."
        confirmText="Delete"
        confirmClassName="bg-red-700 hover:bg-red-800"
        isLoading={isDeletingGroup}
        onCancel={() => setShowDeleteGroupConfirm(false)}
        onConfirm={() => {
          deleteGroup({
            chatId: currentChatDetails._id,
            onSuccess: () => {
              setShowDeleteGroupConfirm(false);
              onClose();
            },
          });
        }}
      />
      <GroupActionConfirmModal
        open={!!memberToMakeAdmin}
        title="Transfer Admin"
        description={`Make ${memberToMakeAdmin?.name} the group admin?`}
        confirmText="Transfer"
        confirmClassName="bg-yellow-600 hover:bg-yellow-700"
        isLoading={isTransferringAdmin}
        onCancel={() => setMemberToMakeAdmin(null)}
        onConfirm={() => {
          if (!memberToMakeAdmin) return;

          transferAdmin({
            chatId: currentChatDetails._id,
            newAdminId: memberToMakeAdmin._id,
            onSuccess: () => {
              setMemberToMakeAdmin(null);
            },
          });
        }}
      />
    </div>
  );
};

export default GroupInfoModal;
