const getStoragePathFromUrl = (url) => {
  if (!url) return null;

  // remove query params (?t=...)
  const cleanUrl = url.split("?")[0];

  // split after '/weddings/'
  const parts = cleanUrl.split("/weddings/");

  return parts[1] || null;
};

export default getStoragePathFromUrl;