import getGfFieldId from '@/functions/gravityForms/getGfFieldId'
import * as Yup from 'yup'

/**
 * Get Yup string schema object based on GF Feild Props.
 *
 * @author Mike England <mike.england@webdevstudios.com>
 * @since 2021-01-07
 */
class stringSchemaGetter {
  constructor(fieldData) {
    this.fieldData = fieldData
  }

  /**
   * Get Yup schema object with validation requirements.
   *
   * @author Mike England <mike.england@webdevstudios.com>
   * @since 2021-01-07
   * @returns {Object} Combined Yup validationSchema Object.
   */
  get schema() {
    return Yup.string()
      .concat(this.getMaxLengthSchema())
      .concat(this.getRequiredSchema())
  }

  /**
   * Get Yup required field validaion.
   *
   * @author Mike England <mike.england@webdevstudios.com>
   * @since 2021-01-07
   * @return {Object} Yup validationSchema Object.
   * @link https://github.com/jquense/yup#stringrequiredmessage-string--function-schema
   */
  getRequiredSchema() {
    if (!this.fieldData?.isRequired) {
      return
    }

    return Yup.string().required('Required!')
  }

  /**
   * Get Yup max line length validaion.
   *
   * @author Mike England <mike.england@webdevstudios.com>
   * @since 2021-01-07
   * @return {Object} Yup validationSchema Object.
   * @link https://github.com/jquense/yup#stringmaxlimit-number--ref-message-string--function-schema
   */
  getMaxLengthSchema() {
    if (!this.fieldData?.maxLength) {
      return
    }

    return Yup.string().max(
      this.fieldData.maxLength,
      `Must be ${this.fieldData.maxLength} characters or less`
    )
  }
}

/**
 * Match field type with Yup schema object.
 *
 * @param {Object} fieldData GravityForm field props.
 * @returns {Object} Schema validation for field.
 *
 * @author Mike England <mike.england@webdevstudios.com>
 * @since 2021-01-07
 * @link https://github.com/jquense/yup#api
 */
function getValidationSchemaType(fieldData) {
  let schemaGetter = null

  // Get Schema based on GravityForm field type.
  switch (fieldData?.type) {
    case 'text':
      schemaGetter = new stringSchemaGetter(fieldData).schema
      break

    default:
      return
  }

  return schemaGetter
}

/**
 * Map props to validation schemas.
 *
 * @param {Object} fieldData GravityForm field props.
 */
export default function getGfFieldValidationSchema(fieldData) {
  const validationSchema = getValidationSchemaType(fieldData)

  return {
    [getGfFieldId(fieldData.id)]: validationSchema
  }
}
