package capstone.p2plend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import capstone.p2plend.repo.DocumentImageRepository;

@Service
public class DocumentImageService {

	@Autowired
	DocumentImageRepository docImgRepo;
	
}
