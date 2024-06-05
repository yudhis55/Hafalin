'use client';

// import { Metadata } from "next"
import { AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Code } from '@mantine/core';
import {
    IconBellRinging,
    IconFingerprint,
    IconKey,
    IconSettings,
    Icon2fa,
    IconDatabaseImport,
    IconReceipt2,
    IconSwitchHorizontal,
    IconLogout,
    IconSquareRoundedPlus,
    IconBook,
    IconHome,
} from '@tabler/icons-react';
import classes from './NavbarSimple.module.css';

// export const metadata: Metadata = {
//     title: "Dashboard",
//     description: "Example dashboard app built using the components.",
// }

const data = [
    { link: '/siswa', label: 'Beranda', icon: IconHome },
    { link: '/siswa/tambahhafalan', label: 'Tambah Hafalan', icon: IconSquareRoundedPlus },
    { link: '/siswa/lihathafalan', label: 'Lihat Hafalan', icon: IconBook },
];

export default function CollapseDesktop({ children }: { children: React.ReactNode }) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const [active, setActive] = useState('Billing');

    const links = data.map((item) => (
        <button
            className={classes.link}
            data-active={item.label === active || undefined}
            onClick={(event) => {
                event.preventDefault();
                router.push(item.link);
                setActive(item.label);
            }}
            // href={item.link}

            key={item.label}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </button>
    ));


    const router = useRouter();
    const handleLogout = async () => {

        const supabase = createClient();
        try {
            await supabase.auth.signOut();
            console.log("Logged out");
            (useRouter()).push("/login");
            (useRouter()).refresh();
        } catch (error: any) {
            console.log(error.message);
            console.error(error);
        }
    }

    return (
        <div className='flex'>
            <nav className={classes.navbar}>
                <div className={classes.navbarMain}>
                    <Group className={classes.header} justify="space-between">
                        <h1 className='text-2xl font-bold'>Hafalin</h1>
                    </Group>
                    <div className='flex flex-col'>
                        {links}
                    </div>
                </div>
                <div className={classes.footer}>
                    {/* <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                        <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
                        <span>Admin</span>
                    </a> */}

                    <a href="#" className={classes.link} onClick={handleLogout}>
                        <IconLogout className={classes.linkIcon} stroke={1.5} />
                        <span>Logout</span>
                    </a>
                </div>
            </nav>
            <div className='w-full'>{children}</div>
        </div>
    );
}