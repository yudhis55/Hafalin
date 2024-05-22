'use client'

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';
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
import hafalanService, { Hafalan } from '@/services/hafalan';


const Example = () => {
    const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

    const columns = useMemo<MRT_ColumnDef<Hafalan>[]>(
        () => [
            { accessorKey: 'id', header: 'Id', enableEditing: false, size: 80 },
            { accessorKey: 'profile_id', header: 'Profile ID', enableEditing: false, size: 80 },
            { accessorKey: 'nama_siswa', header: 'Nama Siswa', enableEditing: false, size: 120 },
            { accessorKey: 'juz', header: 'Juz', size: 50 },
            { accessorKey: 'surat', header: 'Surat', size: 80 },
            { accessorKey: 'awal_ayat', header: 'Awal Ayat', size: 80 },
            { accessorKey: 'akhir_ayat', header: 'Akhir Ayat', size: 80 },
            { accessorKey: 'nilai', header: 'Nilai', size: 80 },
            {
                accessorKey: 'komentar', header: 'Komentar', mantineEditTextInputProps: {
                    required: true,
                    error: validationErrors?.komentar,
                    onFocus: () => setValidationErrors({ ...validationErrors, komentar: undefined }),
                }
            },
            { accessorKey: 'created_at', header: 'Created At', enableEditing: false },
            { accessorKey: 'link_hafalan', header: 'Link Hafalan', size: 200 },
        ],
        [validationErrors],
    );

    const { mutateAsync: createHafalan, isLoading: isCreatingHafalan } = useCreateHafalan();
    const { data: fetchedHafalan = [], isError: isLoadingHafalanError, isFetching: isFetchingHafalan, isLoading: isLoadingHafalan } = useGetHafalan();
    const { mutateAsync: updateHafalan, isLoading: isUpdatingHafalan } = useUpdateHafalan();
    const { mutateAsync: deleteHafalan, isLoading: isDeletingHafalan } = useDeleteHafalan();

    const handleCreateHafalan: MRT_TableOptions<Hafalan>['onCreatingRowSave'] = async ({ values, exitCreatingMode }) => {
        const newValidationErrors = validateHafalan(values);
        if (Object.values(newValidationErrors).some(error => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await createHafalan(values);
        exitCreatingMode();
    };

    const handleSaveHafalan: MRT_TableOptions<Hafalan>['onEditingRowSave'] = async ({ values, table }) => {
        const newValidationErrors = validateHafalan(values);
        if (Object.values(newValidationErrors).some(error => error)) {
            setValidationErrors(newValidationErrors);
            return;
        }
        setValidationErrors({});
        await updateHafalan(values);
        table.setEditingRow(null);
    };

    const openDeleteConfirmModal = (row: MRT_Row<Hafalan>) => modals.openConfirmModal({
        title: 'Are you sure you want to delete this hafalan?',
        children: <Text>Are you sure you want to delete {row.original.nama_siswa}'s hafalan? This action cannot be undone.</Text>,
        labels: { confirm: 'Delete', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: () => deleteHafalan(row.original.id),
    });

    const table = useMantineReactTable({
        columns,
        data: fetchedHafalan,
        createDisplayMode: 'modal',
        editDisplayMode: 'modal',
        enableEditing: true,
        getRowId: row => row.id,
        mantineToolbarAlertBannerProps: isLoadingHafalanError ? { color: 'red', children: 'Error loading data' } : undefined,
        mantineTableContainerProps: { style: { minHeight: '500px' } },
        onCreatingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateHafalan,
        onEditingRowCancel: () => setValidationErrors({}),
        onEditingRowSave: handleSaveHafalan,
        renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
            <Stack>
                <Title order={3}>Create New Hafalan</Title>
                {internalEditComponents}
                <Flex justify="flex-end" mt="xl">
                    <MRT_EditActionButtons variant="text" table={table} row={row} />
                </Flex>
            </Stack>
        ),
        renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
            <Stack>
                <Title order={3}>Edit Hafalan</Title>
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
        state: {
            isLoading: isLoadingHafalan,
            isSaving: isCreatingHafalan || isUpdatingHafalan || isDeletingHafalan,
            showAlertBanner: isLoadingHafalanError,
            showProgressBars: isFetchingHafalan,
        },
    });

    return <MantineReactTable table={table} />;
};


function useCreateHafalan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (hafalan: Hafalan) => {
            await hafalanService.addHafalan(hafalan);
        },
        onMutate: (newHafalan: Hafalan) => {
            queryClient.setQueryData(['hafalan'], (prevHafalan: Hafalan[] | undefined) => [
                ...(prevHafalan || []),
                { ...newHafalan, id: (Math.random() + 1).toString(36).substring(7) },
            ]);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['hafalan'] }),
    });
}

function useGetHafalan() {
    return useQuery<Hafalan[]>({
        queryKey: ['hafalan'],
        queryFn: async () => {
            return await hafalanService.getDaftarHafalan();
        },
        refetchOnWindowFocus: false,
    });
}

function useUpdateHafalan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (hafalan: Hafalan) => {
            await hafalanService.updateHafalan(hafalan.id, hafalan);
        },
        onMutate: (updatedHafalan: Hafalan) => {
            queryClient.setQueryData(['hafalan'], (prevHafalan: Hafalan[] | undefined) =>
                prevHafalan?.map(hafalan => (hafalan.id === updatedHafalan.id ? updatedHafalan : hafalan))
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['hafalan'] }),
    });
}

function useDeleteHafalan() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (hafalanId: string) => {
            await hafalanService.deleteHafalan(hafalanId);
        },
        onMutate: (hafalanId: string) => {
            queryClient.setQueryData(['hafalan'], (prevHafalan: Hafalan[] | undefined) =>
                prevHafalan?.filter(hafalan => hafalan.id !== hafalanId)
            );
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ['hafalan'] }),
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

function validateHafalan(hafalan: Hafalan) {
    return {
        komentar: !validateRequired(hafalan.komentar) ? 'Komentar is Required' : '',
    };
}


