import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            clientName,
            clientEmail,
            month,
            year,
            totalImages,
            totalPrice,
            currency,
            pdfBase64,
            fileName,
        } = body;

        if (!clientEmail) {
            return NextResponse.json(
                { success: false, message: 'Client email is required' },
                { status: 400 },
            );
        }

        if (!pdfBase64) {
            return NextResponse.json(
                { success: false, message: 'Invoice PDF is required' },
                { status: 400 },
            );
        }

        const monthName = new Date(year, month - 1).toLocaleString('en-US', {
            month: 'long',
        });

        // Professional email body
        const emailHtml = `
            <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 0">
                <div style="background:#ea580c;padding:24px 32px;border-radius:8px 8px 0 0">
                    <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700">Masum Kamal</h1>
                    <p style="color:#fed7aa;margin:4px 0 0;font-size:13px;letter-spacing:0.5px">Graphics Designer</p>
                </div>

                <div style="background:#ffffff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
                    <p style="font-size:15px;color:#374151;margin:0 0 8px">Hello <strong>${clientName}</strong>,</p>
                    <p style="font-size:14px;color:#6b7280;margin:0 0 24px;line-height:1.6">
                        Please find attached your invoice for <strong>${monthName} ${year}</strong>.
                        Here is a quick summary of the billing details:
                    </p>

                    <table style="width:100%;border-collapse:collapse;margin:0 0 24px">
                        <tr>
                            <td style="padding:10px 16px;background:#f9fafb;border:1px solid #e5e7eb;color:#6b7280;font-size:13px;font-weight:600;width:50%">Period</td>
                            <td style="padding:10px 16px;background:#f9fafb;border:1px solid #e5e7eb;color:#1f2937;font-size:13px;font-weight:700">${monthName} ${year}</td>
                        </tr>
                        <tr>
                            <td style="padding:10px 16px;border:1px solid #e5e7eb;color:#6b7280;font-size:13px;font-weight:600">Total Images</td>
                            <td style="padding:10px 16px;border:1px solid #e5e7eb;color:#1f2937;font-size:13px;font-weight:700">${totalImages}</td>
                        </tr>
                        <tr>
                            <td style="padding:10px 16px;background:#f9fafb;border:1px solid #e5e7eb;color:#6b7280;font-size:13px;font-weight:600">Total Amount</td>
                            <td style="padding:10px 16px;background:#f9fafb;border:1px solid #e5e7eb;color:#ea580c;font-size:15px;font-weight:700">${currency}${Number(totalPrice).toFixed(2)}</td>
                        </tr>
                    </table>

                    <p style="font-size:14px;color:#6b7280;margin:0 0 8px;line-height:1.6">
                        The detailed invoice is attached as a PDF to this email. If you have any questions regarding
                        the invoice, please feel free to reply to this email.
                    </p>

                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>

                    <p style="color:#9ca3af;font-size:12px;margin:0;text-align:center">
                        This invoice was generated automatically. Thank you for your business.
                    </p>
                </div>
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
            subject: `Invoice — ${monthName} ${year} | Masum Kamal`,
            html: emailHtml,
            attachments: [
                {
                    filename: fileName || `Invoice-${monthName}-${year}.pdf`,
                    content: Buffer.from(pdfBase64, 'base64'),
                    contentType: 'application/pdf',
                },
            ],
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
