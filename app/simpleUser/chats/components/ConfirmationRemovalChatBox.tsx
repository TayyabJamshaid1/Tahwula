import React from 'react'

const ConfirmationRemovalChatBox = ({ memberToRemove, isRemovingMember, removeGroupMember, currentChatDetails,setMemberToRemove }:any) => {
  return (
 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 w-[320px]">
            <h3 className="font-semibold mb-2 text-white">Remove Member</h3>

            <p className="text-sm text-gray-400">
              Remove {memberToRemove.name} from group?
            </p>

            <div className="flex gap-2 mt-4">
              <button
                disabled={isRemovingMember}
                onClick={() => setMemberToRemove(null)}
                className={`flex-1 bg-gray-700 py-2 rounded text-white ${isRemovingMember ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"}`}
              >
                Cancel{" "}
              </button>

              <button
                disabled={isRemovingMember}
                onClick={() => {
                  removeGroupMember({
                    chatId: currentChatDetails._id,
                    memberId: memberToRemove._id,

                    onSuccess: () => {
                      setMemberToRemove(null);
                    },
                  });
                }}
                className={`flex-1 bg-red-600 py-2 rounded text-white ${isRemovingMember ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}
              >
                {isRemovingMember ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>  )
}

export default ConfirmationRemovalChatBox