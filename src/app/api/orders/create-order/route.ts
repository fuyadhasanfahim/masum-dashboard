import { NextRequest, NextResponse } from 'next/server';
import OrderModel from '@/models/order.model';
import { dbConnect } from '@/lib/db';
import { getRequiredSession } from '@/lib/auth-helper';

export async function POST(req: NextRequest) {
    try {
        const { session, response } = await getRequiredSession();
        if (response) return response;

        await dbConnect();
        
        const body = await req.json();

        const order = await OrderModel.create({
            user: session.user.id,
            client: body.client || undefined,
            service: body.service || undefined,
            title: body.title || undefined,
            images: body.images || [],
            downloadLink: body.downloadLink || undefined,
            localFileLocation: body.localFileLocation || undefined,
            perImagePrice: body.perImagePrice || undefined,
            totalPrice: body.totalPrice || undefined,
            date: body.date || undefined,
        });

        return NextResponse.json({
            success: true,
            data: order,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to create order',
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
