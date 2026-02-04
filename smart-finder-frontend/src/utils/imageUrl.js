// Utility to convert backend image path to full URL

export const getImageUrl = (path) => {
  if (!path) return "";
  return `http://localhost:5000${path}`;
};
