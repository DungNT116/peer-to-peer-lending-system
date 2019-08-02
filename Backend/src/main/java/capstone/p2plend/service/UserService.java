package capstone.p2plend.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.mail.SendFailedException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
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

	@Autowired
	EmailService emailService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	public List<User> findAll() {
		return userRepo.findAll();
	}

	public String checkUser(String token) {
		if (token == null) {
			return null;
		}
		String username = jwtService.getUsernameFromToken(token);
		User user = userRepo.findByUsername(username);
		if (user != null) {
			return username;
		}
		return null;
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
		if (token == null) {
			return null;
		}
		String username = jwtService.getUsernameFromToken(token);
		User user = userRepo.findByUsername(username);
		if (user == null) {
			return null;
		}
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

		if (username == null) {
			return null;
		}

		return userRepo.findByUsername(username);
	}

	public User checkLogin(User account) {

		if(account.getUsername() == null || account.getPassword() == null) return null;
		
		String username = account.getUsername();
//		String rawPassword = account.getPassword();
		
//		String password = passwordEncoder.encode(rawPassword);
		
		String password = account.getPassword();
		
		User checkExist = userRepo.findByUsernameAndPassword(username, password);
		if (checkExist != null && checkExist.getStatus().equals("active")) {
			return checkExist;
		}
		return null;
	}

	public String createAccount(User account) throws SendFailedException {
		if (account.getUsername() == null) {
			return "Error";
		}
		if (account.getPassword() == null) {
			return "Error";
		}

		if (account.getFirstName() == null) {
			return "Error";
		}
		if (account.getLastName() == null) {
			return "Error";
		}

		if (account.getEmail() == null) {
			return "Error";
		}
		if (account.getPhoneNumber() == null) {
			return "Error";
		}

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

		account = userRepo.save(account);

		emailService.sendSimpleMessage(account.getEmail(), "Welcome to PPLS",
				"You have create account successfully in PPLS website");

		return "Account successfully created";

	}

	public boolean activateAccount(Integer id) {
		if (id == null)
			return false;

		User account = userRepo.findById(id).get();
		if (account == null)
			return false;

		account.setRole("ROLE_USER");
		account.setStatus("active");
		userRepo.save(account);

		return true;
	}

	public boolean deactivateAccount(Integer id) {
		if (id == null)
			return false;
		User account = userRepo.findById(id).get();
		if (account == null)
			return false;

//			account.setRole(null);
		account.setStatus("deactivate");
		userRepo.save(account);
		return true;
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

		String username = jwtService.getUsernameFromToken(token);
		User user = userRepo.findByUsername(username);

		if (user == null) {
			return null;
		}

		Long loanLimit = user.getLoanLimit();

		if (loanLimit == null) {
			return null;
		}

		List<Request> lstRequest = requestRepo.findListAllUserRequestByExceptStatus(user.getId(), "done");

		if (lstRequest == null) {
			return null;
		}

		Long currentLoanAmount = 0L;

		for (Request r : lstRequest) {
			currentLoanAmount += r.getAmount();
		}

		if (loanLimit - currentLoanAmount < 0) {
			return 0L;
		}

		return loanLimit - currentLoanAmount;

	}

	public boolean changeUserInfo(User user, String token) {

		if (user == null || token == null) {
			return false;
		}

		String username = jwtService.getUsernameFromToken(token);
		User existUser = userRepo.findByUsername(username);

		if (user.getFirstName() != null) {
			existUser.setFirstName(user.getFirstName());
		}
		if (user.getLastName() != null) {
			existUser.setLastName(user.getLastName());
		}
		if (user.getPhoneNumber() != null) {
			existUser.setPhoneNumber(user.getPhoneNumber());
		}
		if (user.getEmail() != null) {
			existUser.setEmail(user.getEmail());
		}

		User savedUser = userRepo.saveAndFlush(existUser);

		if (savedUser != null) {
			return true;
		}

		return false;
	}

	public boolean changePassword(String oldPassword, String newPassword, String token) {
		if (oldPassword == null || newPassword == null || token == null) {
			return false;
		}
		if (oldPassword.equalsIgnoreCase(newPassword))
			return false;
		String username = jwtService.getUsernameFromToken(token);
		User user = userRepo.findByUsername(username);

		if (user == null) {
			return false;
		}

		if (user.getPassword() != oldPassword)
			return false;

		user.setPassword(newPassword);
		userRepo.save(user);

		return true;
	}

	public boolean forgotPassword(String username, String email) {
		if (username == null || email == null) {
			return false;
		}
		User user = userRepo.findByUsernameAndEmail(username, email);
		if (user == null) {
			return false;
		}

		String SETCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		StringBuilder strb = new StringBuilder();
		Random rnd = new Random();

		while (strb.length() < 18) { // length of the random string.
			int index = (int) (rnd.nextFloat() * SETCHARS.length());
			strb.append(SETCHARS.charAt(index));
		}
		String str = strb.toString();

		user.setPassword(str);
		emailService.sendSimpleMessage(email, "You have request a new Password from PPLS site",
				"Your new password: " + str);

		userRepo.save(user);

		return true;
	}
}