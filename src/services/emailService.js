require('dotenv').config();
import nodemailer from 'nodemailer';

let sendVerificationEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: `Hoàng Quốc Việt`,
        to: dataSend.recipientEmail,
        subject:
            dataSend.language === 'vi'
                ? 'Thông tin đặt lịch khám bệnh'
                : 'Information on scheduling medical examinations',
        html: buildHTMLVerificationEmail(dataSend),
    });
};

const buildHTMLVerificationEmail = (dataSend) => {
    if (dataSend.language === 'vi') {
        return `
            <h3>Xin chào ${dataSend.patientLastName} ${dataSend.patientFirstName}!</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Heyoy.</p>
            <div>Thông tin đặt lịch khám bệnh:</div>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
            <div>Nếu các thông tin trên là đúng. Vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</div>
            <div><a href="${dataSend.href}" target="_blank">Click here</a></div>            
            <div>Xin chân thành cảm ơn!</div>
        `;
    } else if (dataSend.language === 'en') {
        return `
            <h3>Hello ${dataSend.patientFirstName} ${dataSend.patientLastName}!</h3>
            <p>You received this email because you booked an online medical appointment on Heyoy.</p>
            <div>Information for scheduling medical examination:</div>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>
            <div>If the above information is correct. Please click on the link below to confirm and complete the medical appointment booking procedure.</div>
            <div><a href="${dataSend.href}" target="_blank">Click here</a></div>            
            <div>Sincerely thank!</div>
        `;
    }
};

let sendInvoiceAndRemedyEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: `Hoàng Quốc Việt`,
        to: dataSend.recipientEmail,
        subject:
            dataSend.language === 'vi'
                ? 'Thông tin đặt lịch khám bệnh'
                : 'Information on scheduling medical examinations',
        html: buildHTMLInvoiceAndRemedyEmail(dataSend),
        attachments: [
            {
                filename: 'file.png',
                content: dataSend.image.split('base64,')[1],
                encoding: 'base64',
            },
        ],
    });
};

const buildHTMLInvoiceAndRemedyEmail = (dataSend) => {
    if (dataSend.language === 'vi') {
        return `
            <h3>Xin chào ${dataSend.patientLastName} ${dataSend.patientFirstName}!</h3>
            <p>Bạn nhận được email này vì đã khám bệnh xong tại Heyoy.</p>
            <p>Hoá đơn/đơn thuốc của bạn trong tệp đính kèm:</p>

            <div>Xin chân thành cảm ơn!</div>
        `;
    } else if (dataSend.language === 'en') {
        return `
            <h3>Hello ${dataSend.patientFirstName} ${dataSend.patientLastName}!</h3>
            <p>You are receiving this email because you have completed your medical examination at Heyoy.</p>
            <p>Your invoice/prescription is in the attached file:</p>  

            <div>Sincerely thank!</div>
        `;
    }
};

module.exports = {
    sendVerificationEmail,
    sendInvoiceAndRemedyEmail,
};
