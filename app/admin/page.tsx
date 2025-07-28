'use client'
import { useState } from 'react'
import Papa from 'papaparse'
import { supabase } from '../../lib/supabaseClient'

export default function AdminUpload() {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [result, setResult] = useState('')
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!csvFile) return

    setUploading(true)
    setResult('Uploading...')

    Papa.parse(csvFile, {
      header: true,
      complete: async results => {
        const rows = results.data.filter((r: any) => r.college_name)
        const { error } = await supabase
          .from('colleges')
          .insert(rows, { returning: 'minimal' })
        setResult(error ? `❌ Upload failed: ${error.message}` : '✅ Upload successful!')
        setUploading(false)
      },
    })
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-black">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin: Upload College CSV</h2>
      
      <form onSubmit={handleUpload} className="space-y-5 bg-white p-6 rounded-xl shadow">
        <input
          type="file"
          accept=".csv"
          onChange={e => setCsvFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {csvFile && (
          <div className="text-sm text-gray-600">Selected file: <strong>{csvFile.name}</strong></div>
        )}
        <button
          type="submit"
          disabled={!csvFile || uploading}
          className={`w-full py-2 px-4 text-white rounded ${
            uploading || !csvFile
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {result && <div className="text-sm text-gray-800">{result}</div>}
      </form>

      <a
        href="/sample_colleges.csv"
        download
        className="mt-4 inline-block text-blue-600 underline text-sm hover:text-blue-800"
      >
        📥 Download sample CSV
      </a>
    </div>
  )
}
