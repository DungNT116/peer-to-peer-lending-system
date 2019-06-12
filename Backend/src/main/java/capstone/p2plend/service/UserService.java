package capstone.p2plend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import capstone.p2plend.dto.PageDTO;
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.UserRepository;

@Service
public class UserService {

	@Autowired
	UserRepository userRepo;

	public List<User> findAll() {
		return userRepo.findAll();
	}

	public User getOneById(int id) {
		User account = userRepo.findById(id).get();
		account.setPassword(null);
		account.setBorrowRequest(null);
		account.setLendRequest(null);
		return account;
	}

	public User findUsername(String username) {
		return userRepo.findByUsername(username);
	}

	public boolean checkLogin(User account) {

		String username = account.getUsername();
		String password = account.getPassword();

		User checkExist = userRepo.findByUsernameAndPassword(username, password);
		
		if (checkExist != null && checkExist.getStatus().equals("active")) {
			return true;
		}

		return false;
	}

	public User createAccount(User account) {

		account.setRole("ROLE_USER");
		account.setStatus("active");

		return userRepo.save(account);
	}

	public boolean activeAccount(int id) {
		boolean valid = false;
		try {
			User account = userRepo.findById(id).get();
			account.setRole("ROLE_USER");
			account.setStatus("active");
			userRepo.save(account);
			valid = true;
		} catch (Exception e) {
			valid = false;
			return valid;
		}
		return valid;
	}

	public boolean deactivateAccount(int id) {
		boolean valid = false;
		try {
			User account = userRepo.findById(id).get();
//			account.setRole(null);
			account.setStatus("deactivate");
			userRepo.save(account);
			valid = true;
		} catch (Exception e) {
			valid = false;
			return valid;
		}
		return valid;
	}

	public PageDTO<User> getUsers(int page, int element) {
		Pageable pageable = PageRequest.of(page - 1, element);
		Page<User> allUsers = userRepo.findAll(pageable);			
		for (User u : allUsers) {
			u.setPassword(null);
			u.setRole(null);
			u.setStatus(null);
			u.setBorrowRequest(null);
			u.setLendRequest(null);
		}
		PageDTO<User> pageDTO = new PageDTO<>();
		pageDTO.setMaxPage(allUsers.getTotalPages());
		pageDTO.setData(allUsers.getContent());		
		return pageDTO;
	}
}