"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <nav
      style={{
        backgroundColor: "#4F46E5",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <a href="/">
        <h2
          style={{
            color: "white",
            margin: 0,
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          FriendSync
        </h2>
      </a>
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {user ? (
          <>
            <a href="/" style={{ textDecoration: "none" }}>
              <span style={{ color: "white", fontSize: "16px" }}>Home</span>
            </a>

            <a href="/feed" style={{ textDecoration: "none" }}>
              <span style={{ color: "white", fontSize: "16px" }}>Feed</span>
            </a>

            <a href="/posts" style={{ textDecoration: "none" }}>
              <span style={{ color: "white", fontSize: "16px" }}>
                Create Post
              </span>
            </a>

            <a href="/profile" style={{ textDecoration: "none" }}>
              <span style={{ color: "white", fontSize: "16px" }}>Profile</span>
            </a>

            <span style={{ color: "white", fontSize: "16px" }}>
              {user.username}
            </span>

            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                backgroundColor: "#EF4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/register" style={{ textDecoration: "none" }}>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#10B981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                Register
              </button>
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
