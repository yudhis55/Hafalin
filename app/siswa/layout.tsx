'use client';

import { createClient } from '@/utils/supabase/client';
import { AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { redirect, useRouter } from 'next/navigation';

export default function CollapseDesktop({ children }: { children: React.ReactNode }) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    const router = useRouter();
    const handleLogout = async () => {

        const supabase = createClient();
        try {
            await supabase.auth.signOut();
            console.log("Logged out");
            router.push("/login");
            router.refresh();
        } catch (error: any) {
            console.log(error.message);
            console.error(error);
        }
    }

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                    <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                    <p>Logo</p>

                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                Navbar
                <button onClick={handleLogout}>Logout</button>
            </AppShell.Navbar>
            <AppShell.Main>
                {children}
            </AppShell.Main>
        </AppShell>
    );
}