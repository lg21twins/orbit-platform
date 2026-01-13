import React from 'react';

export function IPadMockup({ children, className = '' }) {
    return (
        <div className={`relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] md:border-[14px] rounded-[1.5rem] md:rounded-[2.5rem] h-[400px] w-[200px] md:h-[600px] md:w-[300px] shadow-xl ${className}`}>
            <div className="w-[80px] md:w-[148px] h-[12px] md:h-[18px] bg-gray-800 top-0 rounded-b-[0.5rem] md:rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
            <div className="h-[60px] md:h-[102px] w-[2px] md:w-[3px] bg-gray-800 absolute -start-[10px] md:-start-[17px] top-[80px] md:top-[124px] rounded-s-lg"></div>
            <div className="h-[30px] md:h-[46px] w-[2px] md:w-[3px] bg-gray-800 absolute -start-[10px] md:-start-[17px] top-[150px] md:top-[178px] rounded-s-lg"></div>
            <div className="h-[30px] md:h-[46px] w-[2px] md:w-[3px] bg-gray-800 absolute -start-[10px] md:-start-[17px] top-[190px] md:top-[240px] rounded-s-lg"></div>
            <div className="h-[40px] md:h-[64px] w-[2px] md:w-[3px] bg-gray-800 absolute -end-[10px] md:-end-[17px] top-[100px] md:top-[142px] rounded-e-lg"></div>
            <div className="rounded-[1.2rem] md:rounded-[2rem] overflow-hidden w-full h-full bg-black dark:bg-gray-800">
                {children}
            </div>
        </div>
    );
}

export function MacbookMockup({ children, className = '' }) {
    return (
        <div className={`relative mx-auto ${className}`}>
            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[6px] md:border-[8px] rounded-t-xl h-[150px] max-w-[260px] md:h-[294px] md:max-w-[512px]">
                <div className="rounded-lg overflow-hidden h-full w-full bg-black dark:bg-gray-800">
                    {children}
                </div>
            </div>
            <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[14px] max-w-[300px] md:h-[21px] md:max-w-[597px]">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[40px] h-[4px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
            </div>
        </div>
    );
}
