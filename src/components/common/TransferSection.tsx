"use client";
import React, { useState } from 'react';

const transferTips = ['HESAPLAR ARASI', 'MÜŞTERİLER ARASI', 'KURUMLAR ARASI', 'HARİCİ'];

const TransferTipSelector = () => {
    const [selectedTip, setSelectedTip] = useState('HESAPLAR ARASI');

    return (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
            {transferTips.map((tip) => {
                const isDisabled = tip !== 'HESAPLAR ARASI';
                const isSelected = selectedTip === tip;

                return (
                    <label
                        key={tip}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all
                            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:border-[#439E54]'}
                            ${isSelected ? 'border-[#439E54] bg-[#e8ffec]' : 'border-gray-300 bg-white'}`}
                    >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                            ${isSelected ? 'border-[#439E54]' : 'border-gray-400'}
                            ${isDisabled ? 'bg-gray-200' : 'bg-white'}
                        `}>
                            {isSelected && !isDisabled && (
                                <div className="w-2 h-2 bg-[#439E54] rounded-full"></div>
                            )}
                        </div>
                        <span className="text-gray-800">{tip}</span>
                        <input
                            type="radio"
                            name="transferTip"
                            className="hidden"
                            disabled={isDisabled}
                            checked={isSelected}
                            onChange={() => !isDisabled && setSelectedTip(tip)}
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default TransferTipSelector;
