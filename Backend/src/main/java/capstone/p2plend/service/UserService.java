package capstone.p2plend.service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.security.NoSuchAlgorithmException;
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

import com.fasterxml.jackson.databind.ObjectMapper;

import capstone.p2plend.dto.PageDTO;
import capstone.p2plend.entity.Document;
import capstone.p2plend.entity.DocumentFile;
import capstone.p2plend.entity.Request;
import capstone.p2plend.entity.User;
import capstone.p2plend.repo.RequestRepository;
import capstone.p2plend.repo.UserRepository;
import capstone.p2plend.util.EmailModule;
import capstone.p2plend.util.Keccak256Hashing;

@Service
public class UserService {

	@Autowired
	UserRepository userRepo;

	@Autowired
	Keccak256Hashing kh;

	@Autowired
	RequestRepository requestRepo;

	@Autowired
	JwtService jwtService;

	@Autowired
	EmailModule emailModule;

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
		account.setGenerateHashFile(user.getGenerateHashFile());
		return account;
	}

	public User findUsername(String username) {

		if (username == null) {
			return null;
		}

		return userRepo.findByUsername(username);
	}

	public User checkLogin(User account) {
		if (account.getUsername() == null || account.getPassword() == null)
			return null;
		String userId = account.getUsername();
		String rawPassword = account.getPassword();

		User checkExist = userRepo.findByUsernameOrEmail(userId, userId);

		if (checkExist != null) {
			if (passwordEncoder.matches(rawPassword, checkExist.getPassword())
					&& checkExist.getStatus().equalsIgnoreCase("active")) {
				return checkExist;
			}
		} else {
			return null;
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

		String rawPassword = account.getPassword();

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

		account.setGenerateHashFile(false);
		account.setRole("ROLE_USER");
		account.setStatus("active");
		account.setLoanLimit(0L);
		account.setPassword(passwordEncoder.encode(rawPassword));

		account = userRepo.save(account);

		emailModule.sendSimpleMessage(account.getEmail(), "Welcome to PPLS",
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

		List<Request> lstRequestTrading = requestRepo.findListAllUserRequestByStatus(user.getId(), "trading");
		List<Request> lstRequestPending = requestRepo.findListAllUserRequestByStatus(user.getId(), "pending");
		List<Request> lstRequestDealing = requestRepo.findListAllUserRequestByStatus(user.getId(), "dealing");

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

	public String changePassword(String oldPassword, String newPassword, String token) {
		if (oldPassword == null || newPassword == null) {
			return "old password or new password is null";
		}

		if (oldPassword.equalsIgnoreCase(newPassword))
			return "old password and new password is similar";

		String username = jwtService.getUsernameFromToken(token);
		User user = userRepo.findByUsername(username);
		if (user == null) {
			return "no user found";
		}

		boolean valid = passwordEncoder.matches(oldPassword, user.getPassword());
		if (valid) {
			user.setPassword(passwordEncoder.encode(newPassword));
			User savedUser = userRepo.saveAndFlush(user);
			if (savedUser != null) {
				return "success";
			}
		}
		return "error";
	}

	public String forgotPassword(String username, String email) {
		if (username == null || email == null) {
			return "username or password is null";
		}
		User user = userRepo.findByUsernameAndEmail(username, email);
		if (user == null) {
			return "there are no user match that username or email";
		}

		String SETCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		StringBuilder strb = new StringBuilder();
		Random rnd = new Random();

		while (strb.length() < 18) { // length of the random string.
			int index = (int) (rnd.nextFloat() * SETCHARS.length());
			strb.append(SETCHARS.charAt(index));
		}
		String str = strb.toString();

		user.setPassword(passwordEncoder.encode(str));
		emailModule.sendSimpleMessage(email, "You have request a new Password from PPLS site",
				"Your new password: " + str);

		User savedUser = userRepo.saveAndFlush(user);
		if (savedUser != null) {
			return "success";
		}

		return "error";
	}

	private ObjectMapper mapper = new ObjectMapper();

	public String resendHashUserFile(String inputField) throws IOException, NoSuchAlgorithmException {
		if (inputField == null || inputField.isEmpty()) {
			return "Input Field can not be null or empty";
		}
		User user = userRepo.findByUsernameOrEmail(inputField, inputField);
		if (user == null) {
			return "No such user found in the system";
		}

		if (user.getGenerateHashFile() == false) {
			return "User still not yet generate this file";
		}
		List<Document> lstDocument = user.getDocument();
		int count = 0;
		List<Document> lstHashDocument = new ArrayList<Document>();
		for (Document d : lstDocument) {
			if (d.getDocumentType().getId() == 1 && d.getStatus().equalsIgnoreCase("valid")) {
				lstHashDocument.add(d);
				count = 1;
			}
		}
		if (count != 1) {
			return "User ID not up load or validate yet";
		}
		for (Document d : lstDocument) {
			if (d.getDocumentType().getId() == 2 && d.getStatus().equalsIgnoreCase("valid")) {
				lstHashDocument.add(d);
				count = 2;
			}
		}
		if (count != 2) {
			return "User Video not up load or validate yet";
		}
		if (count == 2) {
			File file = new File("pplsHash_" + user.getUsername() + ".txt");
			Writer writer = new BufferedWriter(new FileWriter(file));

			lstDocument = new ArrayList<Document>();
			for (Document d : lstHashDocument) {
				Document document = new Document();
				document.setId(d.getId());
				document.setDocumentId(d.getDocumentId());
				document.setStatus(d.getStatus());
				List<DocumentFile> lstDocFile = new ArrayList<DocumentFile>();
				for (DocumentFile df : d.getDocumentFile()) {
					DocumentFile documentFile = new DocumentFile();
					documentFile.setId(df.getId());
					documentFile.setData(df.getData());
					documentFile.setFileName(df.getFileName());
					documentFile.setFileType(df.getFileType());
					lstDocFile.add(documentFile);
				}
				document.setDocumentFile(lstDocFile);
				lstDocument.add(document);
			}

			String contents = kh.hashWithJavaMessageDigest(mapper.writeValueAsString(lstDocument));
			writer.write(contents);
			writer.close();

			emailModule.sendMessageWithAttachment(user.getEmail(), "(Admin)PPLS resend you hash file",
					"Check this email attachment for your hash file", file.getAbsolutePath());

			return "success";
		}
		return "Error";
	}
}