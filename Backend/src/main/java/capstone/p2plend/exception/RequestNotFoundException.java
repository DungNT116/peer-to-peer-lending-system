package capstone.p2plend.exception;

public class RequestNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public RequestNotFoundException(Integer id) {
        super("Could not find request " + id);
    }
}
