"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
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
            <h1 className="text-3xl font-bold">
              TEMPETE DE
              <br />
              METAL RUSSE
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
                  <h1 className="text-2xl font-bold">ARTISTS</h1>
                </div>
                <div className="flex flex-row justify-center gap-6">
                  <div className="flex flex-col justify-center items-start w-24">
                    <div className="w-24 h-16 mb-2 relative">
                      <Image
                        src="/images/others/artist1.jpg"
                        alt="Artist 1"
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                    <h1 className="font-bold text-md text-center">GROUP1</h1>
                    <h1 className="text-xs text-left">Lorem ipsum</h1>
                  </div>
                  <div className="flex flex-col justify-center items-start w-24">
                    <div className="w-24 h-16 mb-2 relative">
                      <Image
                        src="/images/others/artist2.jpg"
                        alt="Artist 2"
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                    <h1 className="font-bold text-md text-center">GROUP2</h1>
                    <h1 className="text-xs text-left">Lorem ipsum</h1>
                  </div>
                  <div className="flex flex-col justify-center items-start w-24">
                    <div className="w-24 h-16 mb-2 relative">
                      <Image
                        src="/images/others/artist3.jpg"
                        alt="Artist 3"
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                    <h1 className="font-bold text-md text-center">GROUP3</h1>
                    <h1 className="text-xs text-left">Lorem ipsum</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Ligne décorative */}
          <div className="w-16 h-0.5 bg-white mb-8"></div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-5xl font-bold mb-4 tracking-wider">
            EXPERIENCE THE
            <br />
            FROSTBITE OF
            <br />
            RUSSIAN METAL
          </h1>

          {/* Bouton CTA */}
          <div className="relative mb-4 w-fit group">
            <button
              className="relative border-2 w-100 bg-white border-white text-black px-8 py-4 rounded-sm text-lg font-bold hover:bg-[#0D141F] hover:text-white transition-all duration-500 z-10"
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
              BUY TICKETS
            </button>
          </div>

          {/* Texte descriptif */}
          <p className="max-w-100 text-md opacity-90 leading-relaxed">
            Lornizat datoreroot ernst pitics nude artiforooro ctle efectens ce
            m00nsure an oceros παπο ανοspotre
          </p>
        </div>
      </div>

      {/* Section Concerts */}
      <div className="bg-black text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Concert 221 */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            {/* Colonne gauche */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center md:text-left">
                CONCERT 221
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    name: "ΒΙΙΟΤΕ 1 ΑΛΙΕ",
                    role: "Оми роля",
                    detail: "ска река",
                  },
                  {
                    name: "GLANITE FABRE",
                    role: "Соки онез",
                    detail: "Sd Ane",
                  },
                  { name: "BATTLEAN", role: "Cove", detail: "Co pre" },
                ].map((member, index) => (
                  <div key={index} className="text-center">
                    <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <p className="font-semibold text-sm">{member.name}</p>
                    <p className="text-xs opacity-75">{member.role}</p>
                    <p className="text-xs opacity-75">{member.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne droite avec bordure lumineuse */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-sm blur-sm"></div>
              <div className="relative bg-black/80 border border-blue-400/50 rounded-sm p-8">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  CONCERT 221
                </h2>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    {
                      name: "GLANITE FABRE",
                      role: "Соки онез",
                      detail: "Sd Ane",
                    },
                    { name: "BATTLEAN", role: "Cove", detail: "Co pre" },
                    { name: "PAISERLINE", role: "Metal", detail: "Core" },
                  ].map((member, index) => (
                    <div key={index} className="text-center">
                      <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                      <p className="font-semibold text-sm">{member.name}</p>
                      <p className="text-xs opacity-75">{member.role}</p>
                      <p className="text-xs opacity-75">{member.detail}</p>
                      {index === 2 && (
                        <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-sm text-xs hover:bg-blue-700 transition-colors">
                          BUY TICKETS
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Concert 22N */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">CONCERT 22N</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "RAJTLIRS", role: "Cove", detail: "Co pre" },
                { name: "BATTLEAN", role: "Metal", detail: "Core" },
                { name: "PAISERLINE", role: "Heavy", detail: "Rock" },
              ].map((band, index) => (
                <div key={index} className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">🎸</span>
                  </div>
                  <p className="font-bold text-lg">{band.name}</p>
                  <p className="text-sm opacity-75">{band.role}</p>
                  <p className="text-sm opacity-75">{band.detail}</p>
                </div>
              ))}
            </div>
          </div>
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
