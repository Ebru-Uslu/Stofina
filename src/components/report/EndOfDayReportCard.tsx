import React from 'react'

interface EndOfDayReportCardProps {
    date: string;
    time: string;
    type: string;
    statusMessage: string;
    onConfirm: () => void;
    onPrint: () => void;
}

const EndOfDayReportCard = ({ date, time, type, statusMessage, onConfirm, onPrint }: EndOfDayReportCardProps) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-md w-3xl max-w-md">
            <h3 className="text-center text-xl font-bold text-gray-800 mb-6 tracking-tight">GÜN SONU RAPORU</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div><span className="font-semibold">TARİH:</span> {date}</div>
                <div><span className="font-semibold">SAAT:</span> {time}</div>
                <div className="col-span-2"><span className="font-semibold">RAPOR TÜRÜ:</span> {type}</div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 border border-dashed border-gray-300 rounded text-sm text-gray-700">
                <strong>DURUM:</strong>
                <p className="mt-1 leading-relaxed">{statusMessage}</p>
            </div>
            <p className="text-xs text-right text-gray-400 mt-2">{date} {time}</p>
            <div className="flex gap-4 justify-end mt-6">
                <button onClick={onConfirm} className="px-5 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200">TAMAM</button>
                <button onClick={onPrint} className="px-5 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200">Raporu Yazdır</button>
            </div>
        </div>
    )
}

export default EndOfDayReportCard