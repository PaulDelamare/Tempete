"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Navigation from "@/components/Navigation";

interface Artist {
  id: string;
  name: string;
  nickname?: string;
  bio?: string;
  imgurl?: string;
  tagsJoin?: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch("/api/artists");
        if (response.ok) {
          const data = await response.json();
          console.log("Artistes récupérés:", data);
          setArtists(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des artistes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navigation />
      {/* Section Parallax avec les montagnes */}
      <div className="relative h-screen overflow-hidden">
        {/* Logo en haut à gauche */}
        <div className="absolute top-8 left-8 z-20 flex gap-4 flex-row items-center justify-center">
          <div className="w-30 h-30 shadow-lg">
            <Image
              src="/images/logos/LogoTDMP.png"
              alt="Logo Tempête de Metal Russe"
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="">
            <h1 className="text-3xl font-bold font-metal">
              TEMPÊTE
              <br />
              DE MÉTAL RUSSE
            </h1>
          </div>
        </div>
        {/* Arrière-plan - MontagneBG */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <Image
            src="/images/backgrounds/MontagneBG.png"
            alt="Montagnes arrière-plan"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Premier plan - MontagneFG */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        >
          <Image
            src="/images/backgrounds/MontagneFG.png"
            alt="Montagnes premier plan"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Ombre en bas de l'image FG */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0"></div>

        {/* Contenu principal centré */}
        <div className="relative z-10 flex flex-col justify-end h-full text-white px-50 pb-32">
          {/* Boîte flottante en bas à droite */}
          <div className="absolute bottom-8 right-40 z-20">
            <div className="relative w-96 h-80">
              <Image
                src="/images/borders/borders.png"
                alt="Border decoration"
                fill
                className="object-contain"
                style={{ objectPosition: "center" }}
              />
              <div className="absolute inset-0 flex flex-col px-6 gap-1 justify-center">
                <div className="flex flex-row justify-start">
                  <h1 className="text-2xl font-bold font-metal">ARTISTES</h1>
                </div>
                <div className="flex flex-row justify-center gap-6">
                  {(() => {
                    // Prendre les 2 premiers artistes (sauf BTS)
                    const firstTwo = artists
                      .filter((artist) => artist.name !== "BTS")
                      .slice(0, 2);

                    // Prendre BTS
                    const btsArtist = artists.find(
                      (artist) => artist.name === "BTS"
                    );

                    // Combiner les 3 artistes
                    const displayArtists = [...firstTwo];
                    if (btsArtist) {
                      displayArtists.push(btsArtist);
                    }

                    return displayArtists.map((artist, index) => (
                      <div
                        key={artist.id}
                        className="flex flex-col justify-center items-start w-24"
                      >
                        <div className="w-24 h-16 mb-2 relative">
                          {artist.imgurl && artist.imgurl !== "" ? (
                            <Image
                              src={artist.imgurl}
                              alt={artist.name}
                              fill
                              className="object-cover rounded-sm"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                e.currentTarget.nextElementSibling?.classList.remove(
                                  "hidden"
                                );
                              }}
                            />
                          ) : null}
                          <span
                            className={`text-2xl ${
                              artist.imgurl && artist.imgurl !== ""
                                ? "hidden"
                                : ""
                            }`}
                          >
                            🎸
                          </span>
                        </div>
                        <h1 className="font-bold text-md text-center font-metal">
                          {artist.name}
                        </h1>
                        {artist.nickname && (
                          <h1 className="text-xs text-left text-blue-400">
                            {artist.nickname}
                          </h1>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
          {/* Ligne décorative */}
          <div className="w-16 h-0.5 bg-white mb-8"></div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-5xl font-bold mb-4 tracking-wider font-metal">
            EXPÉRIMENTE
            <br />
            LE GEL DU
            <br />
            MÉTAL RUSSE
          </h1>

          {/* Bouton CTA */}
          <div className="relative mb-4 w-fit group">
            <button
              className="relative border-2 w-100 bg-white border-white text-black px-8 py-4 rounded-sm text-lg font-bold hover:bg-[#0D141F] hover:text-white transition-all duration-500 z-10 font-metal"
              onMouseEnter={(e) => {
                const button = e.currentTarget as HTMLElement;
                button.style.setProperty("--glow-opacity", "1");
                button.style.setProperty("--bg-color", "#0D141F");
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const button = e.currentTarget as HTMLElement;

                // Calculer la position relative pour le gradient
                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;

                button.style.setProperty("--mouse-x", `${xPercent}%`);
                button.style.setProperty("--mouse-y", `${yPercent}%`);
              }}
              onMouseLeave={(e) => {
                const button = e.currentTarget as HTMLElement;
                button.style.setProperty("--mouse-x", "50%");
                button.style.setProperty("--mouse-y", "50%");
                button.style.setProperty("--glow-opacity", "0");
                button.style.setProperty("--bg-color", "white");
              }}
              style={
                {
                  "--mouse-x": "50%",
                  "--mouse-y": "50%",
                  "--glow-opacity": "0",
                  "--bg-color": "white",
                  background: `linear-gradient(90deg, var(--bg-color) 0%, var(--bg-color) 100%) padding-box, 
                                  radial-gradient(circle 100px at var(--mouse-x) var(--mouse-y), 
                                  rgba(59, 130, 246, calc(1 * var(--glow-opacity))) 0%, 
                                  rgba(56, 142, 245, calc(0.8 * var(--glow-opacity))) 30%, 
                                  rgba(59, 130, 246, calc(0.4 * var(--glow-opacity))) 60%, 
                                  transparent 80%) border-box`,
                  border: "2px solid transparent",
                  boxShadow:
                    "0 0 20px rgba(59, 130, 246, calc(0.3 * var(--glow-opacity)))",
                  transition: "all 0.5s ease-in-out",
                } as React.CSSProperties
              }
            >
              ACHETER DES BILLETS
            </button>
          </div>

          {/* Texte descriptif */}
          <p className="max-w-100 text-md opacity-90 leading-relaxed">
            Plonge dans l&apos;atmosphère du métal russe et ressens la puissance
            de la vraie musique
          </p>
        </div>
      </div>

      {/* Section Artistes */}
      <div className="bg-black text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center font-metal">
            LES ARTISTES
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="mt-4 text-lg">Chargement des artistes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr">
              {artists.map((artist) => {
                // Déterminer la taille de la carte basée sur le contenu
                const hasImage = artist.imgurl && artist.imgurl !== "";
                const bioLength = artist.bio ? artist.bio.length : 0;
                const tagsCount = artist.tagsJoin ? artist.tagsJoin.length : 0;

                // Logique pour déterminer la taille
                let cardSize = "normal";
                if (hasImage && bioLength > 100 && tagsCount > 2) {
                  cardSize = "large"; // Grande carte pour les artistes avec beaucoup d'infos
                } else if (hasImage && (bioLength > 50 || tagsCount > 1)) {
                  cardSize = "medium"; // Carte moyenne pour les artistes avec quelques infos
                } else if (hasImage || bioLength > 30) {
                  cardSize = "small"; // Petite carte pour les artistes avec peu d'infos
                }

                return (
                  <div
                    key={artist.id}
                    className={`relative group ${
                      cardSize === "large"
                        ? "md:col-span-2 md:row-span-2"
                        : cardSize === "medium"
                        ? "lg:col-span-2"
                        : ""
                    }`}
                  >
                    {/* Bordure lumineuse */}
                    <div
                      className={`absolute inset-0 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        cardSize === "large"
                          ? "bg-gradient-to-br from-blue-500/30 to-purple-500/30"
                          : cardSize === "medium"
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20"
                          : "bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
                      }`}
                    ></div>

                    {/* Carte artiste */}
                    <div className="relative bg-black/80 border border-blue-400/50 rounded-lg p-6 hover:border-blue-400 transition-colors duration-300 h-full flex flex-col">
                      {/* Image de l'artiste */}
                      <div
                        className={`w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden ${
                          cardSize === "large"
                            ? "h-80"
                            : cardSize === "medium"
                            ? "h-72"
                            : "h-64"
                        }`}
                      >
                        {artist.imgurl && artist.imgurl !== "" ? (
                          <Image
                            src={artist.imgurl}
                            alt={artist.name}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              // En cas d'erreur de chargement, masquer l'image et afficher l'icône
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                        ) : null}
                        <span
                          className={`text-4xl ${
                            artist.imgurl && artist.imgurl !== ""
                              ? "hidden"
                              : ""
                          }`}
                        >
                          🎸
                        </span>
                      </div>

                      {/* Informations de l'artiste */}
                      <div className="flex-1">
                        <h3
                          className={`font-bold mb-2 font-metal ${
                            cardSize === "large"
                              ? "text-2xl"
                              : cardSize === "medium"
                              ? "text-xl"
                              : "text-lg"
                          }`}
                        >
                          {artist.name}
                        </h3>
                        {artist.nickname && (
                          <p className="text-sm text-blue-400 mb-2">
                            {artist.nickname}
                          </p>
                        )}
                        {artist.bio && (
                          <p className="text-sm opacity-75 mb-4 line-clamp-3">
                            {artist.bio}
                          </p>
                        )}
                      </div>

                      {/* Tags de l'artiste - alignés en bas */}
                      {artist.tagsJoin && artist.tagsJoin.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-auto pt-4">
                          {artist.tagsJoin.map((tagJoin) => (
                            <span
                              key={tagJoin.tag.id}
                              className="px-2 py-1 bg-blue-600/20 border border-blue-400/30 rounded text-xs"
                            >
                              {tagJoin.tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐦</span>
            <span className="text-sm">Sup / Tbotak</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📷</span>
            <span className="text-sm">@myfrottic.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
