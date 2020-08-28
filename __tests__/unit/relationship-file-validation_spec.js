/* eslint-disable no-undef */
const fileValidator = require('../../controllers/file-validation')
let relationshipInfo, inputRecords, outputRecords

describe('To assert the datas present in the relationship file', () => {
  beforeAll(async () => {
    relationshipInfo = await fileValidator.dataInfo('testData/relationship-input-file.csv', 'testData/relationship-output-file.csv')
    inputRecords = relationshipInfo.inputData.records
    outputRecords = relationshipInfo.outputData.records
  })

  it('Verify whether the parent_role,child_role, and term_id column values are being correctly shown as per input file without anonymization.', () => {
    const dataFeilds = fileValidator.getRelationshipInfo().non_anonymize_fields
    let relationshipFieldStatus = true
    inputRecords.forEach(function (currentRecord, index) {
      dataFeilds.forEach(function (currentField) {
        try {
          currentRecord[currentField] === '' ? expect(outputRecords[index][currentField]).toBe('') : expect(currentRecord[currentField]).toBe(outputRecords[index][currentField])
        } catch {
          relationshipFieldStatus = false
          console.error('"' + currentRecord[currentField] + '" for the field [' + currentField + '] should not be "' + outputRecords[index][currentField] + '"')
        }
      })
    })
    expect(relationshipFieldStatus).toBe(true)
  })

  /** Generic Validations **/
  it('Verify whether the number of records are correctly matched between the input file and output file.', () => {
    expect(outputRecords.length).toEqual(inputRecords.length)
  })

  it('Verify whether the Headers are correctly displayed in the output file.', () => {
    expect(relationshipInfo.outputData.header[0]).toEqual(relationshipInfo.inputData.header[0])
  })

  it('Verify that the output file column with empty value is correctly shown based on the empty value in the input file.', () => {
    let emptyColumnStatus = true
    const dataFields = fileValidator.getRelationshipInfo().non_anonymize_fields
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

  it('Verify that the file column with numeric value is correctly shown based on the numeric value present in the input file.', () => {
    let numericValStatus = true
    const dataFeilds = fileValidator.getRelationshipInfo().non_anonymize_fields
    outputRecords.forEach(function (currentRecord, index) {
      dataFeilds.forEach(function (currentField) {
        try {
          currentRecord[currentField] === ''
            ? expect(currentRecord[currentField]).toBe('')
            : expect(currentRecord[currentField]).toBe(outputRecords[index][currentField])
        } catch (err) {
          numericValStatus = false
          console.error(dataFields[index] + ' - [' + inputRecords[outputIndex][currentField] + '] input numeric value does not match with the output numeric value [' + currentRecord[currentField] + ']')
        }
      })
    })
    expect(numericValStatus).toBe(true)
  })
})
