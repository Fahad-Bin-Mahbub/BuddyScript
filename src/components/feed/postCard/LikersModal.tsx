"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Liker {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

interface LikersModalProps {
  type: "post" | "comment";
  id: string;
  onClose: () => void;
}

export default function LikersModal({ type, id, onClose }: LikersModalProps) {
  const [likers, setLikers] = useState<Liker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikers = async () => {
      try {
        const url =
          type === "post"
            ? `/api/posts/${id}/like`
            : `/api/comments/${id}/like`;
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        if (data.success) setLikers(data.data);
      } catch (err) {
        console.error("Fetch likers error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLikers();
  }, [type, id]);

  return (
    <div className="fixed inset-0 bg-black/50 z-9999 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-bg2 rounded-[10px] w-full max-w-90 max-h-100 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between px-5 py-4 border-b border-border2">
          <h4 className="text-[16px] font-medium text-dark2">
            👍 Likes
          </h4>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-bg3 transition-colors text-gray"
          >
            ✕
          </button>
        </div>


        <div className="overflow-y-auto max-h-75 p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : likers.length === 0 ? (
            <p className="text-center text-[14px] text-gray py-8">No likes yet</p>
          ) : (
            <div className="space-y-3">
              {likers.map((liker) => (
                <div key={liker._id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={liker.avatar || "/images/profile.png"}
                      alt={`${liker.firstName} ${liker.lastName}`}
                      width={36}
                      height={36}
                      className="object-cover"
                    />
                  </div>
                  <h4 className="text-[14px] font-medium text-dark2">
                    {liker.firstName} {liker.lastName}
                  </h4>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
