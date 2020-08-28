/* eslint-disable no-undef */
const fileValidator = require('../../controllers/file-validation')
let enrollmentInfo, inputRecords, outputRecords

describe('To assert the datas present in the enrollment file', () => {
  beforeAll(async () => {
    enrollmentInfo = await fileValidator.dataInfo('testData/enrollment-input-file.csv', 'testData/enrollment-output-file.csv')
    inputRecords = enrollmentInfo.inputData.records
    outputRecords = enrollmentInfo.outputData.records
  })

  it('Verify whether the course_section_integration_id, user_role, available_ind, credit_hours, last_access_date, and authoritative_status column values are being correctly shown as per input file without anonymization', () => {
    const dataFeilds = fileValidator.getEnrollmentInfo().non_anonymize_fields
    let enrollmentFieldStatus = true
    inputRecords.forEach(function (currentRecord, index) {
      dataFeilds.forEach(function (currentField) {
        try {
          currentRecord[currentField] === '' ? expect(outputRecords[index][currentField]).toBe('') : expect(currentRecord[currentField]).toBe(outputRecords[index][currentField])
        } catch {
          enrollmentFieldStatus = false
          console.error('"' + currentRecord[currentField] + '" for the field [' + currentField + '] should not be "' + outputRecords[index][currentField] + '"')
        }
      })
    })
    expect(enrollmentFieldStatus).toBe(true)
  })

  /** Generic Validations **/
  it('Verify whether the number of records are correctly matched between the input file and output file.', () => {
    expect(outputRecords.length).toEqual(inputRecords.length)
  })

  it('Verify whether the Headers are correctly displayed in the output file.', () => {
    expect(enrollmentInfo.inputData.header[0]).toEqual(enrollmentInfo.outputData.header[0])
  })

  it('Verify that the output file column with empty value is correctly shown based on the empty value in the input file.', () => {
    let emptyColumnStatus = true
    const dataFields = fileValidator.getEnrollmentInfo().non_anonymize_fields
    inputRecords.forEach((currentRecord, index) => {
      dataFields.forEach(currentField => {
        try {
          if (currentRecord[currentField] === '') {
            expect(outputRecords[index][currentField]).toBe('')
          }
        } catch (err) {
          emptyColumnStatus = false
          console.error(currentField + ' - [' + currentRecord[currentField] + '] input value does not match with the output value [' + outputRecords[index][currentField] + ']')
        }
      })
    })
    expect(emptyColumnStatus).toBe(true)
  })

  it('Verify that the file column with date value is correctly shown based on the date value present in the input file.', () => {
    let dateValueStatus = true
    outputRecords.forEach(function (currentRecord, index) {
      try {
        currentRecord.last_access_date === '' ? expect(currentRecord.last_access_date).toBe('') : expect(fileValidator.verifyTimestamp(currentRecord.last_access_date)).toBeTruthy()
      } catch (err) {
        dateValueStatus = false
        console.error('last_access_date - [' + currentRecord.last_access_date + '] output value does not displayed in the format yyyy-mm-dd hh:mm:ss [' + inputRecords[index].last_access_date + ']')
      }
    })
    expect(dateValueStatus).toBe(true)
  })
})
