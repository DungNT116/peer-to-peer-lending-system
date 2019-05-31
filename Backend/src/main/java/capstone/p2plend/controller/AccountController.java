package capstone.p2plend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;

import capstone.p2plend.entity.Account;
import capstone.p2plend.filter.ApiResponse;
import capstone.p2plend.filter.JwtAuthenticationResponse;
import capstone.p2plend.filter.JwtTokenProvider;
import capstone.p2plend.filter.LoginRequest;
import capstone.p2plend.filter.SignUpRequest;
import capstone.p2plend.repo.AccountRepository;
import capstone.p2plend.service.AccountService;

@RestController
public class AccountController {

	@Autowired
	private AccountService accountService;

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	JwtTokenProvider tokenProvider;

	@Autowired
	AccountRepository userRepository;

	@PostMapping("/api/auth/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsernameOrEmail(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);

		String jwt = tokenProvider.generateToken(authentication);
		return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
	}

	@PostMapping("/api/auth/signup")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
//		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
//			return new ResponseEntity(new ApiResponse(false, "Username is already taken!"), HttpStatus.BAD_REQUEST);
//		}
//
//		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
//			return new ResponseEntity(new ApiResponse(false, "Email Address already in use!"), HttpStatus.BAD_REQUEST);
//		}

		// Creating user's account
		Account account = new Account(signUpRequest.getUsername(), signUpRequest.getEmail(),
				signUpRequest.getPassword());

//		account.setPassword(passwordEncoder.encode(account.getPassword()));
		account.setPassword(account.getPassword());

		account.setRole("ROLE_USER");
		
		Account result = userRepository.save(account);

		URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/users/{username}")
				.buildAndExpand(result.getUsername()).toUri();

		return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully"));
	}

//	@GetMapping(value = "/rest/accounts")
//	public ResponseEntity<List<Account>> getAllUser() {
//		return new ResponseEntity<List<Account>>(accountService.findAll(), HttpStatus.OK);
//	}

	@GetMapping(value = "/rest/account")
	public ResponseEntity<Object> getAccountByUsername(@RequestParam String username) {
		Account account = accountService.findUsername(username);
		if (account != null) {
			return new ResponseEntity<Object>(account, HttpStatus.OK);
		}
		return new ResponseEntity<Object>("Not Found User", HttpStatus.NO_CONTENT);
	}

	@CrossOrigin
	@PostMapping(value = "/api/createAccount")
	public Integer createAccount(@RequestBody Account account) {
		HttpStatus status = null;
		try {
			accountService.createAccount(account);
			status = HttpStatus.OK;
		} catch (Exception e) {
			status = HttpStatus.BAD_REQUEST;
		}
		return status.value();
	}

}
