package capstone.p2plend.repo;

import capstone.p2plend.entity.Request;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request, Integer> {

}
