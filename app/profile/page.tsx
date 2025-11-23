"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null> (null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // adding new states for editing
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  interface User {
  full_name?: string 
  username: string
  email: string
  bio: string 
}

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setFullName(data.user.full_name || "");
        setBio(data.user.bio || "");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFullName(user?.full_name || "");
    setBio(user?.bio || "");
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: fullName,
          bio: bio,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "50px", maxWidth: "800px", margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "#1F2937",
          marginBottom: "30px",
        }}
      >
        My Profile
      </h1>

      {loading ? (
        <p>Loadingggggg...</p>
      ) : user ? (
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                color: "#374151",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Username
            </label>
            <p style={{ fontSize: "18px", color: "#1F2937" }}>
              {user.username}
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                fontWeight: "bold",
                color: "#374151",
                display: "block",
                marginBottom: "5px",
              }}
            >
              Email
            </label>
            <p style={{ fontSize: "18px", color: "#1F2937" }}>{user.email}</p>
          </div>

          {!isEditing ? (
            <>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    color: "#374151",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Full Name
                </label>
                <p style={{ fontSize: "18px", color: "#1F2937" }}>
                  {user.full_name || "Not set"}
                </p>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    color: "#374151",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Bio
                </label>
                <p style={{ fontSize: "18px", color: "#1F2937" }}>
                  {user.bio || "No bio yet"}
                </p>
              </div>

              <button
                onClick={handleEdit}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4F46E5",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <div>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    color: "#374151",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "2px solid #ccc",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    color: "#374151",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "2px solid #ccc",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontFamily: "inherit",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#10B981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={saving}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#EF4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Failed to load profile</p>
      )}
    </div>
  );
}
