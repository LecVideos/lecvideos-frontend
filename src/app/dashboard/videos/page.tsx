"use client";
import { useEffect, useState } from "react";
import SearchBar from "@/app/dashboard/dashboard-components/searchbar";

interface Video {
  _id: string;
  title: string;
  youtubeUrl: string;
}

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ServerHost}/get-videos`);
      const data = await response.json();
      setVideos(data.videos);
      setFilteredVideos(data.videos);
    } catch (err) {
      console.error("Failed to load videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSearch = (query: string) => {
    const filtered = videos.filter((video) =>
      video.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredVideos(filtered);
  };

  return (
    <div>
        <div className="w-full flex justify-start mb-4">
            <div className="w-full md:w-2/3">
                <SearchBar onSearch={handleSearch} />
            </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {filteredVideos.map((video) => (
          <div key={video._id} className="bg-white rounded-md shadow p-4">
            <h2 className="text-lg font-semibold mb-2">{video.title}</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-64 rounded"
                src={video.youtubeUrl.replace("watch?v=", "embed/")}
                title={video.title}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
