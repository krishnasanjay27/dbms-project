import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('medicine');

    if (!name) {
      return NextResponse.json({ error: 'No medicine name provided' }, { status: 400 });
    }

    const medicine = await prisma.medicine.findFirst({
      where: { Medicine_name: name },
      select: { Medicine_ID: true }
    });

    if (!medicine) {
      return NextResponse.json({ error: 'Medicine not found' }, { status: 404 });
    }

    const stocks = await prisma.stocks.findMany({
      where: { Medicine_ID: medicine.Medicine_ID },
      include: {
        Pharmacy: true
      }
    });

    const pharmacies = stocks.map(s => ({
      pharmacy: s.Pharmacy.Pharmacy_name,
      location: s.Pharmacy.Location,
      contact: s.Pharmacy.Contact,
      quantity: s.quantity,
    }));

    return NextResponse.json({ pharmacies });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
