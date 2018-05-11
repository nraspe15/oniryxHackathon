package be.oniryx.repository;

import be.oniryx.domain.ExpenseNote;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the ExpenseNote entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExpenseNoteRepository extends JpaRepository<ExpenseNote, Long> {

}
