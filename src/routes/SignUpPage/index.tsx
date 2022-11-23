import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import useFormInput from 'hooks/useFormInput'
import { addUserDB } from 'services/user'

import SnackBar from 'components/SnackBar'
import { useSnackbar } from 'components/SnackBar/useSnackBar'
import { validateId, validateName, validatePassword, validatePhoneNumber } from 'utils/validates/validateInput'
import { SignUpIcon } from 'assets/svgs'
import styles from './signUp.module.scss'
import SignUpForm from './SignUpForm'

const SignUp = (): JSX.Element => {
  const [snackBarStatus, setSnackBarStatus] = useState('')
  const { message, setMessage } = useSnackbar(5000)
  const navigate = useNavigate()

  const id = useFormInput({ validateFunction: validateId, initialValue: '' })
  const name = useFormInput({ validateFunction: validateName, initialValue: '' })
  const password = useFormInput({ validateFunction: validatePassword, initialValue: '' })
  const phone = useFormInput({ validateFunction: validatePhoneNumber, initialValue: '' })

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!id.valueIsValid || !password.valueIsValid || !phone.valueIsValid || !name.valueIsValid) {
      setSnackBarStatus('warning')
      setMessage('입력 정보가 올바르지 않습니다.')
      return
    }

    const newUser = {
      id: id.value,
      name: name.value,
      phone: phone.value,
      pw: password.value,
      role: 0,
      likes: [],
    }

    addUserDB(newUser)
      .then(() => {
        setSnackBarStatus('')
        setMessage('회원가입 성공!')
        setTimeout(() => {
          navigate('/signin')
        }, 1000)
      })
      .catch((err) => {
        setSnackBarStatus('error')
        setMessage(`${err}`)
      })
  }

  return (
    <main className={styles.formWrapper}>
      <header className={styles.header}>
        <h3 className={styles.id}>
          <SignUpIcon />
        </h3>
      </header>

      <div className={styles.content}>
        <SignUpForm onSubmit={handleOnSubmit} id={id} name={name} phone={phone} password={password} />
        {message && <SnackBar message={message} status={snackBarStatus} setMessage={setMessage} />}
      </div>
    </main>
  )
}

export default SignUp
