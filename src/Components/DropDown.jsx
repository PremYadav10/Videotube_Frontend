import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa"; // Imported FaCheck for potential dynamic use in item labels

export default function Dropdown({ triggerLabel, items = [] }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            {/* Trigger (Handles the HiDotsVertical icon) */}
            <div
                onClick={(e) => {
                    // Prevent propagation up to parent Link/Button that might be wrapping the component
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
                className="flex items-center justify-center m-2 p-1 cursor-pointer"
            >
                {triggerLabel}
            </div>

            {/* Dropdown Menu */}
            {open && (
                <div className="absolute right-0 mt-2 w-52 bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700 z-50 transform origin-top-right animate-fade-in-up">
                    <ul className="py-1">
                        {items.map((item, index) => (
                            <li key={index}>
                                {/* Check if item is a route link */}
                                {item.to ? (
                                    <Link
                                        to={item.to}
                                        // 🎯 Corrected hover styles for dark mode link item
                                        className="block px-4 py-2 text-sm hover:bg-blue-600 hover:text-white transition-colors duration-100"
                                        onClick={() => setOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    // Item is a button (e.g., Save to Watch Later, Logout)
                                    <button
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors duration-100"
                                        onClick={(e) => {
                                            // 🎯 Check 1: Stop event propagation if this button is inside a larger Link
                                            e.stopPropagation(); 
                                            
                                            // 🎯 Check 2: Execute the external function
                                            item.onClick?.(e); 
                                            
                                            // 🎯 Check 3: Close the dropdown
                                            setOpen(false);
                                        }}
                                    >
                                        {item.label}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}