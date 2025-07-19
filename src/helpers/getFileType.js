// Helper function to determine the file type
const getFileType = (url) => {
  if (!url) return "image";
  const extension = url.split(".").pop().toLowerCase();
  switch (extension) {
    case "mp4":
      return "video";
    case "pdf":
      return "pdf";
    default:
      return "image";
  }
};

export default getFileType;
