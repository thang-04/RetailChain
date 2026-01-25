import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const AddStaffModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const availableStaff = [
        {
            id: 101,
            name: "Emily Thompson",
            email: "e.thompson@retail-corp.com",
            currentStore: "Store B (Downtown)",
            currentRole: "Senior Associate",
            experience: "3.5 Years",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5Je__x0w0579S6bdFyCxgWqs1O9N3OiJB1H_cwTsimUeF80bsDKFAbh3RUtyQxpRh8rbKkWsh7Tz23SzHcpyakloL99M_mQtjO8nvmi4p0W5R6yCXJ8u4rmFVMg4uCu2x8mfh6o8rGnZmHJ38PMudqQVD4ywzZKw5-XRKhfFHAIr0Zg-JB7b6K6XpMaMNFlC3eH6Y5L0f_FX1tclo3v1YFAGYOM_nu2UsVCS4HZTWyVgPYU1ZFlEXcrJT_IXoTZ-WiqSQmfbD96A"
        },
        {
            id: 102,
            name: "Robert Kim",
            email: "r.kim@retail-corp.com",
            currentStore: "Store D (Eastside)",
            currentRole: "Inventory Specialist",
            experience: "1.2 Years",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuALp4ud2mAvItBjmZoYNVHXiJsmxBPDi6Q1n0_7AyVGd7FjUbVk9kTmaZ1k4aCEaICcwLFI_5_gPAqeqYEyLIFk6ZOEjwOMPmvIXMt-I0z9MSb395yl3T5BayN-LTn37glIKvWiDx_D83Tfq7DzYz5qu88nLdI0VvyvakWaW4fWkBWAAcGTtcGS1JzpXhwVweMm5c6gp8xS6HnqOYiHDHLkjFozn3xgR7keKseDcXFnZBXrSjqJfPGCeV7m6iY6_yHzKNyHpixn7qg"
        },
        {
            id: 103,
            name: "Angela Martinez",
            email: "a.martinez@retail-corp.com",
            currentStore: "HQ (Unassigned)",
            currentRole: "Floating Manager",
            experience: "5+ Years",
            initials: "AM",
            initialsColor: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800"
        },
        {
            id: 104,
            name: "Liam O'Connor",
            email: "l.oconnor@retail-corp.com",
            currentStore: "Store C (Waterfront)",
            currentRole: "Cashier",
            experience: "8 Months",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDl32EiV1Cebqa_bpYzpzkBbcGFF7jsfVvdcyGwELL3icwWL-bHEY-vvjlZBbETn4yJHLTd0mlZXULn9VYSftCxIumz9g1Z3s0pn9NbvAs-hhuNAsMgLofsRR0c-xOqf9R0fl4859vT99WzRr1SU1h6x2Gr7sxYqB0xF5V3IZN82iDIJdT1PnC6AxYh1gGxRtIV76JI88pmokhGKX-nU3eYiDxkyoySRf69bFEOg1zjo1IfH0wkaDFX5TAdhicbGk3JxKDW05TpnF4"
        },
        {
            id: 105,
            name: "Samantha Reed",
            email: "s.reed@retail-corp.com",
            currentStore: "Store B (Downtown)",
            currentRole: "Sales Associate",
            experience: "2.1 Years",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxsnr80ZOP5BAXuopRtLfnFvy2BwFVog_oaGAB4sijHA1C240nQhUVSCIU9ace3HuxY6cHdLO517wFQd1-M9ZBm-NTF9AijCkEKy9UwM7i3tuSShQw8Pt-53kppn0mlQ-17VKWEylWVoGL4pKg6TenTZP-H4m_F4XfLyvq0wyIm4mZN8FqZXlE2gw7FGUecyvOK-f0sPlQkASNF8sEYbPI8x8gYaV3QKg5sYKtnRliN3wdqV_7bFuRSUax-f10i2rhiBqkZbKbS_w"
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4">
            <div className="bg-white dark:bg-[#1a1d21] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Add Staff to Store A</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select available staff from other locations in the retail chain.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Search */}
                <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                        <input autoFocus className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm" placeholder="Search by name, role, or current store..." type="text" />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="sticky top-0 bg-white dark:bg-[#1a1d21] border-b border-slate-100 dark:border-slate-800 z-10 shadow-sm">
                                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-12">
                                    <input className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary dark:bg-slate-800" type="checkbox" />
                                </th>
                                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Staff Member</th>
                                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Assignment</th>
                                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Experience</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {availableStaff.map((staff) => (
                                <tr key={staff.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
                                    <td className="py-4 px-6">
                                        <input className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary dark:bg-slate-800" type="checkbox" />
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            {staff.image ? (
                                                <div className="size-9 rounded-full bg-cover bg-center shrink-0 border border-slate-200 dark:border-slate-700" style={{ backgroundImage: `url("${staff.image}")` }}></div>
                                            ) : (
                                                <div className={`flex items-center justify-center size-9 rounded-full text-xs font-bold shrink-0 border ${staff.initialsColor}`}>{staff.initials}</div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 dark:text-white font-semibold text-sm">{staff.name}</span>
                                                <span className="text-slate-500 dark:text-slate-400 text-[11px]">{staff.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-slate-700 dark:text-slate-300 text-sm">{staff.currentStore}</span>
                                            <span className="text-slate-500 dark:text-slate-400 text-[11px]">{staff.currentRole}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-right text-slate-600 dark:text-slate-400 text-xs">{staff.experience}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/20">
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">0 staff member selected</span>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="h-10 px-5 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700">
                            Cancel
                        </button>
                        <button className="h-10 px-5 bg-primary hover:bg-[#1d617a] text-white text-sm font-semibold rounded-lg shadow-sm shadow-primary/30 transition-all active:scale-95 flex items-center gap-2">
                            <span>Assign to Store A</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddStaffModal;
