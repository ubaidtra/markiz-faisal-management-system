const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

async function generateStudentId() {
  const year = new Date().getFullYear();
  const prefix = `STU-${year}`;
  
  try {
    const lastStudent = await Student.findOne({
      studentId: { $regex: `^${prefix}` }
    }).sort({ studentId: -1 });
    
    let sequence = 1;
    if (lastStudent && lastStudent.studentId) {
      const parts = lastStudent.studentId.split('-');
      if (parts.length >= 3) {
        const lastSequence = parseInt(parts[2] || '0');
        if (!isNaN(lastSequence)) {
          sequence = lastSequence + 1;
        }
      }
    }
    
    let attempts = 0;
    let newId;
    do {
      newId = `${prefix}-${sequence.toString().padStart(4, '0')}`;
      const exists = await Student.findOne({ studentId: newId });
      if (!exists) {
        return newId;
      }
      sequence++;
      attempts++;
    } while (attempts < 100);
    
    return newId;
  } catch (error) {
    return `${prefix}-${Date.now().toString().slice(-4)}`;
  }
}

async function generateTeacherId() {
  const year = new Date().getFullYear();
  const prefix = `TCH-${year}`;
  
  try {
    const lastTeacher = await Teacher.findOne({
      teacherId: { $regex: `^${prefix}` }
    }).sort({ teacherId: -1 });
    
    let sequence = 1;
    if (lastTeacher && lastTeacher.teacherId) {
      const parts = lastTeacher.teacherId.split('-');
      if (parts.length >= 3) {
        const lastSequence = parseInt(parts[2] || '0');
        if (!isNaN(lastSequence)) {
          sequence = lastSequence + 1;
        }
      }
    }
    
    let attempts = 0;
    let newId;
    do {
      newId = `${prefix}-${sequence.toString().padStart(4, '0')}`;
      const exists = await Teacher.findOne({ teacherId: newId });
      if (!exists) {
        return newId;
      }
      sequence++;
      attempts++;
    } while (attempts < 100);
    
    return newId;
  } catch (error) {
    return `${prefix}-${Date.now().toString().slice(-4)}`;
  }
}

module.exports = {
  generateStudentId,
  generateTeacherId
};

