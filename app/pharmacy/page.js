// app/pharmacies/page.js
import { prisma } from "@/prisma/client";
import ClientPharmacyList from "./ClientPharmacyList";


export default async function PharmacyLocatorPage() {
  // Fetch all pharmacies from the database
  const pharmacies = await prisma.pharmacy.findMany();
  
  // Pass data to a client component for rendering
  return <ClientPharmacyList pharmacies={pharmacies} />;
}
