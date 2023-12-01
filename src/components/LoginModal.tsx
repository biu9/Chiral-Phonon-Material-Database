'use client'
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';

enum ModalType {
  login='login',
  signup='signup',
  forgetPwd='forgetPwd'
}

const Login = ({ changeModalType }:{ changeModalType:React.Dispatch<React.SetStateAction<ModalType>> }) =>{
  
  return (
    <>
      <div className='font-bold text-3xl'>login</div>
      <div className='mt-6 flex flex-col space-y-6'>
        <TextField variant="outlined" size="small" fullWidth placeholder='username'/>
        <TextField variant="outlined" size="small" fullWidth placeholder='email'/>
      </div>
      <div className='flex justify-between text-gray-400 mt-6 text-sm'>
        <div className='cursor-pointer' onClick={() => changeModalType(ModalType.signup)}>sign up</div>
        <div className='cursor-pointer' onClick={() => changeModalType(ModalType.forgetPwd)}>forgot password</div>
      </div>
      <div className='flex space-x-6 mt-6'>
        <Button variant="text" fullWidth className='color-black'>cancel</Button>
        <Button variant="contained" fullWidth className='bg-blue-600'>login</Button>
      </div>
    </>
  )
}

const Signup = ({ changeModalType }:{ changeModalType:React.Dispatch<React.SetStateAction<ModalType>> }) => {
  return (
    <>
      <div className='font-bold text-3xl'>Signup</div>
      <div className='mt-6 flex flex-col space-y-6'>
        <TextField variant="outlined" size="small" fullWidth placeholder='email'/>
        <TextField variant="outlined" size="small" fullWidth placeholder='password'/>
        <TextField variant="outlined" size="small" fullWidth placeholder='confirm password'/>
        <TextField variant="outlined" size="small" fullWidth placeholder='verification code'/>
      </div>
      <div className='flex justify-between text-gray-400 mt-6 text-sm'>
        <div className='cursor-pointer' onClick={() => changeModalType(ModalType.login)}>log in</div>
        <div className='cursor-pointer'>send code</div>
      </div>
      <div className='flex space-x-6 mt-6'>
        <Button variant="text" fullWidth className='color-black'>cancel</Button>
        <Button variant="contained" fullWidth className='bg-blue-600'>create</Button>
      </div>
    </>
  )
}

const ForgetPwd = ({ changeModalType }:{ changeModalType:React.Dispatch<React.SetStateAction<ModalType>> }) => {
  return (
    <>
      <div className='font-bold text-3xl'>Signup</div>
      <div className='mt-6 flex flex-col space-y-6'>
        <TextField variant="outlined" size="small" fullWidth placeholder='email'/>
        <TextField variant="outlined" size="small" fullWidth placeholder='password'/>
        <TextField variant="outlined" size="small" fullWidth placeholder='confirm password'/>
        <TextField variant="outlined" size="small" fullWidth placeholder='verification code'/>
      </div>
      <div className='flex justify-between text-gray-400 mt-6 text-sm'>
        <div className='cursor-pointer' onClick={() => changeModalType(ModalType.login)}>log in</div>
        <div className='cursor-pointer'>send code</div>
      </div>
      <div className='flex space-x-6 mt-6'>
        <Button variant="text" fullWidth className='color-black'>cancel</Button>
        <Button variant="contained" fullWidth className='bg-blue-600'>create</Button>
      </div>
    </>
  )
}

export default function LoginModal({ open, setOpen }:{ open:boolean,setOpen:React.Dispatch<React.SetStateAction<boolean>> }) {
  
  const [modalType, setModalType] = useState<ModalType>(ModalType.login)

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
    >
      <div className='bg-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg w-96 outline-none'>
        {
          modalType === ModalType.login ? <Login changeModalType={setModalType} /> : null
        }
        {
          modalType === ModalType.signup ? <Signup changeModalType={setModalType} /> : null
        }
        {
          modalType === ModalType.forgetPwd ? <ForgetPwd changeModalType={setModalType} /> : null
        }
      </div>
    </Modal>
  )
}