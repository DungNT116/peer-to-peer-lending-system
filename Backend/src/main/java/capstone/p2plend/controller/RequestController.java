package capstone.p2plend.controller;

import capstone.p2plend.entity.Request;
import capstone.p2plend.exception.RequestNotFoundException;
import capstone.p2plend.repo.RequestRepository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RequestController {

	private final RequestRepository repository;

	RequestController(RequestRepository repository) {
		this.repository = repository;
	}

	// Aggregate root

	@GetMapping("/requests")
	public List<Request> all() {
		return repository.findAll();
	}

	@PostMapping("/requests")
	public Request newRequest(@RequestBody Request newRequest) {
		return repository.save(newRequest);
	}

	// Single item

	@GetMapping("/requests/{id}")
	public Request one(@PathVariable Integer id) {

		return repository.findById(id).orElseThrow(() -> new RequestNotFoundException(id));
	}

	@DeleteMapping("/requests/{id}")
	public void deleteRequest(@PathVariable Integer id) {
		repository.deleteById(id);
	}

}
