import { useEffect, useState } from "react";
import { storage_DownloadMedia } from "../Firebase ";

export function AsyncImage({ imagePath, width, height, radius }) {
  const [url, setUrl] = useState(null);
  async function doThing() {
    await storage_DownloadMedia(imagePath, (downloadedUrl) => {
      setUrl(downloadedUrl);
    });
  }
  useEffect(() => {
    if (imagePath) {
      doThing()
    }
  }, [imagePath, url]);
  return (
    <div>
      {url !== null ? (
        <div>
          <img
            src={url}
            style={{
              width: width,
              height: height,
              borderRadius: radius !== undefined ? radius : 10,
              objectFit: "cover",
            }}
          />
        </div>
      ) : (
        <div style={{ backgroundColor: "#C9CED8", borderRadius: "10px" }}></div>
      )}
    </div>
  );
}
