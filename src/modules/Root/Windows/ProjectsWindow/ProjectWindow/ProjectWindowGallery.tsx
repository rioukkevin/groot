import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { motion } from "framer-motion";

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
          onClick={() => onClick(image.src)}
          initial={{ scale: 0.8, opacity: 0, borderColor: `${color}00` }}
          whileInView={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          exit={{ scale: 0.8, opacity: 0 }}
          whileHover={{ borderColor: color }}
        >
          <Image
            src={image}
            alt={`Project image ${index + 1}`}
            layout="responsive"
            width={image.width}
            height={image.height}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectWindowGallery;
