import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Bienvenue sur la page d'accueil</h1>
      <p>Ceci est un exemple de page d'accueil utilisant Next.js.</p>
      <Link href="/map">Accéder à la carte</Link>
    </div>
  );
}
