"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";

interface Area {
  id: string;
  name: string;
  imgurl?: string | null;
  description?: string | null;
  type: string;
}

export default function AreasPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const res = await fetch("/api/areas");
        if (res.ok) {
          const data = await res.json();
          setAreas(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navigation />
      {/* Hero simple réutilisant le style */}
      <div className="relative h-[50vh] overflow-hidden">
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
        <div className="absolute inset-0">
          <Image
            src="/images/backgrounds/MontagneBG.png"
            alt="BG"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-end px-8 pb-12">
          <div>
            <div className="w-16 h-0.5 bg-white mb-6" />
            <h1 className="text-5xl font-metal font-bold tracking-wider">
              LES ESPACES
            </h1>
            <p className="mt-3 opacity-80 max-w-xl">
              Découvrez les différentes zones du festival et ce que vous pouvez
              y faire.
            </p>
          </div>
        </div>
      </div>

      {/* Fondu noir entre le background et la section */}
      <div className="relative h-32 bg-gradient-to-b from-transparent to-black">
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Grille des areas */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 font-metal text-center">
            LES EMPLACEMENTS
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
              <p className="mt-4 text-lg">Chargement des espaces...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {areas.map((area) => (
                <Link key={area.id} href={`/areas/${area.id}`} className="relative group">
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/20 to-cyan-500/20" />

                  <div className="relative bg-black/80 border border-blue-400/40 rounded-lg p-6 h-full hover:border-blue-400 transition-colors duration-300 flex flex-col cursor-pointer">
                    {/* Image */}
                    <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      {area.imgurl ? (
                        <Image
                          src={area.imgurl}
                          alt={area.name}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-4xl">📍</span>
                      )}
                    </div>

                    {/* Infos */}
                    <h3 className="text-xl font-bold mb-2 font-metal">
                      {area.name}
                    </h3>
                    {area.description && (
                      <p className="text-sm opacity-80 mb-4 line-clamp-3">
                        {area.description}
                      </p>
                    )}

                    {/* Type aligné bas */}
                    <div className="mt-auto pt-2">
                      <span className="px-3 py-1 bg-blue-600/20 border border-blue-400/30 rounded text-xs uppercase tracking-wide">
                        {area.type}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
