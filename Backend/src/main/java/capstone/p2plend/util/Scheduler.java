package capstone.p2plend.util;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import capstone.p2plend.entity.Deal;
import capstone.p2plend.entity.Document;
import capstone.p2plend.entity.Milestone;
import capstone.p2plend.entity.Request;
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.RequestRepository;
import capstone.p2plend.repo.UserRepository;
import capstone.p2plend.service.EmailService;

@Component
public class Scheduler {

	@Autowired
	EmailService emailService;

	@Autowired
	RequestRepository requestRepo;

	@Autowired
	UserRepository userRepo;

//	@Scheduled(cron = "* * * * * ?")
//	public void testScheduler() {				
//		System.out.println("run ..");
//	}

	@Transactional
	@Scheduled(cron = "0 0 4 * * ?")
	public void sendMailScheduler() {
		try {
			System.out.println("Start scaning system...");
			System.out.println("Checking system for deadline of milestone...");
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
					Long time = m.getPresentDate() * 1000L;
					Timestamp stamp = new Timestamp(time);
					Date deadLine = new Date(stamp.getTime());
					Date currentDate = new Date();
					System.out.println(
							"Current system date checking for deadline of milestone start checking at: " + currentDate);
					Long diff = deadLine.getTime() - currentDate.getTime();
					if (TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS) <= 3L && m.getTransaction() == null) {
						if (m.getType().equalsIgnoreCase("lend")) {
							System.out.println(lender.getEmail());
							emailService.sendSimpleMessage(lender.getEmail(),
									"PPLS Remind Deadline of the current lend for loan request(lender)",
									"Your current lend deadline is, Deadline " + deadLine
											+ ", to complete this trasaction, Login to our website to make the transaction for request number: "
											+ r.getId() + ", Milestone number: " + m.getId());
							emailService.sendSimpleMessage(borrower.getEmail(),
									"PPLS notice of the loan has not been paid(borrower)",
									"Current deadline of the lend milestone still not been paid, dealine: " + deadLine
											+ " We will remind the other person about this");
						}
						if (m.getType().equalsIgnoreCase("payback")) {
							System.out.println(borrower.getEmail());
							emailService.sendSimpleMessage(borrower.getEmail(),
									"PPLS Remind Deadline of the current payback for loan request(borrower)",
									"Your current payback deadline is, Deadline " + deadLine
											+ " to complete this trasaction, Login to our website to make the transaction for request number: "
											+ r.getId() + ", Milestone number: " + m.getId());
							emailService.sendSimpleMessage(lender.getEmail(),
									"PPLS notice of the loan has not been paid(lender)",
									"Current deadline of the payback milestone still not been paid, dealine: "
											+ deadLine + " We will remind the other person about this");
						}
					}
				}
			}
			System.out.println("Finish checking system...");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

//	@Scheduled(cron = "0 * * ? * *")
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
				System.out
						.println("System check the request for more than 5 days... start checking at: " + currentDate);
				Long diff = currentDate.getTime() - createDate.getTime();
				if (TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS) > 5) {
					Request existedRq = requestRepo.findById(r.getId()).get();
					existedRq.setStatus("deleted");
					Request savedRq = requestRepo.saveAndFlush(existedRq);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Transactional
	@Scheduled(cron = "0 */5 * ? * *")
	public void adjustUserLoanLimit() {
		try {

			System.out.println("Startin to scan and adjust user loan limit");

			List<User> lstUser = userRepo.findAll();
			for (int q = 0; q < lstUser.size(); q++) {
				User user = lstUser.get(q);

				if (user.getRole().equalsIgnoreCase("role_admin")) {
					continue;
				}

				List<Document> lstUserDocument = user.getDocument();
				if (lstUserDocument == null) {
					continue;
				}

				Long limit = 0L;
				int count = 0;
				for (int i = 0; i < lstUserDocument.size(); i++) {
					Document d = lstUserDocument.get(i);
					if (d.getDocumentType().getName().equalsIgnoreCase("Identity Card")
							&& d.getStatus().equalsIgnoreCase("valid")) {
						limit += d.getDocumentType().getAmountLimit();
						count = 1;
						lstUserDocument.remove(i);
						break;
					}
				}

				if (count == 1) {
					for (int i = 0; i < lstUserDocument.size(); i++) {
						Document d = lstUserDocument.get(i);
						if (d.getDocumentType().getName().equalsIgnoreCase("Video")
								&& d.getStatus().equalsIgnoreCase("valid")) {
							limit += d.getDocumentType().getAmountLimit();
							user.setLoanLimit(limit);
							user = userRepo.save(user);
							count = 2;
							lstUserDocument.remove(i);
							break;
						}
					}
				}

				if (count == 2) {
					for (int i = 0; i < lstUserDocument.size(); i++) {
						Document d = lstUserDocument.get(i);
						if (!d.getDocumentType().getName().equalsIgnoreCase("Identity Card")
								&& !d.getDocumentType().getName().equalsIgnoreCase("Video")
								&& d.getStatus().equalsIgnoreCase("valid")) {
							limit += d.getDocumentType().getAmountLimit();
							user.setLoanLimit(limit);
							user = userRepo.save(user);
						}
					}
				}
			}
			System.out.println("Done adjusting user loan limit");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
