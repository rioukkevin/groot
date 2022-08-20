import { RiGithubLine, RiLinkedinLine } from "react-icons/ri";
import { Link } from "./Link";

const ICON_SIZE = 24;

export const Socials = () => {
  return (
    <div className="flex justify-center items-center absolute top-0 right-0 p-6">
      <Link label="kevin@riou.pro" href="mailto:kevin@riou.pro"></Link>
      <a
        href="https://www.linkedin.com/in/k%C3%A9vinriou/"
        target="_blank"
        rel="noreferrer"
        className="ml-6 mx-3 hover:fill-primary hover:scale-110 hover:rotate-45 duration-100 rounded-full"
      >
        <RiLinkedinLine size={ICON_SIZE} className="fill-inherit" />
      </a>
      <a
        href="https://github.com/rioukkevin"
        target="_blank"
        rel="noreferrer"
        className="mx-3 hover:fill-primary hover:scale-110 hover:rotate-45 duration-100 rounded-full"
      >
        <RiGithubLine size={ICON_SIZE} className="fill-inherit" />
      </a>
    </div>
  );
};
