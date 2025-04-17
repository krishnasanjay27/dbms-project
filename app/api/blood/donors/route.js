import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { name, bloodGroup, contact } = await request.json();

    if (!name || !bloodGroup || !contact) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create a new donor record
    const donor = await prisma.donor.create({
      data: {
        name,
        blood_group: bloodGroup,
        contact,
        last_donation_date: new Date(),
        is_available: true
      }
    });

    return NextResponse.json({
      message: 'Donor registered successfully',
      donor: {
        id: donor.id,
        name: donor.name,
        bloodGroup: donor.blood_group,
        contact: donor.contact
      }
    });
  } catch (error) {
    console.error('Donor registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register donor' },
      { status: 500 }
    );
  }
}