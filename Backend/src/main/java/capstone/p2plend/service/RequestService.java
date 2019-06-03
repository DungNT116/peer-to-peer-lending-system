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

	@Transactional
	public List<Request> findAll() {
		return requestRepo.findAll();
	}

	@Transactional
	public Request getOneById(int id) {
		return requestRepo.findById(id).get();
	}

	@Transactional
	public List<Request> findAllExceptUserRequest(String token) {
		List<Request> listRq = new ArrayList<>();

		String username = jwtService.getUsernameFromToken(token);
		User account = accountRepo.findByUsername(username);

		listRq = requestRepo.findAllUserRequestExcept(account.getId());

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

	@Transactional
	public List<Request> findAllRequestHistoryDone(String token) {
		List<Request> listRq = new ArrayList<>();

		String username = jwtService.getUsernameFromToken(token);
		User account = accountRepo.findByUsername(username);
		listRq = requestRepo.findAllUserHistoryRequestDone(account.getId(), "done");

		return listRq;
	}

	@Transactional
	public boolean createRequest(Request request, String token) {
		try {
			String username = jwtService.getUsernameFromToken(token);
			User account = accountRepo.findByUsername(username);
			Deal deal = new Deal();
			deal.setStatus("pending");

			deal.setRequest(request);

			request.setBorrower(account);
			request.setDeal(deal);

			requestRepo.save(request);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	@Transactional
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

	@Transactional
	public boolean remove(int id, String token) {
		try {
			Request request = requestRepo.findById(id).get();
			User user = accountRepo.findByUsername(jwtService.getUsernameFromToken(token));
			
			if(request.getBorrower().getId() != user.getId()) {
				return false;
			}
			
			if(!request.getDeal().getStatus().equals("pending")) {
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
