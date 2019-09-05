package capstone.p2plend.util;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

@Component
public class Scheduler {

	private static final Logger LOGGER = LoggerFactory.getLogger(Scheduler.class);

	@Autowired
	EmailModule emailModule;

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
			LOGGER.info("Checking system for deadline of milestone...");
			int count = 0;
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
					Long diff = deadLine.getTime() - currentDate.getTime();
					if (TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS) <= 3L && m.getTransaction() == null) {
						if (m.getType().equalsIgnoreCase("lend")) {
							emailModule.sendSimpleMessage(lender.getEmail(),
									"PPLS Remind Deadline of the current lend for loan request(lender)",
									"Your current lend deadline is, Deadline " + deadLine
											+ ", to complete this trasaction, Login to our website to make the transaction for request number: "
											+ r.getId() + ", Milestone number: " + m.getId());
							count++;
							emailModule.sendSimpleMessage(borrower.getEmail(),
									"PPLS notice of the loan has not been paid(borrower)",
									"Current deadline of the lend milestone still not been paid, dealine: " + deadLine
											+ " We will remind the other person about this");
							count++;
						}
						if (m.getType().equalsIgnoreCase("payback")) {							
							emailModule.sendSimpleMessage(borrower.getEmail(),
									"PPLS Remind Deadline of the current payback for loan request(borrower)",
									"Your current payback deadline is, Deadline " + deadLine
											+ " to complete this trasaction, Login to our website to make the transaction for request number: "
											+ r.getId() + ", Milestone number: " + m.getId());
							count++;
							emailModule.sendSimpleMessage(lender.getEmail(),
									"PPLS notice of the loan has not been paid(lender)",
									"Current deadline of the payback milestone still not been paid, dealine: "
											+ deadLine + " We will remind the other person about this");
							count++;
						}

					}
				}
			}
			LOGGER.info("Finish check system for milestone near deadline, sent " + count + " mail");
		} catch (Exception e) {
			LOGGER.error("Error while try to send schedule mail", e);
		}
	}

//	@Scheduled(cron = "0 * * ? * *")
	@Transactional
	@Scheduled(cron = "0 0 1 * * ?")
	public void deletePendingRequestWhenExpired() {
		try {
			LOGGER.info("Start checking system for pending request overdue five days");
			int count = 0;
			List<Request> lstRequest = requestRepo.findAllRequestByStatus("pending");
			for (int i = 0; i < lstRequest.size(); i++) {
				Request r = lstRequest.get(i);
				Long time = r.getCreateDate() * 1000;
				Timestamp stamp = new Timestamp(time);
				Date createDate = new Date(stamp.getTime());
				Date currentDate = new Date();
				Long diff = currentDate.getTime() - createDate.getTime();
				if (TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS) > 5) {
					Request existedRq = requestRepo.findById(r.getId()).get();
					existedRq.setStatus("deleted");
					requestRepo.saveAndFlush(existedRq);
					count++;
				}
			}
			LOGGER.info("Finish checking system for pending request overdue five days, deleted " + count + " request overdue five days");
		} catch (Exception e) {
			LOGGER.error("Error while trying to delete request that expired", e);
		}
	}

	@Transactional
	@Scheduled(cron = "0 */5 * ? * *")
	public void adjustUserLoanLimit() {
		try {
			LOGGER.info("System started checking and adjust user loan limit");

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
			LOGGER.info("Done adjusting user loan limit");
		} catch (Exception e) {
			LOGGER.error("Error while trying adjust user loan limit", e);
		}
	}
}
