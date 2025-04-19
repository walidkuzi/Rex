
**System Users**:

| Column          | Type        |
| --------------- | ----------- |
| ID              | STRING/UUID |
| First/Last name | STRING      |
| Password        | STRING      |
| Email           | STRING      |

---

**courses**:

| Column          | Type        |
| --------------- | ----------- |
| ID              | STRING      |
| Name            | STRING      |
| createdByUserId | STRING/UUID |
| CreatedAt       | Timestamp   |

---

**Resit Exams**:

| Column           | Type        |
| ---------------- | ----------- |
| CourseID         | STRING      |
| Letters          | STRING      |
| ExamDate         | Date        |
| Deadline         | Date        |
| ExamLocation     | STRING      |
| CreatedAt        | Timestamp   |
| createdBy        | STRING/UUID |
| InstructorID     | STRING/UUID |
| StudentID        | STRING/UUID |
| AddedAtByStudent | Timestamp   |

---


**Instructor**

| Column     | Type        |
| ---------- | ----------- |
| ID         | STRING/UUID |
| Courses    | STRING      |
| ResitExams | STRING      |



**Students**

| Column     | Type        |
| ---------- | ----------- |
| ID         | STRING/UUID |
| Courses    | STRING      |
| ResitExams | STRING      |

**Secretary**

| Column       | Type        |
| ------------ | ----------- |
| ID           | STRING/UUID |
| ExamID       | STRING/UUID |
| CoursesID    | STRING/UUID |
| StudentID    | STRING/UUID |
| InstructorID | STRING/UUID |


-