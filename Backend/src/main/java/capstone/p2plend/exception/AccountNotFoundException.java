package capstone.p2plend.exception;

public class AccountNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public AccountNotFoundException(Integer id) {
        super("Could not find account " + id);
    }

}
