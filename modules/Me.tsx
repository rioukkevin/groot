import { useContext } from "react";
import { SettingsContext } from "../components/Settings";
import { Title } from "../components/Title";

export const ModuleMe = () => {
  const { isATech } = useContext(SettingsContext);

  return (
    <section className="w-full flex flex-col justify-between items-stretch">
      <Title value="Qui suis-je ?" />
      <p className="w-2/3 text-justify my-6">
        Actuellement développeur web dans une petite startup nommée{" "}
        <strong>Alpha8</strong>, je suis aussi un <strong>indépendant</strong>{" "}
        pour des missions occasionnelles mais surtout, je suis développeur
        d&apos;utilitaires <strong>open-source</strong> pour le quotidien des
        développeurs et des joueurs.
      </p>
      <p className="w-2/3 self-end text-justify my-6">
        Passionné par <strong>l&apos;automobile</strong>, le{" "}
        <strong>développement</strong> et les <strong>jeux vidéos</strong>, ces
        éléments font partie de mon quotidien. Lorsque je peux, je développe des
        outils pour répondre à mes besoins ou ceux que je rencontre en
        entreprise ainsi que dans les communautés de <strong>twitch</strong> que
        je fréquente.
      </p>
      <p className="w-2/3 text-justify my-6">
        Enfin, je suis friands des <strong>meetups</strong> pour y acquérir de
        nouvelles connaissances y compris sur des sujets non liés au
        développement.
      </p>
      {isATech && (
        <>
          <p className="w-2/3 self-end text-justify my-6 text-secondary">
            Que ce soit du frontend ou du backend, si c&apos;est dans
            l&apos;environnement <strong>JS</strong>, je suis votre homme. Pour
            l&apos;hébergement pas de problèmes non plus, une infra à mettre en
            place ? je peux m&apos;y ateler, une exploitation de{" "}
            <strong>Docker avec/sans kubernetes</strong>, j&apos;adore, helm en
            plus pour le templating de kub, quel <strong>bonheur</strong> !
          </p>
        </>
      )}
    </section>
  );
};
