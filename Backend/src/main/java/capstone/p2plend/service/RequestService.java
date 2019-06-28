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
import capstone.p2plend.entity.Deal;
import capstone.p2plend.entity.Milestone;
import capstone.p2plend.entity.Request;
import capstone.p2plend.repo.UserRepository;
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
	JwtService jwtService;

//	@Autowired
//    private ModelMapper modelMapper;

	public List<Request> findAll() {
		return requestRepo.findAll();
	}

	public Request getOneById(int id) {
		Request r = requestRepo.findById(id).get();

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
				for(Milestone m : listMilestone) {
					m.setTransaction(null);
				}
				deal.setMilestone(listMilestone);
			}

			r.setDeal(deal);
		}

		return r;
	}

	public PageDTO<Request> findAllOtherUserRequest(Integer page, Integer element, String token) {
		String username = jwtService.getUsernameFromToken(token);
		User account = accountRepo.findByUsername(username);
		Pageable pageable = PageRequest.of(page - 1, element);
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
					for(Milestone m : listMilestone) {
						m.setTransaction(null);
					}
					deal.setMilestone(listMilestone);
				}
				r.setDeal(deal);
			}
		}
		PageDTO<Request> pageDTO = new PageDTO<>();
		pageDTO.setMaxPage(listRq.getTotalPages());
		pageDTO.setData(listRq.getContent());
		return pageDTO;
	}

	public PageDTO<Request> findAllOtherUserRequestSortByDateDesc(Integer page, Integer element, String token) {
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
					for(Milestone m : listMilestone) {
						m.setTransaction(null);
					}
					deal.setMilestone(listMilestone);
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
					for(Milestone m : listMilestone) {
						m.setTransaction(null);
					}
					deal.setMilestone(listMilestone);
				}
				r.setDeal(deal);
			}
		}
		PageDTO<Request> pageDTO = new PageDTO<>();
		pageDTO.setMaxPage(listRq.getTotalPages());
		pageDTO.setData(listRq.getContent());
		return pageDTO;
	}

	public PageDTO<Request> findAllRequestByStatusWithLenderOrBorrower(Integer page, Integer element, String token, String status){
		String username = jwtService.getUsernameFromToken(token);
		User account = accountRepo.findByUsername(username);
		Pageable pageable = PageRequest.of(page - 1, element, Sort.by("create_date").descending());
		Page<Request> listRq = requestRepo.findAllRequestByStatusWithLenderOrBorrower(pageable, status, account.getId(), account.getId());
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
					for(Milestone m : listMilestone) {
						m.setTransaction(null);
					}
					deal.setMilestone(listMilestone);
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
		try {
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

			if (countPayback != deal.getPaybackTime()) {
				return false;
			}
			if (countLend != deal.getBorrowTime()) {
				return false;
			}

			String username = jwtService.getUsernameFromToken(token);
			User account = accountRepo.findByUsername(username);

			request.setBorrower(account);
			request.setStatus("pending");
			Request reObj = requestRepo.saveAndFlush(request);

			deal.setStatus("pending");
			deal.setRequest(reObj);
			Deal dealObj = dealRepo.saveAndFlush(deal);

			for (Milestone m : listMilestone) {
				m.setDeal(dealObj);
				milestoneRepo.saveAndFlush(m);
			}
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public boolean remove(int id, String token) {
		try {
			Request request = requestRepo.findById(id).get();
			User user = accountRepo.findByUsername(jwtService.getUsernameFromToken(token));

			if (request.getBorrower().getId() != user.getId()) {
				return false;
			}

			if (!request.getStatus().equals("pending")) {
				return false;
			}

			requestRepo.deleteById(id);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

}
