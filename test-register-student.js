// Test script to register a student via API
const axios = require('axios');

const API_URL = 'http://localhost:7000/api';

async function registerStudent() {
  try {
    // First, login to get token
    console.log('Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful!');
    
    // Register a new student
    console.log('Registering student...');
    const studentData = {
      firstName: 'Ahmad',
      lastName: 'Faisal',
      dateOfBirth: '2010-05-15',
      gender: 'male',
      address: 'Sotokou Layout, Allatentu, Kombo North District',
      phone: '+220 123 4567',
      email: 'ahmad.faisal@example.com',
      parentName: 'Mohammed Faisal',
      parentPhone: '+220 765 4321',
      parentEmail: 'mohammed.faisal@example.com',
      class: 'Level 1',
      status: 'active'
    };
    
    const studentResponse = await axios.post(`${API_URL}/students`, studentData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Student registered successfully!');
    console.log('Student ID:', studentResponse.data.studentId);
    console.log('Student Name:', studentResponse.data.firstName, studentResponse.data.lastName);
    console.log('\nFull student data:');
    console.log(JSON.stringify(studentResponse.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

registerStudent();

