package be.oniryx.web.rest;

import be.oniryx.OniryxHackathonApp;

import be.oniryx.domain.ExpenseNote;
import be.oniryx.repository.ExpenseNoteRepository;
import be.oniryx.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static be.oniryx.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import be.oniryx.domain.enumeration.Status;
/**
 * Test class for the ExpenseNoteResource REST controller.
 *
 * @see ExpenseNoteResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = OniryxHackathonApp.class)
public class ExpenseNoteResourceIntTest {

    private static final BigDecimal DEFAULT_MONTANT = new BigDecimal(1);
    private static final BigDecimal UPDATED_MONTANT = new BigDecimal(2);

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String DEFAULT_JUSTIFICATION = "AAAAAAAAAA";
    private static final String UPDATED_JUSTIFICATION = "BBBBBBBBBB";

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String DEFAULT_PROVIDER = "AAAAAAAAAA";
    private static final String UPDATED_PROVIDER = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_SUBMIT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_SUBMIT_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_PAYMENT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_PAYMENT_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Status DEFAULT_STATUS = Status.ENCODED;
    private static final Status UPDATED_STATUS = Status.SUSPENDED;

    @Autowired
    private ExpenseNoteRepository expenseNoteRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restExpenseNoteMockMvc;

    private ExpenseNote expenseNote;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ExpenseNoteResource expenseNoteResource = new ExpenseNoteResource(expenseNoteRepository);
        this.restExpenseNoteMockMvc = MockMvcBuilders.standaloneSetup(expenseNoteResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ExpenseNote createEntity(EntityManager em) {
        ExpenseNote expenseNote = new ExpenseNote()
            .montant(DEFAULT_MONTANT)
            .label(DEFAULT_LABEL)
            .justification(DEFAULT_JUSTIFICATION)
            .comment(DEFAULT_COMMENT)
            .provider(DEFAULT_PROVIDER)
            .submitDate(DEFAULT_SUBMIT_DATE)
            .paymentDate(DEFAULT_PAYMENT_DATE)
            .status(DEFAULT_STATUS);
        return expenseNote;
    }

    @Before
    public void initTest() {
        expenseNote = createEntity(em);
    }

    @Test
    @Transactional
    public void createExpenseNote() throws Exception {
        int databaseSizeBeforeCreate = expenseNoteRepository.findAll().size();

        // Create the ExpenseNote
        restExpenseNoteMockMvc.perform(post("/api/expense-notes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(expenseNote)))
            .andExpect(status().isCreated());

        // Validate the ExpenseNote in the database
        List<ExpenseNote> expenseNoteList = expenseNoteRepository.findAll();
        assertThat(expenseNoteList).hasSize(databaseSizeBeforeCreate + 1);
        ExpenseNote testExpenseNote = expenseNoteList.get(expenseNoteList.size() - 1);
        assertThat(testExpenseNote.getMontant()).isEqualTo(DEFAULT_MONTANT);
        assertThat(testExpenseNote.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testExpenseNote.getJustification()).isEqualTo(DEFAULT_JUSTIFICATION);
        assertThat(testExpenseNote.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testExpenseNote.getProvider()).isEqualTo(DEFAULT_PROVIDER);
        assertThat(testExpenseNote.getSubmitDate()).isEqualTo(DEFAULT_SUBMIT_DATE);
        assertThat(testExpenseNote.getPaymentDate()).isEqualTo(DEFAULT_PAYMENT_DATE);
        assertThat(testExpenseNote.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    public void createExpenseNoteWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = expenseNoteRepository.findAll().size();

        // Create the ExpenseNote with an existing ID
        expenseNote.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restExpenseNoteMockMvc.perform(post("/api/expense-notes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(expenseNote)))
            .andExpect(status().isBadRequest());

        // Validate the ExpenseNote in the database
        List<ExpenseNote> expenseNoteList = expenseNoteRepository.findAll();
        assertThat(expenseNoteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkMontantIsRequired() throws Exception {
        int databaseSizeBeforeTest = expenseNoteRepository.findAll().size();
        // set the field null
        expenseNote.setMontant(null);

        // Create the ExpenseNote, which fails.

        restExpenseNoteMockMvc.perform(post("/api/expense-notes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(expenseNote)))
            .andExpect(status().isBadRequest());

        List<ExpenseNote> expenseNoteList = expenseNoteRepository.findAll();
        assertThat(expenseNoteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = expenseNoteRepository.findAll().size();
        // set the field null
        expenseNote.setLabel(null);

        // Create the ExpenseNote, which fails.

        restExpenseNoteMockMvc.perform(post("/api/expense-notes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(expenseNote)))
            .andExpect(status().isBadRequest());

        List<ExpenseNote> expenseNoteList = expenseNoteRepository.findAll();
        assertThat(expenseNoteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkJustificationIsRequired() throws Exception {
        int databaseSizeBeforeTest = expenseNoteRepository.findAll().size();
        // set the field null
        expenseNote.setJustification(null);

        // Create the ExpenseNote, which fails.

        restExpenseNoteMockMvc.perform(post("/api/expense-notes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(expenseNote)))
            .andExpect(status().isBadRequest());

        List<ExpenseNote> expenseNoteList = expenseNoteRepository.findAll();
        assertThat(expenseNoteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkProviderIsRequired() throws Exception {
        int databaseSizeBeforeTest = expenseNoteRepository.findAll().size();
        // set the field null
        expenseNote.setProvider(null);

        // Create the ExpenseNote, which fails.

        restExpenseNoteMockMvc.perform(post("/api/expense-notes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(expenseNote)))
            .andExpect(status().isBadRequest());

        List<ExpenseNote> expenseNoteList = expenseNoteRepository.findAll();
        assertThat(expenseNoteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSubmitDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = expenseNoteRepository.findAll().size();
        // set the field null
        expenseNote.setSubmitDate(null);

        // Create the ExpenseNote, which fails.

        restExpenseNoteMockMvc.perform(post("/api/expense-notes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(expenseNote)))
            .andExpect(status().isBadRequest());

        List<ExpenseNote> expenseNoteList = expenseNoteRepository.findAll();
        assertThat(expenseNoteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllExpenseNotes() throws Exception {
        // Initialize the database
        expenseNoteRepository.saveAndFlush(expenseNote);

        // Get all the expenseNoteList
        restExpenseNoteMockMvc.perform(get("/api/expense-notes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(expenseNote.getId().intValue())))
            .andExpect(jsonPath("$.[*].montant").value(hasItem(DEFAULT_MONTANT.intValue())))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL.toString())))
            .andExpect(jsonPath("$.[*].justification").value(hasItem(DEFAULT_JUSTIFICATION.toString())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())))
            .andExpect(jsonPath("$.[*].provider").value(hasItem(DEFAULT_PROVIDER.toString())))
            .andExpect(jsonPath("$.[*].submitDate").value(hasItem(DEFAULT_SUBMIT_DATE.toString())))
            .andExpect(jsonPath("$.[*].paymentDate").value(hasItem(DEFAULT_PAYMENT_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void getExpenseNote() throws Exception {
        // Initialize the database
        expenseNoteRepository.saveAndFlush(expenseNote);

        // Get the expenseNote
        restExpenseNoteMockMvc.perform(get("/api/expense-notes/{id}", expenseNote.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(expenseNote.getId().intValue()))
            .andExpect(jsonPath("$.montant").value(DEFAULT_MONTANT.intValue()))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL.toString()))
            .andExpect(jsonPath("$.justification").value(DEFAULT_JUSTIFICATION.toString()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT.toString()))
            .andExpect(jsonPath("$.provider").value(DEFAULT_PROVIDER.toString()))
            .andExpect(jsonPath("$.submitDate").value(DEFAULT_SUBMIT_DATE.toString()))
            .andExpect(jsonPath("$.paymentDate").value(DEFAULT_PAYMENT_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingExpenseNote() throws Exception {
        // Get the expenseNote
        restExpenseNoteMockMvc.perform(get("/api/expense-notes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateExpenseNote() throws Exception {
        // Initialize the database
        expenseNoteRepository.saveAndFlush(expenseNote);
        int databaseSizeBeforeUpdate = expenseNoteRepository.findAll().size();

        // Update the expenseNote
        ExpenseNote updatedExpenseNote = expenseNoteRepository.findOne(expenseNote.getId());
        // Disconnect from session so that the updates on updatedExpenseNote are not directly saved in db
        em.detach(updatedExpenseNote);
        updatedExpenseNote
            .montant(UPDATED_MONTANT)
            .label(UPDATED_LABEL)
            .justification(UPDATED_JUSTIFICATION)
            .comment(UPDATED_COMMENT)
            .provider(UPDATED_PROVIDER)
            .submitDate(UPDATED_SUBMIT_DATE)
            .paymentDate(UPDATED_PAYMENT_DATE)
            .status(UPDATED_STATUS);

        restExpenseNoteMockMvc.perform(put("/api/expense-notes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedExpenseNote)))
            .andExpect(status().isOk());

        // Validate the ExpenseNote in the database
        List<ExpenseNote> expenseNoteList = expenseNoteRepository.findAll();
        assertThat(expenseNoteList).hasSize(databaseSizeBeforeUpdate);
        ExpenseNote testExpenseNote = expenseNoteList.get(expenseNoteList.size() - 1);
        assertThat(testExpenseNote.getMontant()).isEqualTo(UPDATED_MONTANT);
        assertThat(testExpenseNote.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testExpenseNote.getJustification()).isEqualTo(UPDATED_JUSTIFICATION);
        assertThat(testExpenseNote.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testExpenseNote.getProvider()).isEqualTo(UPDATED_PROVIDER);
        assertThat(testExpenseNote.getSubmitDate()).isEqualTo(UPDATED_SUBMIT_DATE);
        assertThat(testExpenseNote.getPaymentDate()).isEqualTo(UPDATED_PAYMENT_DATE);
        assertThat(testExpenseNote.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    public void updateNonExistingExpenseNote() throws Exception {
        int databaseSizeBeforeUpdate = expenseNoteRepository.findAll().size();

        // Create the ExpenseNote

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restExpenseNoteMockMvc.perform(put("/api/expense-notes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(expenseNote)))
            .andExpect(status().isCreated());

        // Validate the ExpenseNote in the database
        List<ExpenseNote> expenseNoteList = expenseNoteRepository.findAll();
        assertThat(expenseNoteList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteExpenseNote() throws Exception {
        // Initialize the database
        expenseNoteRepository.saveAndFlush(expenseNote);
        int databaseSizeBeforeDelete = expenseNoteRepository.findAll().size();

        // Get the expenseNote
        restExpenseNoteMockMvc.perform(delete("/api/expense-notes/{id}", expenseNote.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ExpenseNote> expenseNoteList = expenseNoteRepository.findAll();
        assertThat(expenseNoteList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ExpenseNote.class);
        ExpenseNote expenseNote1 = new ExpenseNote();
        expenseNote1.setId(1L);
        ExpenseNote expenseNote2 = new ExpenseNote();
        expenseNote2.setId(expenseNote1.getId());
        assertThat(expenseNote1).isEqualTo(expenseNote2);
        expenseNote2.setId(2L);
        assertThat(expenseNote1).isNotEqualTo(expenseNote2);
        expenseNote1.setId(null);
        assertThat(expenseNote1).isNotEqualTo(expenseNote2);
    }
}
