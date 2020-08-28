const fs = require('fs')
const csv = require('csv-parser')

const getUserAnonymizeInfo = () => {
  return {
    family_name: 'lname_1234',
    middle_name: 'mname_1234',
    given_name: 'fname_1234',
    email: 'success@simulator.amazonses.com',
    secondary_email: 'success@simulator.amazonses.com',
    student_id: 'sid_1234',
    user_id: 'u_1234',
    birth_dt: {
      min_date: '1965-01-01',
      max_date: '2002-12-31'
    },
    b_phone: '+17031234321',
    m_phone: '+17031234321',
    home_city: 'home_city_1234',
    home_state: 'home_state_1234',
    home_zip: 'home_zip_1234',
    home_county: 'home_county_1234',
    anonymize_fields: ['family_name', 'middle_name', 'given_name', 'email', 'secondary_email', 'student_id', 'user_id', 'birth_dt', 'b_phone', 'm_phone', 'home_city', 'home_state', 'home_zip', 'home_county'],
    non_anonymize_fields: ['gender', 'available_ind', 'assign_student_role', 'allow_login', 'user_timezone'],
    required_fields: ['family_name', 'given_name', 'email', 'user_id', 'available_ind'],
    optional_fields: ['middle_name', 'secondary_email', 'student_id', 'birth_dt', 'b_phone', 'm_phone', 'home_city', 'home_state', 'home_zip', 'home_county'],
    max_characters_fields: ['middle_name', 'home_city', 'home_state', 'home_county']
  }
}

const getSectionInfo = () => {
  return {
    records: ['course_section_name', 'course_section_id', 'term_id', 'course_integration_id', 'start_dt', 'end_dt', 'course_section_delivery', 'maximum_enrollment_count', 'credit_hours', 'registration_call_number']
  }
}

const getRelationshipInfo = () => {
  return {
    non_anonymize_fields: ['parent_role', 'child_role', 'term_id']
  }
}

const getEnrollmentInfo = () => {
  return {
    non_anonymize_fields: ['course_section_integration_id', 'user_role', 'available_ind', 'credit_hours', 'last_access_date']
  }
}

const getDataRow = (inputFilePath) => {
  const records = []; const headerData = []
  return new Promise(function (resolve) {
    fs.createReadStream(inputFilePath)
      .pipe(csv())
      .on('data', function (row) {
        records.push(row)
      })
      .on('headers', (headers) => {
        headerData.push(headers)
      })
      .on('end', function () {
        resolve({
          header: headerData,
          records: records
        })
      })
  })
}

const verifyDateInRange = (fromDate, toDate, dateToCheck, inputDate) => {
  return new Date(dateToCheck) >= new Date(fromDate) && new Date(dateToCheck) <= new Date(toDate) && new Date(dateToCheck) !== inputDate
}

const verifyDateFormat = (inputDate) => {
  const dateRegex = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/
  return dateRegex.test(inputDate)
}

const verifyTimestamp = (inputDate) => {
  const timestampRegex = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/
  return timestampRegex.test(inputDate)
}

const dataInfo = async (inputFile, outputFile) => {
  return {
    inputData: await getDataRow(inputFile),
    outputData: await getDataRow(outputFile)
  }
}

module.exports = {
  getUserAnonymizeInfo,
  getSectionInfo,
  getRelationshipInfo,
  getEnrollmentInfo,
  getDataRow,
  verifyDateInRange,
  verifyDateFormat,
  verifyTimestamp,
  dataInfo
}
