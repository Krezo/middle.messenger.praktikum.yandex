import { computed, reactive, watch } from '../modules/reactivity'

interface FormData<FieldData> {
  [key: string]: FieldData
}

interface FieldDataExt {
  label: string
  errors: { [key: string]: boolean }
  valid: boolean
  toched: boolean
  errorMessage: string
  blur: () => void,
  reassign: () => void
}

interface FieldData extends Record<string, any> {
  value: string
  validators?: { [key: string]: (value: string, formData?: FormData<FieldData & Partial<FieldDataExt>>, ...params: any) => boolean | string }
}

export const useForm = (init: FormData<FieldData & Partial<FieldDataExt>>): FormData<FieldData & Required<FieldDataExt>> => {
  const formData = reactive(init)
  for (const [key, value] of Object.entries(formData)) {
    const formField = formData[key]
    formField.errors = reactive({})
    formField.toched = false;
    formField.valid = true;
    formField.blur = () => {
      formField.toched = true
    }
    formField.errorMessage = ''

    const reassignFunc = (value: string) => {
      let lastErrorMessage = '';
      formField.valid = true;
      for (const name of Object.keys(formField.validators ?? {})) {
        const isValid = formField.validators![name](value, formData)
        formField.errors![name] = !isValid
        if (!isValid || typeof isValid === 'string') {
          if (typeof isValid === 'string') {
            lastErrorMessage = isValid.toString()
          }
          formField.valid = false
        }
      }
      formField.errorMessage = lastErrorMessage;

    }

    formField.reassign = () => reassignFunc(formField.value);

    watch(
      () => formField.value,
      reassignFunc,
      { immediate: true }
    )
  }

  const values = computed(() => {
    const formValues: Record<string, string> = {}
    Object.keys(formData).forEach((k) => formValues[k] = formData[k].value)
    return formValues;
  })

  const isValid = computed(() => {
    let res = true;
    for (const key in formData) {
      res = !!formData[key].valid && res;
    }
    return res;
  })

  return { formData, values, isValid }
} 
