package capstone.p2plend.util;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import capstone.p2plend.entity.Deal;
import capstone.p2plend.entity.Milestone;
import capstone.p2plend.entity.Request;
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.RequestRepository;
import capstone.p2plend.service.EmailService;

@Component
public class Scheduler {

	@Autowired
	EmailService emailService;

	@Autowired
	RequestRepository requestRepo;

//	@Scheduled(cron = "* * * * * ?")
//	public void testScheduler() {				
//		System.out.println("run ..");
//	}

	@Scheduled(cron = "0 0 4 * * ?")
	public void sendMailScheduler() {
		try {
			System.out.println("Start scaning system...");
			List<Request> lstRequest = requestRepo.findAllRequestByStatus("trading");
			for (int i = 0; i < lstRequest.size(); i++) {
				Request r = lstRequest.get(i);
				Deal deal = r.getDeal();
				User borrower = r.getBorrower();
				User lender = r.getLender();
				List<Milestone> lstMilestone = deal.getMilestone();
				for (int x = 0; x < lstMilestone.size(); x++) {
					Milestone m = lstMilestone.get(x);
					if (m.getPercent() == null) {
						continue;
					}
					Long time = m.getPresentDate() * 1000;
					Timestamp stamp = new Timestamp(time);
					Date deadLine = new Date(stamp.getTime());
					Date currentDate = new Date();
					System.out.println("Current system date checking for deadline: " + currentDate);
					Long diff = deadLine.getTime() - currentDate.getTime();
					if (TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS) >= 3 && m.getTransaction() == null) {
						if (m.getType().equalsIgnoreCase("lend")) {
							emailService.sendSimpleMessage(lender.getEmail(),
									"PPLS Remind Deadline of the current lend for loan request(lender)",
									"Your current lend deadline is near, Deadline" + deadLine + ", you have "
											+ TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS)
											+ " to complete this trasaction, Login to our website to make the transaction for request number: "
											+ r.getId());
							emailService.sendSimpleMessage(borrower.getEmail(),
									"PPLS Remind Deadline of the current lend for loan request(borrower)",
									"The payment for lend of request number " + r.getId()
											+ " still not yet done, User: " + r.getLender() + "still have "
											+ TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS)
											+ "to lend you money or will be fined, Deadline: " + deadLine);
						}
						if (m.getType().equalsIgnoreCase("payback")) {
							emailService.sendSimpleMessage(lender.getEmail(),
									"PPLS Remind Deadline of the current payback for loan request(lender)",
									"The payment for payback of request number " + r.getId()
											+ " still not yet done, User: " + r.getBorrower() + "still have "
											+ TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS)
											+ "to payback you money or will be fined, Deadline: " + deadLine);
							emailService.sendSimpleMessage(borrower.getEmail(),
									"PPLS Remind Deadline of the current payback for loan request(borrower)",
									"Your current payback deadline is near, Deadline" + deadLine + ", you have "
											+ TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS)
											+ " to complete this trasaction, Login to our website to make the transaction for request number: "
											+ r.getId());
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Scheduled(cron = "0 0 1 * * ?")
	public void deletePendingRequestWhenExpired() {
		try {
			System.out.println("Start scaning system...");
			List<Request> lstRequest = requestRepo.findAllRequestByStatus("pending");
			for (int i = 0; i < lstRequest.size(); i++) {
				Request r = lstRequest.get(i);
				Long time = r.getCreateDate() * 1000;
				Timestamp stamp = new Timestamp(time);
				Date createDate = new Date(stamp.getTime());
				Date currentDate = new Date();
				Long diff = currentDate.getTime() - createDate.getTime();
				if(TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS) > 5) {
					r.setStatus("expired");
					requestRepo.saveAndFlush(r);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
