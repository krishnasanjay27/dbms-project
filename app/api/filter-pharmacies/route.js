import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const medicineName = searchParams.get('medicineName') || '';
    const minStock = parseInt(searchParams.get('minStock') || '0', 10);
    const minPrice = parseInt(searchParams.get('minPrice') || '0', 10);
    const maxPrice = parseInt(searchParams.get('maxPrice') || '100000', 10);

    // Call the stored procedure using Prisma's $queryRawUnsafe
    const results = await prisma.$queryRawUnsafe(
      `CALL GetPharmaciesByMedicineAndFilters(?, ?, ?, ?)`,
      medicineName,
      minStock,
      minPrice,
      maxPrice
    );

    console.log('Stored procedure results:', JSON.stringify(results, null, 2));

    // Find the medicine details to include in the response
    let medicineDetails = null;
    if (medicineName) {
      const medicine = await prisma.medicine.findFirst({
        where: {
          medicine_name: {
            contains: medicineName
          }
        }
      });
      
      if (medicine) {
        medicineDetails = {
          id: medicine.Medicine_id,
          name: medicine.medicine_name,
          price: medicine.price
        };
      }
    }

    // Extract pharmacies from results and ensure it's an array
    let pharmacies = [];
    if (results && results.length > 0 && Array.isArray(results)) {
      // First, get all pharmacy names from the results to do a bulk lookup
      const pharmacyNames = results.map(item => item.f0).filter(Boolean);
      
      // Lookup all the pharmacies by name to get their IDs
      const pharmacyData = await prisma.pharmacy.findMany({
        where: {
          pharmacy_name: {
            in: pharmacyNames
          }
        },
        select: {
          pharmacy_id: true,
          pharmacy_name: true
        }
      });
      
      // Create a lookup map for pharmacy names to IDs
      const pharmacyIdMap = {};
      pharmacyData.forEach(p => {
        pharmacyIdMap[p.pharmacy_name] = p.pharmacy_id;
      });

      // Map the generic field names to proper field names with the pharmacy ID
      pharmacies = results.map(item => {
        const pharmacy_name = item.f0;
        return {
          pharmacy_id: pharmacyIdMap[pharmacy_name] || null,
          pharmacy_name: pharmacy_name,
          pharmacy_location: item.f1,
          pharmacy_contact: item.f2,
          operating_hours: item.f3,
          stock_quantity: item.f4,
          selling_price: item.f5
        };
      }).filter(p => p.pharmacy_id !== null); // Filter out any without a valid ID
    }

    console.log('Extracted pharmacies:', pharmacies.length);

    return NextResponse.json({
      medicine: medicineDetails,
      pharmacies: pharmacies
    });
  } catch (error) {
    console.error('Filter error:', error);
    return NextResponse.json(
      { error: 'Failed to filter pharmacies: ' + error.message },
      { status: 500 }
    );
  }
}