package capstone.p2plend.util;

import java.io.File;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class EmailModule {

	private static final Logger LOGGER = LoggerFactory.getLogger(EmailModule.class);

	@Autowired
	public JavaMailSender emailSender;

	public void sendSimpleMessage(String to, String subject, String text) {
		try {
			LOGGER.info("CALL function send message");
			SimpleMailMessage message = new SimpleMailMessage();
			message.setTo(to);
			message.setSubject(subject);
			message.setText(text);
			emailSender.send(message);
		} catch (MailException e) {
			LOGGER.error("Error with function sendMessageWithAttachment", e);
		}
	}

	public void sendMessageWithAttachment(String to, String subject, String text, String pathToAttachment, String fileName) {
		try {
			LOGGER.info("CALL function send message with attachment");

			MimeMessage message = emailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(text);

			FileSystemResource file = new FileSystemResource(new File(pathToAttachment));
			helper.addAttachment(fileName, file);

			emailSender.send(message);
		} catch (MessagingException e) {
			LOGGER.error("Error with function sendMessageWithAttachment", e);
		}
	}
}