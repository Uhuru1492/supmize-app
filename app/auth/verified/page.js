import Link from 'next/link'

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full text-center">
        
        <div className="inline-block bg-gradient-to-br from-green-500 to-green-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold mb-6">
          ✓
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Email Verified! 🎉
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Your account has been successfully verified. You can now use all features of Supmize.
        </p>

        <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-6 mb-8">
          <p className="text-sm text-gray-700 mb-4">
            <strong>Next step:</strong> Open the Supmize app on your phone to start analyzing your supplements!
          </p>
          <a 
            href="https://apps.apple.com/app/supmize/id6756226894"
            className="inline-block bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-lg font-bold hover:from-teal-700 hover:to-teal-800 transition"
          >
            📱 Open Supmize App
          </a>
        </div>

        <div className="text-sm text-gray-500">
          <p>Don't have the app yet?</p>
          <a 
            href="https://apps.apple.com/app/supmize/id6756226894"
            target="_blank"
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            Download from App Store
          </a>
        </div>

        <div className="mt-8 pt-8 border-t">
          <Link 
            href="/"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Back to Homepage
          </Link>
        </div>

      </div>
    </div>
  )
}
