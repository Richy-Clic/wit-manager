const getStoragePathFromUrl = (url) => {
  if (!url) return null;

  // remove query params (?t=...)
  const cleanUrl = url.split("?")[0];

  // split after '/events/'
  const parts = cleanUrl.split("/events/");

  return parts[1] || null;
};

export default getStoragePathFromUrl;