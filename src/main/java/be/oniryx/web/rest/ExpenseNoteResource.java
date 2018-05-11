package be.oniryx.web.rest;

import com.codahale.metrics.annotation.Timed;
import be.oniryx.domain.ExpenseNote;

import be.oniryx.repository.ExpenseNoteRepository;
import be.oniryx.web.rest.errors.BadRequestAlertException;
import be.oniryx.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing ExpenseNote.
 */
@RestController
@RequestMapping("/api")
public class ExpenseNoteResource {

    private final Logger log = LoggerFactory.getLogger(ExpenseNoteResource.class);

    private static final String ENTITY_NAME = "expenseNote";

    private final ExpenseNoteRepository expenseNoteRepository;

    public ExpenseNoteResource(ExpenseNoteRepository expenseNoteRepository) {
        this.expenseNoteRepository = expenseNoteRepository;
    }

    /**
     * POST  /expense-notes : Create a new expenseNote.
     *
     * @param expenseNote the expenseNote to create
     * @return the ResponseEntity with status 201 (Created) and with body the new expenseNote, or with status 400 (Bad Request) if the expenseNote has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/expense-notes")
    @Timed
    public ResponseEntity<ExpenseNote> createExpenseNote(@Valid @RequestBody ExpenseNote expenseNote) throws URISyntaxException {
        log.debug("REST request to save ExpenseNote : {}", expenseNote);
        if (expenseNote.getId() != null) {
            throw new BadRequestAlertException("A new expenseNote cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ExpenseNote result = expenseNoteRepository.save(expenseNote);
        return ResponseEntity.created(new URI("/api/expense-notes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /expense-notes : Updates an existing expenseNote.
     *
     * @param expenseNote the expenseNote to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated expenseNote,
     * or with status 400 (Bad Request) if the expenseNote is not valid,
     * or with status 500 (Internal Server Error) if the expenseNote couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/expense-notes")
    @Timed
    public ResponseEntity<ExpenseNote> updateExpenseNote(@Valid @RequestBody ExpenseNote expenseNote) throws URISyntaxException {
        log.debug("REST request to update ExpenseNote : {}", expenseNote);
        if (expenseNote.getId() == null) {
            return createExpenseNote(expenseNote);
        }
        ExpenseNote result = expenseNoteRepository.save(expenseNote);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, expenseNote.getId().toString()))
            .body(result);
    }

    /**
     * GET  /expense-notes : get all the expenseNotes.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of expenseNotes in body
     */
    @GetMapping("/expense-notes")
    @Timed
    public List<ExpenseNote> getAllExpenseNotes() {
        log.debug("REST request to get all ExpenseNotes");
        return expenseNoteRepository.findAll();
        }

    /**
     * GET  /expense-notes/:id : get the "id" expenseNote.
     *
     * @param id the id of the expenseNote to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the expenseNote, or with status 404 (Not Found)
     */
    @GetMapping("/expense-notes/{id}")
    @Timed
    public ResponseEntity<ExpenseNote> getExpenseNote(@PathVariable Long id) {
        log.debug("REST request to get ExpenseNote : {}", id);
        ExpenseNote expenseNote = expenseNoteRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(expenseNote));
    }

    /**
     * DELETE  /expense-notes/:id : delete the "id" expenseNote.
     *
     * @param id the id of the expenseNote to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/expense-notes/{id}")
    @Timed
    public ResponseEntity<Void> deleteExpenseNote(@PathVariable Long id) {
        log.debug("REST request to delete ExpenseNote : {}", id);
        expenseNoteRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
