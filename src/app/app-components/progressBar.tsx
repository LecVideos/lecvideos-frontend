"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const socket: Socket = io(process.env.NEXT_PUBLIC_ServerHost!, {
  transports: ["websocket"],
});

const ProgressBar = () => {
  const [progress, setProgress] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user?._id) {
      socket.emit("registerUser", user._id); // tell backend who we are
    }
    socket.on("uploadProgress", (data) => {
      const percent = Math.round(data.progress);
      setProgress(percent);
      setShow(true);

      if (percent >= 100) {
        // Optional: Hide progress bar after a delay
        setTimeout(() => setShow(false), 2000);
      }
    });

    return () => {
      socket.off("uploadProgress");
    };
  }, []);

  if (!show) return null;

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mt-4">
      <div
        className="bg-blue-500 h-full text-center text-xs text-white transition-all duration-300"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
