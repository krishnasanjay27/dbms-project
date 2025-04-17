import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const bloodGroup = searchParams.get('group');
    console.log('Searching for blood group:', bloodGroup);

    if (!bloodGroup) {
      return NextResponse.json({ error: 'Blood group is required' }, { status: 400 });
    }

    // Fetch blood banks that have this blood group with available stock
    const bloodBanks = await prisma.blood_bank.findMany({
      where: {
        blood_stock: {
          some: {
            AND: [
              { blood_group: bloodGroup },
              { stock_quantity: { gt: 0 } }
            ]
          }
        }
      },
      include: {
        blood_stock: {
          where: {
            AND: [
              { blood_group: bloodGroup },
              { stock_quantity: { gt: 0 } }
            ]
          },
          select: {
            stock_quantity: true
          }
        }
      }
    });

    const formattedBanks = bloodBanks.map(bank => ({
      name: bank.blood_bank_name,
      location: bank.location,
      contact: bank.contact,
      availableUnits: bank.blood_stock[0]?.stock_quantity || 0
    }));

    return NextResponse.json({ 
      bloodBanks: formattedBanks,
      totalAvailable: formattedBanks.length
    });
  } catch (error) {
    console.error('Error in blood search:', error);
    return NextResponse.json({ error: 'Failed to search blood banks' }, { status: 500 });
  }
}
