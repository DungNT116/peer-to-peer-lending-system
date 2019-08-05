package capstone.p2plend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import capstone.p2plend.service.EmailService;



@Controller
public class MailController {

	@Autowired
	EmailService emailService;
	
	@Scheduled(cron = "0 55 15 * * ?")
	public void sendMailReminder() {
		try {
			emailService.sendSimpleMessage("adlerkov@gmail.com", "test send mail", "scheduler send mail");	
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		
	}
	
}
