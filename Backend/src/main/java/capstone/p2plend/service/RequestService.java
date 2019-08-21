package capstone.p2plend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import capstone.p2plend.entity.User;
import capstone.p2plend.dto.PageDTO;
import capstone.p2plend.entity.BackupDeal;
import capstone.p2plend.entity.BackupMilestone;
import capstone.p2plend.entity.Deal;
import capstone.p2plend.entity.Milestone;
import capstone.p2plend.entity.Request;
import capstone.p2plend.entity.Transaction;
import capstone.p2plend.repo.UserRepository;
import capstone.p2plend.repo.BackupDealRepository;
import capstone.p2plend.repo.BackupMilestoneRepository;
import capstone.p2plend.repo.DealRepository;
import capstone.p2plend.repo.MilestoneRepository;
import capstone.p2plend.repo.RequestRepository;

@Service
public class RequestService {

	@Autowired
	RequestRepository requestRepo;

	@Autowired
	UserRepository accountRepo;

	@Autowired
	DealRepository dealRepo;

	@Autowired
	MilestoneRepository milestoneRepo;

	@Autowired
	BackupDealRepository backupDealRepo;

	@Autowired
	BackupMilestoneRepository backupMilestoneRepo;

	@Autowired
	JwtService jwtService;

	public PageDTO<Request> findAllOtherUserRequest(Integer page, Integer element, String token) {
		String username = jwtService.getUsernameFromToken(token);
		User account = accountRepo.findByUsername(username);
		Pageable pageable = PageRequest.of(page - 1, element, Sort.by("create_date").descending());
		Page<Request> listRq = requestRepo.findAllOtherUserRequest(pageable, account.getId());

		for (Request r : listRq) {
			if (r.getBorrower() != null) {
				User borrower = new User();
				borrower.setId(r.getBorrower().getId());
				borrower.setUsername(r.getBorrower().getUsername());
				borrower.setFirstName(r.getBorrower().getFirstName());
				borrower.setLastName(r.getBorrower().getLastName());
				r.setBorrower(borrower);
			}
			if (r.getLender() != null) {
				User lender = new User();
				lender.setId(r.getLender().getId());
				lender.setUsername(r.getLender().getUsername());
				lender.setFirstName(r.getLender().getFirstName());
				lender.setLastName(r.getLender().getLastName());
				r.setLender(lender);
			}
			if (r.getDeal() != null) {
				Deal deal = new Deal();
				deal.setId(r.getDeal().getId());
				deal.setStatus(r.getDeal().getStatus());
				if (r.getDeal().getMilestone() != null) {
					List<Milestone> listMilestone = r.getDeal().getMilestone();
					for (Milestone m : listMilestone) {
						if (m.getTransaction() != null) {
							Transaction transaction = new Transaction();
							transaction.setStatus(m.getTransaction().getStatus());
							m.setTransaction(transaction);
						} else {
							Transaction transaction = new Transaction();
							m.setTransaction(transaction);
						}
					}
					deal.setMilestone(listMilestone);
				}

				if (r.getDeal().getUser() != null) {
					User user = r.getDeal().getUser();
					User attachUser = new User();
					attachUser.setUsername(user.getUsername());
					attachUser.setFirstName(user.getFirstName());
					attachUser.setLastName(user.getLastName());
					deal.setUser(attachUser);
				}

				r.setDeal(deal);
			}
		}
		PageDTO<Request> pageDTO = new PageDTO<>();
		pageDTO.setMaxPage(listRq.getTotalPages());
		pageDTO.setData(listRq.getContent());
		return pageDTO;
	}

	public PageDTO<Request> findUserAllRequestByStatus(Integer page, Integer element, String token, String status) {
		String username = jwtService.getUsernameFromToken(token);
		User account = accountRepo.findByUsername(username);
		Pageable pageable = PageRequest.of(page - 1, element, Sort.by("create_date").descending());
		Page<Request> listRq = requestRepo.findAllUserRequestByStatus(pageable, account.getId(), status);
		for (Request r : listRq) {
			if (r.getBorrower() != null) {
				User borrower = new User();
				borrower.setId(r.getBorrower().getId());
				borrower.setUsername(r.getBorrower().getUsername());
				borrower.setFirstName(r.getBorrower().getFirstName());
				borrower.setLastName(r.getBorrower().getLastName());
				r.setBorrower(borrower);
			}
			if (r.getLender() != null) {
				User lender = new User();
				lender.setId(r.getLender().getId());
				lender.setUsername(r.getLender().getUsername());
				lender.setFirstName(r.getLender().getFirstName());
				lender.setLastName(r.getLender().getLastName());
				r.setLender(lender);
			}
			if (r.getDeal() != null) {
				Deal deal = new Deal();
				deal.setId(r.getDeal().getId());
				deal.setStatus(r.getDeal().getStatus());
				if (r.getDeal().getMilestone() != null) {
					List<Milestone> listMilestone = r.getDeal().getMilestone();
					for (Milestone m : listMilestone) {
						if (m.getTransaction() != null) {
							Transaction transaction = new Transaction();
							transaction.setStatus(m.getTransaction().getStatus());
							m.setTransaction(transaction);
						} else {
							Transaction transaction = new Transaction();
							m.setTransaction(transaction);
						}
					}
					deal.setMilestone(listMilestone);
				}

				if (r.getDeal().getUser() != null) {
					User user = r.getDeal().getUser();
					User attachUser = new User();
					attachUser.setUsername(user.getUsername());
					attachUser.setFirstName(user.getFirstName());
					attachUser.setLastName(user.getLastName());
					deal.setUser(attachUser);
				}

				r.setDeal(deal);
			}
		}
		PageDTO<Request> pageDTO = new PageDTO<>();
		pageDTO.setMaxPage(listRq.getTotalPages());
		pageDTO.setData(listRq.getContent());
		return pageDTO;
	}

	public PageDTO<Request> findAllRequestByStatusWithLenderOrBorrower(Integer page, Integer element, String token,
			String status) {
		String username = jwtService.getUsernameFromToken(token);
		User account = accountRepo.findByUsername(username);
		Pageable pageable = PageRequest.of(page - 1, element, Sort.by("create_date").descending());
		Page<Request> listRq = requestRepo.findAllRequestByStatusWithLenderOrBorrower(pageable, status, account.getId(),
				account.getId());
		for (Request r : listRq) {
			if (r.getBorrower() != null) {
				User borrower = new User();
				borrower.setId(r.getBorrower().getId());
				borrower.setUsername(r.getBorrower().getUsername());
				borrower.setFirstName(r.getBorrower().getFirstName());
				borrower.setLastName(r.getBorrower().getLastName());
				r.setBorrower(borrower);
			}
			if (r.getLender() != null) {
				User lender = new User();
				lender.setId(r.getLender().getId());
				lender.setUsername(r.getLender().getUsername());
				lender.setFirstName(r.getLender().getFirstName());
				lender.setLastName(r.getLender().getLastName());
				r.setLender(lender);
			}
			if (r.getDeal() != null) {
				Deal deal = new Deal();
				deal.setId(r.getDeal().getId());
				deal.setStatus(r.getDeal().getStatus());
				if (r.getDeal().getMilestone() != null) {
					List<Milestone> listMilestone = r.getDeal().getMilestone();
					for (Milestone m : listMilestone) {
						if (m.getTransaction() != null) {
							Transaction transaction = new Transaction();
							transaction.setStatus(m.getTransaction().getStatus());
							m.setTransaction(transaction);
						} else {
							Transaction transaction = new Transaction();
							m.setTransaction(transaction);
						}
					}
					deal.setMilestone(listMilestone);
				}

				if (r.getDeal().getUser() != null) {
					User user = r.getDeal().getUser();
					User attachUser = new User();
					attachUser.setUsername(user.getUsername());
					attachUser.setFirstName(user.getFirstName());
					attachUser.setLastName(user.getLastName());
					deal.setUser(attachUser);
				}

				r.setDeal(deal);
			}
		}
		PageDTO<Request> pageDTO = new PageDTO<>();
		pageDTO.setMaxPage(listRq.getTotalPages());
		pageDTO.setData(listRq.getContent());
		return pageDTO;
	}

	public PageDTO<Request> findAllRequestByStatusWithLender(Integer page, Integer element, String token,
			String status) {
		String username = jwtService.getUsernameFromToken(token);
		User account = accountRepo.findByUsername(username);
		Pageable pageable = PageRequest.of(page - 1, element, Sort.by("create_date").descending());
		Page<Request> listRq = requestRepo.findAllRequestByStatusWithLender(pageable, status, account.getId());
		for (Request r : listRq) {
			if (r.getBorrower() != null) {
				User borrower = new User();
				borrower.setId(r.getBorrower().getId());
				borrower.setUsername(r.getBorrower().getUsername());
				borrower.setFirstName(r.getBorrower().getFirstName());
				borrower.setLastName(r.getBorrower().getLastName());
				r.setBorrower(borrower);
			}
			if (r.getLender() != null) {
				User lender = new User();
				lender.setId(r.getLender().getId());
				lender.setUsername(r.getLender().getUsername());
				lender.setFirstName(r.getLender().getFirstName());
				lender.setLastName(r.getLender().getLastName());
				r.setLender(lender);
			}
			if (r.getDeal() != null) {
				Deal deal = new Deal();
				deal.setId(r.getDeal().getId());
				deal.setStatus(r.getDeal().getStatus());
				if (r.getDeal().getMilestone() != null) {
					List<Milestone> listMilestone = r.getDeal().getMilestone();
					for (Milestone m : listMilestone) {
						if (m.getTransaction() != null) {
							Transaction transaction = new Transaction();
							transaction.setStatus(m.getTransaction().getStatus());
							m.setTransaction(transaction);
						} else {
							Transaction transaction = new Transaction();
							m.setTransaction(transaction);
						}
					}
					deal.setMilestone(listMilestone);
				}

				if (r.getDeal().getUser() != null) {
					User user = r.getDeal().getUser();
					User attachUser = new User();
					attachUser.setUsername(user.getUsername());
					attachUser.setFirstName(user.getFirstName());
					attachUser.setLastName(user.getLastName());
					deal.setUser(attachUser);
				}

				r.setDeal(deal);
			}
		}
		PageDTO<Request> pageDTO = new PageDTO<>();
		pageDTO.setMaxPage(listRq.getTotalPages());
		pageDTO.setData(listRq.getContent());
		return pageDTO;
	}

	public PageDTO<Request> findAllRequestByStatusWithBorrower(Integer page, Integer element, String token,
			String status) {
		String username = jwtService.getUsernameFromToken(token);
		User account = accountRepo.findByUsername(username);
		Pageable pageable = PageRequest.of(page - 1, element, Sort.by("create_date").descending());
		Page<Request> listRq = requestRepo.findAllRequestByStatusWithBorrower(pageable, status, account.getId());
		for (Request r : listRq) {
			if (r.getBorrower() != null) {
				User borrower = new User();
				borrower.setId(r.getBorrower().getId());
				borrower.setUsername(r.getBorrower().getUsername());
				borrower.setFirstName(r.getBorrower().getFirstName());
				borrower.setLastName(r.getBorrower().getLastName());
				r.setBorrower(borrower);
			}
			if (r.getLender() != null) {
				User lender = new User();
				lender.setId(r.getLender().getId());
				lender.setUsername(r.getLender().getUsername());
				lender.setFirstName(r.getLender().getFirstName());
				lender.setLastName(r.getLender().getLastName());
				r.setLender(lender);
			}
			if (r.getDeal() != null) {
				Deal deal = new Deal();
				deal.setId(r.getDeal().getId());
				deal.setStatus(r.getDeal().getStatus());
				if (r.getDeal().getMilestone() != null) {
					List<Milestone> listMilestone = r.getDeal().getMilestone();
					for (Milestone m : listMilestone) {
						if (m.getTransaction() != null) {
							Transaction transaction = new Transaction();
							transaction.setStatus(m.getTransaction().getStatus());
							m.setTransaction(transaction);
						} else {
							Transaction transaction = new Transaction();
							m.setTransaction(transaction);
						}
					}
					deal.setMilestone(listMilestone);
				}

				if (r.getDeal().getUser() != null) {
					User user = r.getDeal().getUser();
					User attachUser = new User();
					attachUser.setUsername(user.getUsername());
					attachUser.setFirstName(user.getFirstName());
					attachUser.setLastName(user.getLastName());
					deal.setUser(attachUser);
				}

				r.setDeal(deal);
			}
		}
		PageDTO<Request> pageDTO = new PageDTO<>();
		pageDTO.setMaxPage(listRq.getTotalPages());
		pageDTO.setData(listRq.getContent());
		return pageDTO;
	}

	public boolean createRequest(Request request, String token) {

		Deal deal = new Deal();
		if (request.getDeal() != null) {
			deal = request.getDeal();
		} else {
			return false;
		}

		List<Milestone> listMilestone = new ArrayList<>();
		if (request.getDeal().getMilestone() != null) {
			listMilestone.addAll(request.getDeal().getMilestone());
		} else {
			return false;
		}

		int countPayback = 0;
		int countLend = 0;
		for (Milestone m : listMilestone) {
			if (m.getType().equals("payback")) {
				countPayback++;
			}
			if (m.getType().equals("lend")) {
				countLend++;
			}
		}

		if (countPayback != deal.getPaybackTimes()) {
			return false;
		}
		if (countLend != deal.getBorrowTimes()) {
			return false;
		}

		String username = jwtService.getUsernameFromToken(token);
		User account = accountRepo.findByUsername(username);

		Long loanLimit = account.getLoanLimit();
		List<Request> lstRequestTrading = requestRepo.findListAllUserRequestByStatus(account.getId(), "trading");
		List<Request> lstRequestPending = requestRepo.findListAllUserRequestByStatus(account.getId(), "pending");
		List<Request> lstRequestDealing = requestRepo.findListAllUserRequestByStatus(account.getId(), "dealing");

		List<Request> lstRequest = new ArrayList<>();
		if (lstRequestTrading != null) {
			lstRequest.addAll(lstRequestTrading);
		}
		if (lstRequestPending != null) {
			lstRequest.addAll(lstRequestPending);
		}
		if (lstRequestDealing != null) {
			lstRequest.addAll(lstRequestDealing);
		}

		Long currentLoanAmount = 0L;
		for (Request r : lstRequest) {
			currentLoanAmount += r.getAmount();
		}

		currentLoanAmount += request.getAmount();
		if (currentLoanAmount > loanLimit) {
			return false;
		}

		request.setBorrower(account);
		request.setStatus("pending");
		Request reObj = requestRepo.saveAndFlush(request);

		deal.setStatus("pending");
		deal.setRequest(reObj);
		deal.setUser(account);
		Deal dealObj = dealRepo.saveAndFlush(deal);

		BackupDeal backupDealObj = new BackupDeal();
		backupDealObj.setBorrowTimes(dealObj.getBorrowTimes());
		backupDealObj.setPaybackTimes(dealObj.getPaybackTimes());
		backupDealObj.setStatus(dealObj.getStatus());
		backupDealObj.setDeal(dealObj);
		backupDealObj = backupDealRepo.saveAndFlush(backupDealObj);

		for (Milestone m : listMilestone) {
			m.setDeal(dealObj);
			milestoneRepo.saveAndFlush(m);
		}

		List<BackupMilestone> listBackupMilestone = new ArrayList<>();
		for (Milestone m : listMilestone) {
			BackupMilestone backupMilestone = new BackupMilestone();
			backupMilestone.setPercent(m.getPercent());
			backupMilestone.setPresentDate(m.getPresentDate());
			backupMilestone.setPreviousDate(m.getPreviousDate());
			backupMilestone.setType(m.getType());
			listBackupMilestone.add(backupMilestone);
		}

		for (Milestone m : listMilestone) {
			m.setDeal(dealObj);
			milestoneRepo.saveAndFlush(m);
		}

		for (BackupMilestone bm : listBackupMilestone) {
			bm.setBackupDeal(backupDealObj);
			backupMilestoneRepo.saveAndFlush(bm);
		}

		return true;
	}

	public boolean remove(Request requestGet, String token) {
		if (requestGet.getId() == null) {
			return false;
		}

		Request request = requestRepo.findById(requestGet.getId()).get();
		if (request == null) {
			return false;
		}
		User user = accountRepo.findByUsername(jwtService.getUsernameFromToken(token));

		if (request.getBorrower().getId() != user.getId()) {
			return false;
		}

		if (!request.getStatus().equals("pending")) {
			return false;
		}

		Request existedRequest = requestRepo.findById(requestGet.getId()).get();
		existedRequest.setStatus("deleted");
		Request savedRq = requestRepo.saveAndFlush(existedRequest);

		if (savedRq != null) {
			return true;
		}

		return false;
	}

}
