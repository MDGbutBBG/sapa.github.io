import { Lock } from "lucide-react";
import '../app.css';

export default function Vote() {
  return (
    <div className='animate-fade-up h-[70vh] flex flex-col items-center justify-center text-center px-6'>
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-200 mb-8 animate-bounce">
            <Lock className="w-10 h-10 text-blue-600"/>
        </div>
            <h2 className="text-2xl font-900 text-blue-950 mb-4">Election Day</h2>
            <div className="bg-white p-6 rounded-3xl border border-blue-50 shadow-lg max-w-xs mx-auto">
                <p className="text-slate-500 font-medium leading-relaxed">
                    ท่านจะดูคะแนนได้แบบเรียลไทม์และย้อนหลังได้เมื่อถึงวันเลือกตั้ง
                </p>
        </div>
    </div>
  )
}
