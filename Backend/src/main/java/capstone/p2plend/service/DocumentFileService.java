package capstone.p2plend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import capstone.p2plend.repo.DocumentFileRepository;

@Service
public class DocumentFileService {

	@Autowired
	DocumentFileRepository docImgRepo;
	
}
