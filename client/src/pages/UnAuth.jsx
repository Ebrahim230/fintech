import React from 'react'

const UnAuth = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8'>
      <div className='bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10 text-center w-full max-w-sm sm:max-w-md md:max-w-lg'>
        <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-red-600'>
            Unauthorized
        </h1>
        <p className='text-gray-600 text-sm sm:text-base md:text-lg mb-6'>
            You don't have permission to access this page.
        </p>
      </div>
    </div>
  )
}

export default UnAuth;