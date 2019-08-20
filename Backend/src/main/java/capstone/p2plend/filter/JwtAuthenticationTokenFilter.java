package capstone.p2plend.filter;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import capstone.p2plend.service.UserService;
import capstone.p2plend.service.JwtService;

public class JwtAuthenticationTokenFilter extends UsernamePasswordAuthenticationFilter {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthenticationTokenFilter.class);
	
	private final static String TOKEN_HEADER = "authorization";
	
	@Autowired
	private JwtService jwtService;
	
	@Autowired
	private UserService userService;

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		LOGGER.info("Do Filter");
		try {
			HttpServletRequest httpRequest = (HttpServletRequest) request;
			String authToken = httpRequest.getHeader(TOKEN_HEADER);
			if (jwtService.validateTokenLogin(authToken)) {
				String username = jwtService.getUsernameFromToken(authToken);
				capstone.p2plend.entity.User user = userService.findUsername(username);
				if (user != null) {
					boolean enabled = true;
					boolean accountNonExpired = true;
					boolean credentialsNonExpired = true;
					boolean accountNonLocked = true;
					UserDetails userDetail = new User(username, user.getPassword(), enabled, accountNonExpired,
							credentialsNonExpired, accountNonLocked, user.getAuthorities());
					UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetail,
							null, userDetail.getAuthorities());
					authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpRequest));
					SecurityContextHolder.getContext().setAuthentication(authentication);
				}
			}
			chain.doFilter(request, response);
		} catch (Exception e) {
			LOGGER.error("Error Do Filter", e);
		}
	}
}
