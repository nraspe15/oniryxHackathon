package be.oniryx.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Employee.
 */
@Entity
@Table(name = "employee")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "trigram", nullable = false)
    private String trigram;

    @OneToOne(mappedBy = "employee")
    @JsonIgnore
    private Template template;

    @OneToOne(mappedBy = "employee")
    @JsonIgnore
    private ExpenseNote expenseNote;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTrigram() {
        return trigram;
    }

    public Employee trigram(String trigram) {
        this.trigram = trigram;
        return this;
    }

    public void setTrigram(String trigram) {
        this.trigram = trigram;
    }

    public Template getTemplate() {
        return template;
    }

    public Employee template(Template template) {
        this.template = template;
        return this;
    }

    public void setTemplate(Template template) {
        this.template = template;
    }

    public ExpenseNote getExpenseNote() {
        return expenseNote;
    }

    public Employee expenseNote(ExpenseNote expenseNote) {
        this.expenseNote = expenseNote;
        return this;
    }

    public void setExpenseNote(ExpenseNote expenseNote) {
        this.expenseNote = expenseNote;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Employee employee = (Employee) o;
        if (employee.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), employee.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Employee{" +
            "id=" + getId() +
            ", trigram='" + getTrigram() + "'" +
            "}";
    }
}
