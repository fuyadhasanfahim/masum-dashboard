import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import OrderModel from '@/models/order.model';
import '@/models/service.model';
import { dbConnect } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const { clientId, clientName, clientEmail, month, year, totalImages, totalPrice, currency, invoiceHtml } = body;

        if (!clientEmail) {
            return NextResponse.json(
                { success: false, message: 'Client email is required' },
                { status: 400 },
            );
        }

        // Fetch the orders for this client+month
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 1);

        const orders = await OrderModel.find({
            client: clientId,
            createdAt: { $gte: start, $lt: end },
        })
            .populate('service')
            .lean();

        // Build invoice HTML for email body
        const monthName = new Date(year, month - 1).toLocaleString('en-US', {
            month: 'long',
        });

        const orderRows = orders
            .map(
                (o) =>
                    `<tr>
                        <td style="padding:8px;border-bottom:1px solid #eee">${o.title || 'Untitled'}</td>
                        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${o.images || 0}</td>
                        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${currency}${(o.perImagePrice || 0).toFixed(2)}</td>
                        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${currency}${(o.totalPrice || 0).toFixed(2)}</td>
                    </tr>`,
            )
            .join('');

        const emailHtml = invoiceHtml || `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
                <h2 style="color:#7c3aed">Invoice</h2>
                <p><strong>Client:</strong> ${clientName}</p>
                <p><strong>Period:</strong> ${monthName} ${year}</p>
                <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
                <table style="width:100%;border-collapse:collapse">
                    <thead>
                        <tr style="background:#f9f9f9">
                            <th style="padding:8px;text-align:left">Order</th>
                            <th style="padding:8px;text-align:center">Images</th>
                            <th style="padding:8px;text-align:right">Per Image</th>
                            <th style="padding:8px;text-align:right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderRows}
                    </tbody>
                    <tfoot>
                        <tr style="font-weight:bold;border-top:2px solid #7c3aed">
                            <td style="padding:8px">Total</td>
                            <td style="padding:8px;text-align:center">${totalImages}</td>
                            <td style="padding:8px"></td>
                            <td style="padding:8px;text-align:right">${currency}${totalPrice.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
                <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
                <p style="color:#666;font-size:12px">This invoice was generated automatically.</p>
            </div>
        `;

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: clientEmail,
            subject: `Invoice — ${monthName} ${year}`,
            html: emailHtml,
        });

        return NextResponse.json({
            success: true,
            message: `Invoice sent to ${clientEmail}`,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to send invoice',
                error:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
