import { NextRequest, NextResponse } from 'next/server';
import ClientModel from '@/models/client.model';
import { dbConnect } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();

        if (!body.name || !body.email) {
            return NextResponse.json(
                { success: false, message: 'Name and email are required' },
                { status: 400 },
            );
        }

        const client = await ClientModel.create({
            name: body.name,
            email: body.email,
            phone: body.phone || undefined,
            address: body.address || undefined,
            currency: body.currency || undefined,
        });

        return NextResponse.json({
            success: true,
            data: client,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to create client',
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
