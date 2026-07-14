"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  name: string;
  email: string;
  mobileNumber?: string | null;
  profilePicture?: string | null;
};

export default function EditProfileModal({
  name,
  email,
  mobileNumber,
  profilePicture,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [newName, setNewName] = useState(name);

  const [newMobileNumber, setNewMobileNumber] =
    useState(mobileNumber || "");

  const [newProfilePicture, setNewProfilePicture] =
    useState(profilePicture || "");

  const [loading, setLoading] = useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setNewProfilePicture(
        data.secure_url
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: newName,
            mobileNumber:
              newMobileNumber,
            profilePicture:
              newProfilePicture,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update profile"
        );
      }

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Edit Profile
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              Edit Profile
            </h2>

            <div className="flex flex-col items-center mb-6">
              <img
                src={
                  newProfilePicture ||
                  "/default-avatar.png"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
              />

              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={
                  handleImageUpload
                }
              />

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="mt-3 border px-3 py-2 rounded"
              >
                Change Picture
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-1">
                  Name
                </label>

                <input
                  type="text"
                  value={newName}
                  onChange={(e) =>
                    setNewName(
                      e.target.value
                    )
                  }
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-1">
                  Mobile Number
                </label>

                <input
                  type="text"
                  value={
                    newMobileNumber
                  }
                  onChange={(e) =>
                    setNewMobileNumber(
                      e.target.value
                    )
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() =>
                  setOpen(false)
                }
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {loading
                  ? "Saving..."
                  : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}