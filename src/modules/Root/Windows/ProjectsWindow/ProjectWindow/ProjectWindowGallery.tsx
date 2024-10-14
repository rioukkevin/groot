import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";

interface ProjectWindowGalleryProps {
  images: StaticImageData[];
}

const ProjectWindowGallery: React.FC<ProjectWindowGalleryProps> = ({
  images,
}) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {images.map((image, index) => (
        <div key={index} className="w-full overflow-hidden rounded-lg">
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
