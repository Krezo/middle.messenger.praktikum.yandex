import { computed, reactive, watch, Ref } from '../modules/reactivity'
import { IObserver } from '../modules/observer'

export interface FormData<FieldData> {
  [key: string]: FieldData
}

interface FieldDataExt {
  label: string
  errors: { [key: string]: boolean }
  valid: boolean
  toched: boolean
  errorMessage: string
  blur: () => void
  reassign: () => void
}

export interface FieldData<V> {
  value: V
  validators?: {
    [key: string]: (
      value: V,
      formData?: FormData<FieldData<V> & Partial<FieldDataExt>>
    ) => boolean | string
  }
}

export const useForm = <
  K extends FieldData<E> & Partial<FieldDataExt>,
  T extends FormData<K>,
  E = T[keyof T]['value']
>(
  init: T
): {
  formData: { [K in keyof T]: T[K] & FieldDataExt }
  values: IObserver<{ [K in keyof T]: T[K]['value'] }>
  isValid: Ref<boolean>
} => {
  const formData: any = reactive(init)
  for (const [key, _] of Object.entries(formData)) {
    const formField = formData[key]
    formField.errors = reactive({})
    formField.toched = false
    formField.valid = true
    formField.blur = () => {
      formField.toched = true
    }
    formField.errorMessage = ''

    const reassignFunc = (value: E) => {
      let lastErrorMessage = ''
      formField.valid = true
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
      formField.errorMessage = lastErrorMessage
    }

    formField.reassign = () => reassignFunc(formField.value)

    watch(() => formField.value, reassignFunc, { immediate: true })
  }

  const values = computed(() => {
    const formValues: any = {}
    Object.keys(formData).forEach((k) => (formValues[k] = formData[k].value))
    return formValues
  })

  const isValid = computed(() => {
    let res = true
    for (const key in formData) {
      res = !!formData[key].valid && res
    }
    return res
  })

  return { formData, values, isValid }
}
