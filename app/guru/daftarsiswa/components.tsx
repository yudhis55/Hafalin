'use client'

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import { useMemo, useState } from 'react';
import {
    MRT_EditActionButtons,
    MantineReactTable,
    type MRT_ColumnDef,
    type MRT_Row,
    type MRT_TableOptions,
    useMantineReactTable,
} from 'mantine-react-table';
import {
    ActionIcon,
    Button,
    Flex,
    Stack,
    Text,
    Title,
    Tooltip,
} from '@mantine/core';
import { ModalsProvider, modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import profileService, { Profile } from '@/services/profile';

const Example = () => {
    const [validationErrors, setValidationErrors, ] = useState<
        Record<string, string | undefined>
    >({});

    const columns = useMemo<MRT_ColumnDef<Profile>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'Id',
                enableEditing: false,
                size: 80,
            },
            {
                accessorKey: 'user_id',
                header: 'User ID',
                enableEditing: false,
                size: 80,
            },
            {
                accessorKey: 'nama',
                header: 'Nama',
                mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.nama,
                    onFocus: () =>
                        setValidationErrors({
                            ...validationErrors,
                            nama: undefined,
                        }),
                },
            },
            {
                accessorKey: 'role',
                header: 'Role',
                editVariant: 'select',
                mantineEditSelectProps: {
                    data: [
                        { value: 'guru', label: 'Guru' },
                        { value: 'siswa', label: 'Siswa' },
                    ],
                    error: validationErrors?.is_admin,
                },
            },
            {
                accessorKey: 'created_at',
                header: 'Created At',
                enableEditing: false,
            },
        ],
        [validationErrors],
    );

    const newLocal = useCreateProfile();
    // CREATE hook
    const { mutateAsync: createProfile, isLoading: isCreatingProfile } =
        newLocal;
    // READ hook
    const {
        data: fetchedProfiles = [],
        isError: isLoadingProfilesError,
        isFetching: isFetchingProfiles,
        isLoading: isLoadingProfiles,
    } = useGetProfiles();
    // UPDATE hook
    const { mutateAsync: updateProfile, isLoading: isUpdatingProfile } =
        useUpdateProfile();
    // DELETE hook
    const { mutateAsync: deleteProfile, isLoading: isDeletingProfile } =
        useDeleteProfile();

    // CREATE action
    const handleCreateProfile: MRT_TableOptions<Profile>['onCreatingRowSave'] =
        async ({ values, exitCreatingMode }) => {
            const newValidationErrors = validateProfile(values);
            if (Object.values(newValidationErrors).some((error) => error)) {
                setValidationErrors(newValidationErrors);
                return;
            }
            setValidationErrors({});
            await createProfile(values);
            exitCreatingMode();
        };

    // UPDATE action
    const handleSaveProfile: MRT_TableOptions<Profile>['onEditingRowSave'] =
        async ({ values, table }) => {
            const newValidationErrors = validateProfile(values);
            if (Object.values(newValidationErrors).some((error) => error)) {
                setValidationErrors(newValidationErrors);
                return;
            }
            setValidationErrors({});
            await updateProfile(values);
            table.setEditingRow(null); //exit editing mode
        };

    // DELETE action
    const openDeleteConfirmModal = (row: MRT_Row<Profile>) =>
        modals.openConfirmModal({
            title: 'Are you sure you want to delete this profile?',
            children: (
                <Text>
                    Are you sure you want to delete {row.original.nama}? This action
                    cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => deleteProfile(row.original.id),
        });

    const table = useMantineReactTable({
        columns,
        data: fetchedProfiles,
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        getRowId: (row) => row.id,
        mantineToolbarAlertBannerProps: isLoadingProfilesError
            ? {
                color: 'red',
                children: 'Error loading data',
            }
            : undefined,
        mantineTableContainerProps: {
            style: {
                minHeight: '500px',
            },
        },
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateProfile,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveProfile,
        renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
            <Stack>
                <Title order={3}>Create New Profile</Title>
                {internalEditComponents}
                <Flex justify="flex-end" mt="xl">
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </Flex>
            </Stack>
        ),
        renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
            <Stack>
                <Title order={3}>Edit Profile</Title>
                {internalEditComponents}
                <Flex justify="flex-end" mt="xl">
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </Flex>
            </Stack>
        ),
        renderRowActions: ({ row, table }) => (
            <Flex gap="md">
                <Tooltip label="Edit">
                    <ActionIcon onClick={() => table.setEditingRow(row)}>
                        <IconEdit />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Delete">
                    <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
                        <IconTrash />
                    </ActionIcon>
                </Tooltip>
            </Flex>
        ),
        // renderTopToolbarCustomActions: ({ table }) => (
        //     <Button
        //         onClick={() => {
        //             table.setCreatingRow(true);
        //         }}
        //     >
        //         Create New Profile
        //     </Button>
        // ),
        state: {
            isLoading: isLoadingProfiles,
            isSaving: isCreatingProfile || isUpdatingProfile || isDeletingProfile,
            showAlertBanner: isLoadingProfilesError,
            showProgressBars: isFetchingProfiles,
        },
    });

    return <MantineReactTable table={table} />;
};

// CREATE hook (post new profile to api)
function useCreateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (profile: Profile) => {
            await profileService.addProfile(profile);
        },
        //client side optimistic update
        onMutate: (newProfile: Profile) => {
            queryClient.setQueryData(
                ['profiles'],
                (prevProfiles: any) =>
                    [
                        ...prevProfiles,
                        {
                            ...newProfile,
                            id: (Math.random() + 1).toString(36).substring(7),
                        },
                    ] as Profile[],
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
    });
}

// READ hook (get profiles from api)
function useGetProfiles() {
    return useQuery<Profile[]>({
        queryKey: ['profiles'],
        queryFn: async () => {
            return await profileService.getRoleSiswa();
        },
        refetchOnWindowFocus: false,
    });
}

// UPDATE hook (put profile in api)
function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (profile: Profile) => {
            await profileService.updateProfile(profile.id, profile);
        },
        //client side optimistic update
        onMutate: (updatedProfile: Profile) => {
            queryClient.setQueryData(['profiles'], (prevProfiles: any) =>
                prevProfiles?.map((prevProfile: Profile) =>
                    prevProfile.id === updatedProfile.id ? updatedProfile : prevProfile,
                ),
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
    });
}

// DELETE hook (delete profile in api)
function useDeleteProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (profileId: string) => {
            await profileService.deleteProfile(profileId);
        },
        //client side optimistic update
        onMutate: (profileId: string) => {
            queryClient.setQueryData(['profiles'], (prevProfiles: any) =>
                prevProfiles?.filter((profile: Profile) => profile.id !== profileId),
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['profiles'] }),
    });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
    <QueryClientProvider client={queryClient}>
        <ModalsProvider>
            <Example />
        </ModalsProvider>
    </QueryClientProvider>
);

export default ExampleWithProviders;

const validateRequired = (value: string) => !!value.length;

function validateProfile(profile: Profile) {
    return {
        nama: !validateRequired(profile.nama) ? 'Nama is Required' : '',
    };
}
