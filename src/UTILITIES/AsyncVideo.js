import { useEffect, useState } from "react";
import { storage_DownloadMedia } from "../Firebase";

export function AsyncVideo({ videoPath, width, height, radius }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    storage_DownloadMedia(videoPath, (url) => {
      setUrl(url);
    });
  }, [videoPath]);

  return (
    <div>
      {url !== null ? (
        <video
          src={url}
          controls
          style={{
            width: width,
            height: height,
            borderRadius: radius !== undefined ? radius : 10,
          }}
        />
      ) : (
        <div style={{ backgroundColor: "#C9CED8", borderRadius: "10px", width, height }}></div>
      )}
    </div>
  );
}
