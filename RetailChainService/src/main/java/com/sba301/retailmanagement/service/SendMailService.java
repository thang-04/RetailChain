package com.sba301.retailmanagement.service;

import com.sba301.retailmanagement.config.SendGridProperties;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j(topic = "email_service")
public class SendMailService {
    private final SendGrid sendGrid;
    private final SendGridProperties sendGridProperties;

    public void sendOtpEmail(String to, String subject, String otpCode) {
        Email fromEmail = new Email(sendGridProperties.getFromEmail(), "Retail Chain Admin Support");

        Email toEmail = new Email(to);

        String htmlBody = buildHtmlTemplate(otpCode);
        Content content = new Content("text/html", htmlBody);

        Mail mail = new Mail(fromEmail, subject, toEmail, content);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() == 202) {
                log.info("Đã gửi email OTP thành công đến: {}", to);
            } else {
                log.error("Gửi email thất bại! Status: {}, Body lỗi: {}", response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            log.error(" Lỗi kết nối hoặc gửi email: ", e);
        }
    }

    public void sendWelcomeEmail(String to, String fullName, String temporaryPassword) {
        Email fromEmail = new Email(sendGridProperties.getFromEmail(), "Retail Chain System");
        Email toEmail = new Email(to);
        String subject = "Chào mừng bạn đến với Retail Chain - Thông tin tài khoản";

        String htmlBody = buildWelcomeHtmlTemplate(fullName, to, temporaryPassword);
        Content content = new Content("text/html", htmlBody);

        Mail mail = new Mail(fromEmail, subject, toEmail, content);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sendGrid.api(request);
            if (response.getStatusCode() == 202) {
                log.info("Đã gửi email chào mừng thành công đến: {}", to);
            } else {
                log.error("Gửi email chào mừng thất bại! Status: {}, Body: {}", response.getStatusCode(),
                        response.getBody());
            }
        } catch (Exception e) {
            log.error("Lỗi gửi email chào mừng: ", e);
        }
    }

    private String buildWelcomeHtmlTemplate(String fullName, String email, String password) {
        return "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;\">"
                +
                "<h2 style=\"color: #00466a; text-align: center;\">Chào mừng đến với Retail Chain!</h2>" +
                "<p>Xin chào <strong>" + fullName + "</strong>,</p>" +
                "<p>Tài khoản của bạn đã được khởi tạo trên hệ thống Retail Chain. Vui lòng sử dụng thông tin dưới đây để đăng nhập lần đầu:</p>"
                +
                "<div style=\"background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;\">" +
                "<p style=\"margin: 5px 0;\"><strong>Email:</strong> " + email + "</p>" +
                "<p style=\"margin: 5px 0;\"><strong>Mật khẩu tạm thời:</strong> <span style=\"color: #e63946; font-size: 1.2em; font-weight: bold;\">"
                + password + "</span></p>" +
                "</div>" +
                "<p style=\"color: #e63946;\"><em>* Vì lý do bảo mật, bạn bắt buộc phải đổi mật khẩu ngay sau khi đăng nhập lần đầu.</em></p>"
                +
                "<div style=\"text-align: center; margin-top: 30px;\">" +
                "<a href=\"http://localhost:5173/login\" style=\"background: #00466a; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;\">Đăng nhập ngay</a>"
                +
                "</div>" +
                "<p style=\"font-size: 0.9em; color: #777; margin-top: 30px;\">Trân trọng,<br/>Đội ngũ quản trị Retail Chain</p>"
                +
                "</div>";
    }

    private String buildHtmlTemplate(String otpCode) {
        return "<div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">" +
                "<div style=\"margin:50px auto;width:70%;padding:20px 0\">" +
                "<div style=\"border-bottom:1px solid #eee\">" +
                "<a href=\"\" style=\"font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600\">Retail Chain System</a>"
                +
                "</div>" +
                "<p style=\"font-size:1.1em\">Xin chào,</p>" +
                "<p>Cảm ơn bạn đã sử dụng hệ thống của chúng tôi. Dưới đây là mã xác thực (OTP) của bạn. Mã này có hiệu lực trong vòng 2 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>"
                +
                "<h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;\">"
                + otpCode + "</h2>" +
                "<p style=\"font-size:0.9em;\">Trân trọng,<br />Đội ngũ phát triển</p>" +
                "<hr style=\"border:none;border-top:1px solid #eee\" />" +
                "<div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">" +
                "<p>Retail Chain Inc</p>" +
                "<p>Hà Nội, Việt Nam</p>" +
                "</div>" +
                "</div>" +
                "</div>";
    }
}
