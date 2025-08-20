import {TableCards} from "@/app/(main)/dashboard/_components/table/table-cards";

export default async function AreaPage() {

    const res = await fetch(`http://localhost:3000/api/areas`, {
        headers: {
            "x-api-key": process.env.API_KEY!,
        },
        cache: "no-store",
    });
    const areas = await res.json();
    
  return (
    <div className="grid grid-cols-1">
      <TableCards data={areas} title={"Listing des zones"} description={"Ajouter, modifier ou supprimer des zones..."} />
    </div>
  );
}
