import Image from "next/image";

export default function Header() {
  return (
    <div className="bg-black w-full py-4 px-8 flex items-center gap-4">
      <div className="w-16 h-16">
        <Image
          src="/images/logos/LogoTDMP.png"
          alt="Logo Tempête de Metal Russe"
          width={64}
          height={64}
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <h1 className="text-2xl font-bold font-metal text-white">
          TEMPÊTE
          <br />
          DE MÉTAL RUSSE
        </h1>
      </div>
    </div>
  );
}
