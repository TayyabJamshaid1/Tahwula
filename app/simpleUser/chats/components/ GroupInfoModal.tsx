"use client";

import { User } from "@/app/store/AuthSlice";
import { Crown, UserCircle, Users, X } from "lucide-react";

interface GroupInfoModalProps {
  currentChatDetails: any;
  loggedInUser: User | null;
  onClose: () => void;
}

const GroupInfoModal = ({
  currentChatDetails,
  loggedInUser,
  onClose,
}: GroupInfoModalProps) => {
  if (!currentChatDetails) return null;

  const members = currentChatDetails.users || [];
  const adminId = currentChatDetails.groupAdmin;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl p-5 text-white">
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

          <h3 className="text-lg font-semibold">
            {currentChatDetails.groupName}
          </h3>

          <p className="text-sm text-gray-400">
            {members.length} members
          </p>
        </div>

        <div>
          <h4 className="text-sm text-gray-400 mb-2">Members</h4>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {members.map((member: User) => {
              const isAdmin = member._id === adminId;
              const isMe = member._id === loggedInUser?._id;

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-6 h-6 text-gray-300" />

                    <div>
                      <p className="font-medium">
                        {member.name} {isMe && "(You)"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <Crown className="w-4 h-4" />
                      Admin
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoModal;