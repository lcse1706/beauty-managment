'use client';

import React, { useState } from 'react';

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { Button } from '../Button';

export const NavigationMobile = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const logoutHandler = () => {
        // setIsLogged(false);
        sessionStorage.setItem('isAuth', 'false');
        // router.push('/');
    };

    return (
        <button
            onClick={handleClick}
            className="flex flex-col justify-center items-center"
        >
            {isOpen && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900 bg-opacity-90">
                    <ul className="flex flex-col items-center space-y-5">
                        <li>
                            <Link
                                href="/sendreceipt"
                                className="text-white hover:text-gray-400 font-medium"
                            >
                                <button className="text-white font-medium px-4 py-2 rounded-full">
                                    Send Receipt
                                </button>
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/receiptlist"
                                className="text-white hover:text-gray-400 font-medium"
                            >
                                <button className="text-white hover:text-gray-400 font-medium px-4 py-2 rounded-full">
                                    Receipts
                                </button>
                            </Link>
                        </li>

                        <li>
                            <Button label="Log Out" onClick={logoutHandler} />
                        </li>
                    </ul>
                </div>
            )}
            <FontAwesomeIcon icon={faBars} style={{ color: '#fafcff' }} />
        </button>
    );
};
