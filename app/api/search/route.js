
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
          Medicine_name: {
            startsWith: query,
          },
        },
      });
    }

    const results = medicines.slice(0, 10).map((med) => ({
      name: med.Medicine_name,
      price: med.Price,
      stock: med.Stock,
      id: med.Medicine_ID,
      availability: med.Availability || [],
    }));

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search medicines: ' + error.message },
      { status: 500 }
    );
  }
}
