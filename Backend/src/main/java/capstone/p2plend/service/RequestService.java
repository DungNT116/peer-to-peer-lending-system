package capstone.p2plend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import capstone.p2plend.entity.Account;
import capstone.p2plend.entity.Deal;
import capstone.p2plend.entity.Request;
import capstone.p2plend.repo.AccountRepository;
import capstone.p2plend.repo.RequestRepository;

@Service
public class RequestService {

	@Autowired
	RequestRepository requestRepo;

	@Autowired
	AccountRepository accountRepo;

	@Autowired
	JwtService jwtService;

	@Transactional
	public List<Request> findAll() {
		return requestRepo.findAll();
	}

	@Transactional
	public List<Request> findAllExceptUserRequest(Integer id) {
		List<Request> listRq = new ArrayList<Request>();

		listRq = requestRepo.findAllRequestExcept(id);

		return listRq;
	}

	@Transactional
	public boolean createRequest(Request request, String token) {
		try {
			String username = jwtService.getUsernameFromToken(token);
			Account account = accountRepo.findByUsername(username);
			Deal deal = new Deal();
			deal.setStatus("pending");

			request.setFromAccount(account);
			request.setDeal(deal);

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	@Transactional
	public boolean approveRequest(Request request, String token) {
		try {
			int id = request.getId();

			Request existRequest = requestRepo.findById(id).get();
			String username = jwtService.getUsernameFromToken(token);
			Account account = accountRepo.findByUsername(username);
			existRequest.setToAccount(account);
			requestRepo.save(existRequest);

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	@Transactional
	public void remove(int id) {
		try {
			requestRepo.deleteById(id);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
