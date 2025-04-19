
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



## Server

  

A simple HTTP server is responsible for authentication, serving stored data, and

potentially ingesting and serving analytics data.

  

- Node.js is selected for implementing the server for speed of development.

- Express.js is the web server framework.

- database ?

  

### Auth

  

For v1, a simple JWT-based auth mechanism is to be used, with passwords

encrypted and stored in the database. 

  

### API

  

**Auth**:

  

```

/signIn [POST]

/signUp [POST]

/signOut [POST]

```

  

**Courses**:

  

```

/course/list [GET]

/course/new [POST]

/course/:id [GET]

/course/:id [DELETE]

```

  

**Resit Exam**:

  

```


/rexam/list [GET]

/rexam/new [POST]

/rexam/:id [GET]

/rexam/:id [DELETE]


```

  


**Students**:

  

```


/student/list [GET]

/student/new [POST]

/student/:id [GET]

/student/:id [DELETE]


```

  

**Instructor**:

  

```


/instructor/list [GET]

/instructor/new [POST]

/instructor/:id [GET]

/instructor/:id [DELETE]


```

  

