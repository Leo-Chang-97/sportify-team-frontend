export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            註冊新帳戶
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            或者{' '}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              登入現有帳戶
            </a>
          </p>
        </div>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <p className="text-center text-gray-600">註冊功能開發中...</p>
        </div>
      </div>
    </div>
  )
}
