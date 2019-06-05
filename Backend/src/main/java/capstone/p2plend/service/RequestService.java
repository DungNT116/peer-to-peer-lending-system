package capstone.p2plend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import capstone.p2plend.entity.User;
import capstone.p2plend.entity.Deal;
import capstone.p2plend.entity.Request;
import capstone.p2plend.repo.UserRepository;
import capstone.p2plend.repo.DealRepository;
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
	JwtService jwtService;

//	@Autowired
//    private ModelMapper modelMapper;

	public List<Request> findAll() {
		return requestRepo.findAll();
	}

	public Request getOneById(int id) {
		return requestRepo.findById(id).get();
	}

	public List<Request> findAllExceptUserRequest(String token) {
		List<Request> listRq = new ArrayList<>();

		String username = jwtService.getUsernameFromToken(token);
		User account = accountRepo.findByUsername(username);

		listRq = requestRepo.findAllUserRequestExcept(account.getId());

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
				r.setDeal(deal);
			}
		}

		return listRq;
	}

//	private Request convertToEntity(PostDto postDto) throws ParseException {
//		Request post = modelMapper.map(postDto, Post.class);
//	    post.setSubmissionDate(postDto.getSubmissionDateConverted(
//	      userService.getCurrentUser().getPreference().getTimezone()));
//	  
//	    if (postDto.getId() != null) {
//	        Post oldPost = postService.getPostById(postDto.getId());
//	        post.setRedditID(oldPost.getRedditID());
//	        post.setSent(oldPost.isSent());
//	    }
//	    return post;
//	}

	public List<Request> findAllRequestHistoryDone(String token) {
		List<Request> listRq = new ArrayList<>();

		String username = jwtService.getUsernameFromToken(token);
		User account = accountRepo.findByUsername(username);
		listRq = requestRepo.findAllUserHistoryRequestDone(account.getId(), "done");

		return listRq;
	}

	public boolean createRequest(Request request, String token) {
		try {
			String username = jwtService.getUsernameFromToken(token);
			User account = accountRepo.findByUsername(username);

			request.setBorrower(account);
			request.setStatus("pending");
			
			requestRepo.save(request);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public boolean approveRequest(int id, String token) {
		try {
			Request existRequest = requestRepo.findById(id).get();
			String username = jwtService.getUsernameFromToken(token);
			User account = accountRepo.findByUsername(username);
			existRequest.setLender(account);
			Deal deal = existRequest.getDeal();
			deal.setStatus("transitioning");

			requestRepo.save(existRequest);

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

			if (!request.getDeal().getStatus().equals("pending")) {
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
