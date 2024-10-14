import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { useOpenWindow } from "@/modules/WindowManager";
import { useWindowSize } from "@uidotdev/usehooks";

interface ProjectWindowGalleryProps {
  images: StaticImageData[];
}

const ProjectWindowGallery: React.FC<ProjectWindowGalleryProps> = ({
  images,
}) => {
  const openWindow = useOpenWindow();

  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const handleClick = (image: StaticImageData) => {
    const maxImageWidth = windowWidth
      ? Math.min(windowWidth * 0.8, image.width)
      : image.width;
    const maxImageHeight = windowHeight
      ? Math.min(windowHeight * 0.8, image.height)
      : image.height;

    let newWidth = image.width;
    let newHeight = image.height;

    if (image.width > maxImageWidth || image.height > maxImageHeight) {
      const widthRatio = maxImageWidth / image.width;
      const heightRatio = maxImageHeight / image.height;
      const scaleFactor = Math.min(widthRatio, heightRatio);

      newWidth = Math.round(image.width * scaleFactor);
      newHeight = Math.round(image.height * scaleFactor);
    }

    openWindow({
      title: "Galery Preview",
      children: () => (
        <div className="flex size-full max-h-[80vh] max-w-[80vw] items-center justify-center overflow-hidden rounded-lg">
          <Image
            src={image}
            alt="Project image"
            width={newWidth}
            height={newHeight}
          />
        </div>
      ),
      size: {
        width: `${newWidth + 32}px`,
        height: `${newHeight + 40 + 32}px`,
      },
      isFullscreenAllowed: false,
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="w-full cursor-zoom-in overflow-hidden rounded-lg"
          onClick={() => handleClick(image)}
        >
          <Image
            src={image}
            alt={`Project image ${index + 1}`}
            layout="responsive"
            width={image.width}
            height={image.height}
          />
        </div>
      ))}
    </div>
  );
};

export default ProjectWindowGallery;
