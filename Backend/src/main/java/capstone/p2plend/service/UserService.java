package capstone.p2plend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import capstone.p2plend.dto.PageDTO;
import capstone.p2plend.entity.Request;
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.RequestRepository;
import capstone.p2plend.repo.UserRepository;

@Service
public class UserService {

	@Autowired
	UserRepository userRepo;

	@Autowired
	RequestRepository requestRepo;

	@Autowired
	JwtService jwtService;

	public List<User> findAll() {
		return userRepo.findAll();
	}

	public String checkUser(String token) {
		try {
			String username = null;
			username = jwtService.getUsernameFromToken(token);
			User user = userRepo.findByUsername(username);
			if (user != null) {
				return username;
			}
			return "";
		} catch (Exception e) {
			return "";
		}
	}

	public User getOneById(int id) {
		User user = userRepo.findById(id).get();
		User account = new User();
		account.setUsername(user.getUsername());
		account.setFirstName(user.getFirstName());
		account.setLastName(user.getLastName());
		account.setEmail(user.getEmail());
		account.setPhoneNumber(user.getPhoneNumber());
		return account;
	}

	public User getOneByUsername(String token) {
		String username = jwtService.getUsernameFromToken(token);
		User user = userRepo.findByUsername(username);
		User account = new User();
		account.setUsername(user.getUsername());
		account.setFirstName(user.getFirstName());
		account.setLastName(user.getLastName());
		account.setEmail(user.getEmail());
		account.setPhoneNumber(user.getPhoneNumber());
		account.setLoanLimit(user.getLoanLimit());
		return account;
	}

	public User findUsername(String username) {
		return userRepo.findByUsername(username);
	}

	public User checkLogin(User account) {

		String username = account.getUsername();
		String password = account.getPassword();

		User checkExist = userRepo.findByUsernameAndPassword(username, password);

		if (checkExist != null && checkExist.getStatus().equals("active")) {
			return checkExist;
		}

		return null;
	}

	public String createAccount(User account) {
		try {

			User usernameExist = userRepo.findByUsername(account.getUsername());
			if (usernameExist != null) {
				return "Username existed";
			}

			User emailExist = userRepo.findByEmail(account.getEmail());
			if (emailExist != null) {
				return "Email existed";
			}

			account.setRole("ROLE_USER");
			account.setStatus("active");
			account.setLoanLimit(0L);
			userRepo.save(account);
			return "Account successfully created";

		} catch (Exception e) {
			return "Error";
		}
	}

	public boolean activateAccount(int id) {
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

	public boolean changeLoanLimit(Integer id, Long loanLimit) {
		try {
			User user = userRepo.findById(id).get();
			user.setLoanLimit(loanLimit);
			userRepo.save(user);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public PageDTO<User> getUsers(int page, int element) {
		Pageable pageable = PageRequest.of(page - 1, element);
		Page<User> allUsers = userRepo.findAll(pageable);
		List<User> userList = new ArrayList<>();
		for (User u : allUsers) {
			if (!u.getRole().equals("ROLE_ADMIN")) {
				User user = new User();
				user.setId(u.getId());
				user.setUsername(u.getUsername());
				user.setFirstName(u.getFirstName());
				user.setLastName(u.getLastName());
				user.setStatus(u.getStatus());
				userList.add(user);
			}
		}
		PageDTO<User> pageDTO = new PageDTO<>();
		pageDTO.setMaxPage(allUsers.getTotalPages());
		pageDTO.setData(userList);
		return pageDTO;
	}

	public Long getUserMaximunLoanLimit(String token) {
		try {

			String username = jwtService.getUsernameFromToken(token);
			User user = userRepo.findByUsername(username);

			Long loanLimit = user.getLoanLimit();

			List<Request> lstRequest = requestRepo.findListAllUserRequestByExceptStatus(user.getId(), "done");

			Long currentLoanAmount = 0L;

			for (Request r : lstRequest) {
				currentLoanAmount += r.getAmount();
			}

			
			
			if(loanLimit - currentLoanAmount < 0) {
				return 0L;
			}
			
			return loanLimit - currentLoanAmount;

		} catch (Exception e) {
			return 0L;
		}
	}
}