const convertToWebP = (file, quality = 0.8) => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          const webpFile = new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
            type: "image/webp"
          });
          resolve(webpFile);
        },
        "image/webp",
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

export default convertToWebP;