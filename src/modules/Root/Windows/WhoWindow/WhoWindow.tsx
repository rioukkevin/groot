import Image from "next/image";

import IMGMe from "@/assets/me.png";

export const WhoWindow = () => {
  return (
    <div className="flex w-[400px] flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <Image
          src={IMGMe}
          alt="Kevin"
          width={350}
          height={350}
          quality={100}
          className="grayscale"
        />
        <h1 className="text-pretty text-5xl font-light uppercase">
          Fullstack web developer
        </h1>
        <hr className="w-full border-neutral-200/50" />
        <div className="flex w-full items-stretch justify-evenly gap-2">
          <div className="flex flex-col items-center">
            <p className="text-5xl font-light">7+</p>
            <p className="text-sm font-extrabold">Years of exp.</p>
          </div>
          <div className="w-[1px] bg-neutral-200/50" />
          <div className="flex flex-col items-center">
            <p className="text-5xl font-light">40+</p>
            <p className="text-sm font-extrabold">Projects</p>
          </div>
        </div>
        <hr className="w-full border-neutral-200/50" />
        <h2 className="w-full text-lg font-bold uppercase">About</h2>
        <p className="w-full">
          Hi, I&apos;m Kevin, a passionate{" "}
          <strong>Fullstack Web Developer</strong> with a strong focus on{" "}
          <strong>front-end technologies</strong> and solid{" "}
          <strong>back-end experience</strong>. As a freelance professional, I
          create <strong>innovative digital solutions</strong> across the entire
          web development spectrum. I craft{" "}
          <strong>seamless, efficient, and user-friendly applications</strong>{" "}
          from concept to deployment.
        </p>
        <p>
          I love <strong>experimenting</strong> and pushing the boundaries of
          web technology. I turn <strong>complex challenges</strong> into{" "}
          <strong>elegant, scalable solutions</strong>, from building{" "}
          <strong>responsive UIs</strong> to optimizing{" "}
          <strong>server-side performance</strong>. My enthusiasm for front-end
          development, combined with comprehensive full-stack knowledge, enables
          me to deliver <strong>holistic web experiences</strong> that exceed
          expectations. I&apos;m always excited to collaborate on innovative
          projects and create{" "}
          <strong>impactful, experiential web solutions</strong>.
        </p>
      </div>
    </div>
  );
};
