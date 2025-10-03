import React from 'react'
import { Link } from 'react-router-dom'

const CommonForm = ({ title, fields, onSubmit, buttonText, loading, linkText, linkPath, linkLabel }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">{title}</h2>

        {fields.map((field, index) => (
          <div key={index} className="mb-4">
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                className="border p-2 w-full rounded text-sm sm:text-base"
              >
                {field.options.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={field.value}
                onChange={field.onChange}
                className="border p-2 w-full rounded text-sm sm:text-base"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className={`${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            } text-white p-2 w-full rounded transition text-sm sm:text-base`}
        >
          {loading ? 'Please wait...' : buttonText}
        </button>

        {linkText && linkPath && (
          <p className="mt-3 text-sm text-center text-gray-600">
            {linkText}{' '}
            <Link to={linkPath} className="text-blue-600 font-medium hover:underline">
              {linkLabel}
            </Link>
          </p>
        )}
      </form>
    </div>
  )
}

export default CommonForm;