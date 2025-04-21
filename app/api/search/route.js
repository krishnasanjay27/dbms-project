import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query')?.trim() || '';

    let medicines;

    if (!query) {
      medicines = await prisma.medicine.findMany({ take: 10 });
    } else {
      medicines = await prisma.medicine.findMany({
        where: {
          medicine_name: {
            startsWith: query,
          }
        },
      });
    }

    // Get pharmacy stock for each medicine
    const results = await Promise.all(
      medicines.slice(0, 10).map(async (med) => {
        const pharmacyStocks = await prisma.pharmacyMedicineStock_.findMany({
          where: {
            Medicine_id: med.Medicine_id,
            stock_quantity: {
              gt: 0
            }
          },
          include: {
            Pharmacy: true,
          },
        });

        return {
          name: med.medicine_name,
          price: med.price,
          id: med.Medicine_id,
          pharmacies: pharmacyStocks.map(stock => ({
            id: stock.pharmacy_id,
            name: stock.Pharmacy.pharmacy_name,
            location: stock.Pharmacy.pharmacy_location,
            price: stock.selling_price,
            stock: stock.stock_quantity,
            stockId: stock.stock_id
          }))
        };
      })
    );

    return NextResponse.json({ results: results || [] });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search medicines: ' + error.message },
      { status: 500 }
    );
  }
}
