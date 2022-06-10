import { ChangeEvent, RefObject } from 'react'

import { useMount } from 'hooks'
import { InputCancelIcon } from 'assets/svgs'
import { cx } from 'styles'
import styles from './inputText.module.scss'

interface IInputFormProps {
  formTitle: string
  value: string
  onBlur: () => void
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  reset: () => void
  hasError: boolean
  type: string
  errorMessage: string
  inputFocusRef?: RefObject<HTMLInputElement>
}

const InputText = ({
  type,
  errorMessage,
  formTitle,
  value,
  onBlur,
  onChange,
  reset,
  hasError,
  inputFocusRef,
}: IInputFormProps) => {
  const handleResetOnclick = () => {
    reset()
  }

  useMount(() => {
    inputFocusRef?.current?.focus()
  })

  return (
    <div className={styles.inputForm}>
      <label htmlFor={formTitle} className={styles.formTitle}>
        {formTitle}
      </label>
      <input
        type={type}
        id={formTitle}
        value={value}
        onBlur={onBlur}
        onChange={onChange}
        className={styles.inputText}
        ref={inputFocusRef}
      />
      <InputCancelIcon className={cx({ [styles.iconHidden]: value === '' })} onClick={handleResetOnclick} />
      {hasError && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  )
}

export default InputText
