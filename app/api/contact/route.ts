import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Loadout Lab <noreply@loadoutlab.com>',
        to: ['luke@loadoutlab.com'],
        reply_to: email,
        subject: `[Loadout Lab Contact] ${subject || 'New message from ' + name}`,
        html: `
          <div style="font-family:Arial,sans-serif;background:#000;padding:40px 20px;">
            <div style="max-width:520px;margin:0 auto;background:#09090b;border:1px solid #27272a;border-radius:12px;padding:40px;">
              <div style="height:2px;background:linear-gradient(90deg,#dc2626,transparent);border-radius:2px;margin-bottom:28px;"></div>
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:4px;color:#dc2626;font-weight:700;">NEW MESSAGE</p>
              <h1 style="margin:0 0 24px;font-size:24px;font-weight:900;color:#fff;letter-spacing:-1px;">LOADOUT LAB CONTACT</h1>

              <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;width:100px;">
                    <span style="font-size:10px;letter-spacing:2px;color:#52525b;font-family:monospace;">FROM</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <span style="color:#fff;font-size:14px;">${name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <span style="font-size:10px;letter-spacing:2px;color:#52525b;font-family:monospace;">EMAIL</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <a href="mailto:${email}" style="color:#dc2626;font-size:14px;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <span style="font-size:10px;letter-spacing:2px;color:#52525b;font-family:monospace;">SUBJECT</span>
                  </td>
                  <td style="padding:10px 0;border-bottom:1px solid #27272a;">
                    <span style="color:#fff;font-size:14px;">${subject || '—'}</span>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;color:#52525b;font-family:monospace;">MESSAGE</p>
              <div style="background:#000;border:1px solid #27272a;border-radius:8px;padding:16px;">
                <p style="margin:0;color:#a1a1aa;font-size:14px;line-height:1.7;white-space:pre-wrap;">${message}</p>
              </div>

              <p style="margin:24px 0 0;font-size:11px;color:#3f3f46;font-family:monospace;letter-spacing:1px;">
                Reply directly to this email to respond to ${name}.
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Resend error:', err);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
