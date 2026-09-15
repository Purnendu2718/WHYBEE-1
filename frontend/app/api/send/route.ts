import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'RESEND_API_KEY is not configured in environment variables.' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const studentName = body.studentName || 'ARYA PRATAP SOMVANSHI';
    const rollNo = body.rollNo || 'CS-2024-001';
    const recipientEmail = body.to || 'delivered@resend.dev';
    const alertType = body.type || 'attendance_risk';

    // HTML Email Template with UNIFLOW branding
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #1e1b4b; padding: 18px 24px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">UNIFLOW | Campus Automated Notification</h1>
        </div>
        
        <div style="padding: 0 4px;">
          <div style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; background-color: #fef3c7; color: #92400e; margin-bottom: 12px;">
            ⚠️ Academic / Attendance Notice
          </div>
          
          <h2 style="color: #0f172a; font-size: 18px; margin: 0 0 12px 0;">Official Student Progress Advisory</h2>
          
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
            This is an automated advisory notification from the UNIFLOW Academic Controller Office regarding student:
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Student Name:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${studentName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Roll Number:</td>
              <td style="padding: 8px 0; color: #0f172a; font-mono;">${rollNo}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Notice Type:</td>
              <td style="padding: 8px 0; color: #dc2626; font-weight: 600;">Attendance Advisory / Absence Alert</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Recorded On:</td>
              <td style="padding: 8px 0; color: #0f172a;">${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</td>
            </tr>
          </table>

          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px;">
            <p style="margin: 0; color: #334155; font-size: 13px; line-height: 1.5;">
              <strong>Note to Parents/Guardians:</strong> Please log into the <a href="https://whybeeeeproto1.netlify.app/auth/parent" style="color: #2563eb; font-weight: bold; text-decoration: underline;">UNIFLOW Parent Portal</a> to view the complete subject-wise marks breakdown and 30-day attendance timeline.
            </p>
          </div>

          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 12px;">
            Sent automatically by UNIFLOW College Management ERP. Please do not reply directly to this automated email.
          </p>
        </div>
      </div>
    `;

    // Resend free tier allows sending from onboarding@resend.dev
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'UNIFLOW Alerts <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: `[UNIFLOW Advisory] Attendance & Academic Notice: ${studentName} (${rollNo})`,
        html: htmlContent,
      }),
    });

    const resData = await res.json();

    if (!res.ok) {
      // If Resend free tier blocked recipient because it's not verified yet
      if (resData?.message?.includes('can only send testing emails to your own email address')) {
        return NextResponse.json({
          success: true,
          demoMode: true,
          message: `Resend Free Trial note: Email was generated successfully! Resend test accounts send to your registered email (${resData.message})`,
          details: resData,
        });
      }
      return NextResponse.json({ success: false, error: resData?.message || 'Failed to dispatch email' }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      id: resData.id,
      message: `Email alert successfully sent to ${recipientEmail}!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error while sending email' },
      { status: 500 }
    );
  }
}
