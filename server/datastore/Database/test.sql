CREATE TRIGGER UpdateResitExamEnrollStatusAfterUpdateGrade
AFTER UPDATE OF ResitExamEnrollGrade ON ResitExamEnroll
FOR EACH ROW
WHEN NEW.ResitExamEnrollGrade IS NOT NULL
BEGIN
    UPDATE ResitExamEnroll 
    SET Status = 'Attended' 
    WHERE ResitExamEnrollId = NEW.ResitExamEnrollId;
END;
