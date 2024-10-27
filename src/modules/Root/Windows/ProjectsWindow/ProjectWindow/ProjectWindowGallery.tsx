import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import React from "react";

interface ProjectWindowGalleryProps {
  images: StaticImageData[];
  color: string;
  onImageZoom: (imageSrc: string) => void;
}

const ProjectWindowGallery: React.FC<ProjectWindowGalleryProps> = ({
  images,
  color,
  onImageZoom: onClick,
}) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="w-full cursor-zoom-in overflow-hidden rounded-lg border-2"
          exit={{ scale: 0.8, opacity: 0 }}
          initial={{ scale: 0.8, opacity: 0, borderColor: `${color}00` }}
          whileHover={{ borderColor: color }}
          whileInView={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onClick(image.src)}
        >
          <Image
            alt={`Project image ${index + 1}`}
            height={image.height}
            layout="responsive"
            src={image}
            width={image.width}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectWindowGallery;
