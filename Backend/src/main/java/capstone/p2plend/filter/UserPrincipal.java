//package capstone.p2plend.filter;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//
//import capstone.p2plend.entity.Account;
//
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.util.ArrayList;
//import java.util.Collection;
//import java.util.List;
//import java.util.Objects;
//
//public class UserPrincipal implements UserDetails {
//
//	private static final long serialVersionUID = 1L;
//
//	private Integer id;
//
//	private String name;
//
//	private String username;
//
//	@JsonIgnore
//	private String email;
//
//	@JsonIgnore
//	private String password;
//
//	private Collection<? extends GrantedAuthority> authorities;
//
//	public UserPrincipal(Integer id, String username, String email, String password,
//			Collection<? extends GrantedAuthority> authorities) {
//		this.id = id;
//		this.username = username;
//		this.email = email;
//		this.password = password;
//		this.authorities = authorities;
//	}
//
//	public static UserPrincipal create(Account account) {
////		List<GrantedAuthority> authorities = account.getRole().stream()
////				.map(role -> new SimpleGrantedAuthority(role.getName().name())).collect(Collectors.toList());
//
//		List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();
//		authorities.add(new SimpleGrantedAuthority(account.getRole()));
//
//		return new UserPrincipal(account.getId(), account.getUsername(), account.getEmail(), account.getPassword(),
//				authorities);
//	}
//
//	public Integer getId() {
//		return id;
//	}
//
//	public String getName() {
//		return name;
//	}
//
//	public String getEmail() {
//		return email;
//	}
//
//	@Override
//	public String getUsername() {
//		return username;
//	}
//
//	@Override
//	public String getPassword() {
//		return password;
//	}
//
//	@Override
//	public Collection<? extends GrantedAuthority> getAuthorities() {
//		return authorities;
//	}
//
//	@Override
//	public boolean isAccountNonExpired() {
//		return true;
//	}
//
//	@Override
//	public boolean isAccountNonLocked() {
//		return true;
//	}
//
//	@Override
//	public boolean isCredentialsNonExpired() {
//		return true;
//	}
//
//	@Override
//	public boolean isEnabled() {
//		return true;
//	}
//
//	@Override
//	public boolean equals(Object o) {
//		if (this == o)
//			return true;
//		if (o == null || getClass() != o.getClass())
//			return false;
//		UserPrincipal that = (UserPrincipal) o;
//		return Objects.equals(id, that.id);
//	}
//
//	@Override
//	public int hashCode() {
//
//		return Objects.hash(id);
//	}
//}
