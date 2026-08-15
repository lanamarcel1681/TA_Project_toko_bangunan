import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOtpEmail = async (to: string, otp: string) => {
    const mailOptions = {
        from: `"Toko Bangunan Lumbung Jaya" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Kode OTP Registrasi - TB. Lumbung Jaya',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #ea580c; text-align: center;">TB. Lumbung Jaya</h2>
                <h3 style="text-align: center;">Kode OTP Registrasi</h3>
                <p>Halo,</p>
                <p>Terima kasih telah mendaftar di TB. Lumbung Jaya. Untuk menyelesaikan proses registrasi Anda, silakan masukkan kode OTP berikut:</p>
                <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <p style="color: #ef4444; font-size: 14px;">Kode OTP ini hanya berlaku selama 5 menit. Jangan bagikan kode ini kepada siapapun.</p>
                <p>Jika Anda tidak meminta OTP ini, Anda dapat mengabaikan email ini.</p>
                <br />
                <p>Salam hangat,</p>
                <p><strong>Tim TB. Lumbung Jaya</strong></p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: 'Gagal mengirim email OTP' };
    }
};
