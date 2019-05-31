package capstone.p2plend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
	JwtService JwtService;
	
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
	public Request createRequest(Request request) {
		return requestRepo.save(request);
	}
}
