package capstone.p2plend.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.Security;

import org.bouncycastle.jcajce.provider.digest.Keccak;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.encoders.Hex;
import org.springframework.stereotype.Component;

@Component
public class Keccak256Hashing {

	public final String KECCAK_256 = "Keccak-256";
	
	public String hashWithJavaMessageDigest(final String originalString) throws NoSuchAlgorithmException {
		Security.addProvider(new BouncyCastleProvider());
		final MessageDigest digest = MessageDigest.getInstance(KECCAK_256);
		final byte[] encodedhash = digest.digest(originalString.getBytes(StandardCharsets.UTF_8));
		return bytesToHex(encodedhash);
	}

	public String hashWithBouncyCastle(final String originalString) {
		Keccak.Digest256 digest256 = new Keccak.Digest256();
		byte[] hashbytes = digest256.digest(originalString.getBytes(StandardCharsets.UTF_8));
		return new String(Hex.encode(hashbytes));
	}

	public String bytesToHex(byte[] hash) {
		StringBuffer hexString = new StringBuffer();
		for (byte h : hash) {
			String hex = Integer.toHexString(0xff & h);
			if (hex.length() == 1)
				hexString.append('0');
			hexString.append(hex);
		}
		return hexString.toString();
	}
}
