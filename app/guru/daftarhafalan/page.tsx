import hafalanService, { Hafalan } from '@/services/hafalan';
import HafalanList from './HafalanList';

export default async function DaftarHafalanPage() {
  // Fetch data in the server component
  const hafalanList: Hafalan[] = await hafalanService.getDaftarHafalan();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Daftar Hafalan</h1>
      <HafalanList hafalanList={hafalanList} />
    </div>
  );
}


// 'use client'

// import '@mantine/core/styles.css';
// import '@mantine/dates/styles.css'; //if using mantine date picker features
// import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
// import { useMemo, useState } from 'react';
// import {
//   MRT_EditActionButtons,
//   MantineReactTable,
//   type MRT_ColumnDef,
//   type MRT_Row,
//   type MRT_TableOptions,
//   useMantineReactTable,
// } from 'mantine-react-table';
// import {
//   ActionIcon,
//   Button,
//   Flex,
//   Stack,
//   Text,
//   Title,
//   Tooltip,
// } from '@mantine/core';
// import { ModalsProvider, modals } from '@mantine/modals';
// import { IconEdit, IconTrash } from '@tabler/icons-react';
// import {
//   QueryClient,
//   QueryClientProvider,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from '@tanstack/react-query';
// import hafalanService, { Hafalan } from '@/services/hafalan';

// const Example = () => {
//   const [validationErrors, setValidationErrors] = useState<
//     Record<string, string | undefined>
//   >({});

//   const columns = useMemo<MRT_ColumnDef<Hafalan>[]>(
//     () => [
//       {
//         accessorKey: 'id',
//         header: 'Id',
//         enableEditing: false,
//         size: 80,
//       },
//       {
//         accessorKey: 'nama_siswa',
//         header: 'Nama Siswa',
//         enableEditing: false,
//       },
//       {
//         accessorKey: 'juz',
//         header: 'Juz',
//         mantineEditTextInputProps: {
//           type: 'number',
//           required: true,
//           error: validationErrors?.juz,
//         },
//       },
//       {
//         accessorKey: 'surat',
//         header: 'Surat',
//         mantineEditTextInputProps: {
//           type: 'number',
//           required: true,
//           error: validationErrors?.surat,
//         },
//       },
//       {
//         accessorKey: 'awal_ayat',
//         header: 'Awal Ayat',
//         mantineEditTextInputProps: {
//           type: 'number',
//           required: true,
//           error: validationErrors?.awal_ayat,
//         },
//       },
//       {
//         accessorKey: 'akhir_ayat',
//         header: 'Akhir Ayat',
//         mantineEditTextInputProps: {
//           type: 'number',
//           required: true,
//           error: validationErrors?.akhir_ayat,
//         },
//       },
//       {
//         accessorKey: 'nilai',
//         header: 'Nilai',
//         mantineEditTextInputProps: {
//           type: 'number',
//           required: true,
//           error: validationErrors?.nilai,
//         },
//       },
//       {
//         accessorKey: 'komentar',
//         header: 'Komentar',
//         mantineEditTextInputProps: {
//           type: 'text',
//           required: true,
//           error: validationErrors?.komentar,
//         },
//       },
//     ],
//     [validationErrors],
//   );

//   const { mutateAsync: createHafalan, isPending: isCreatingHafalan } =
//     useCreateHafalan();
//   const {
//     data: fetchedHafalan = [],
//     isError: isLoadingHafalanError,
//     isFetching: isFetchingHafalan,
//     isLoading: isLoadingHafalan,
//   } = useGetHafalan();
//   const { mutateAsync: updateHafalan, isPending: isUpdatingHafalan } =
//     useUpdateHafalan();
//   const { mutateAsync: deleteHafalan, isPending: isDeletingHafalan } =
//     useDeleteHafalan();

//   const handleCreateHafalan: MRT_TableOptions<Hafalan>['onCreatingRowSave'] =
//     async ({ values, exitCreatingMode }) => {
//       const newValidationErrors = validateHafalan(values);
//       if (Object.values(newValidationErrors).some((error) => error)) {
//         setValidationErrors(newValidationErrors);
//         return;
//       }
//       setValidationErrors({});
//       await createHafalan(values);
//       exitCreatingMode();
//     };

//   const handleSaveHafalan: MRT_TableOptions<Hafalan>['onEditingRowSave'] = async ({
//     values,
//     table,
//   }) => {
//     const newValidationErrors = validateHafalan(values);
//     if (Object.values(newValidationErrors).some((error) => error)) {
//       setValidationErrors(newValidationErrors);
//       return;
//     }
//     setValidationErrors({});
//     await updateHafalan(values);
//     table.setEditingRow(null); //exit editing mode
//   };

//   const openDeleteConfirmModal = (row: MRT_Row<Hafalan>) =>
//     modals.openConfirmModal({
//       title: 'Are you sure you want to delete this hafalan?',
//       children: (
//         <Text>
//           Are you sure you want to delete {row.original.nama_siswa}'s hafalan? This action cannot be undone.
//         </Text>
//       ),
//       labels: { confirm: 'Delete', cancel: 'Cancel' },
//       confirmProps: { color: 'red' },
//       onConfirm: () => deleteHafalan(row.original.id),
//     });

//   const table = useMantineReactTable({
//     columns,
//     data: fetchedHafalan,
//     createDisplayMode: 'modal',
//     editDisplayMode: 'modal',
//     enableEditing: true,
//     getRowId: (row) => row.id,
//     mantineToolbarAlertBannerProps: isLoadingHafalanError
//       ? {
//           color: 'red',
//           children: 'Error loading data',
//         }
//       : undefined,
//     mantineTableContainerProps: {
//       style: {
//         minHeight: '500px',
//       },
//     },
//     onCreatingRowCancel: () => setValidationErrors({}),
//     onCreatingRowSave: handleCreateHafalan,
//     onEditingRowCancel: () => setValidationErrors({}),
//     onEditingRowSave: handleSaveHafalan,
//     renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
//       <Stack>
//         <Title order={3}>Create New Hafalan</Title>
//         {internalEditComponents}
//         <Flex justify="flex-end" mt="xl">
//           <MRT_EditActionButtons variant="text" table={table} row={row} />
//         </Flex>
//       </Stack>
//     ),
//     renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
//       <Stack>
//         <Title order={3}>Edit Hafalan</Title>
//         {internalEditComponents}
//         <Flex justify="flex-end" mt="xl">
//           <MRT_EditActionButtons variant="text" table={table} row={row} />
//         </Flex>
//       </Stack>
//     ),
//     renderRowActions: ({ row, table }) => (
//       <Flex gap="md">
//         <Tooltip label="Edit">
//           <ActionIcon onClick={() => table.setEditingRow(row)}>
//             <IconEdit />
//           </ActionIcon>
//         </Tooltip>
//         <Tooltip label="Delete">
//           <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
//             <IconTrash />
//           </ActionIcon>
//         </Tooltip>
//       </Flex>
//     ),
//     renderTopToolbarCustomActions: ({ table }) => (
//       <Button
//         onClick={() => {
//           table.setCreatingRow(true);
//         }}
//       >
//         Create New Hafalan
//       </Button>
//     ),
//     state: {
//       isLoading: isLoadingHafalan,
//       isSaving: isCreatingHafalan || isUpdatingHafalan || isDeletingHafalan,
//       showAlertBanner: isLoadingHafalanError,
//       showProgressBars: isFetchingHafalan,
//     },
//   });

//   return <MantineReactTable table={table} />;
// };

// function useCreateHafalan() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (hafalan: Hafalan) => {
//       await hafalanService.addHafalan(hafalan);
//     },
//     onMutate: (newHafalanInfo: Hafalan) => {
//       queryClient.setQueryData(
//         ['hafalan'],
//         (prevHafalan: any) => [
//           ...prevHafalan,
//           {
//             ...newHafalanInfo,
//             id: (Math.random() + 1).toString(36).substring(7),
//           },
//         ] as Hafalan[],
//       );
//     },
//   });
// }

// function useGetHafalan() {
//   return useQuery<Hafalan[]>({
//     queryKey: ['hafalan'],
//     queryFn: async () => {
//       return await hafalanService.getDaftarHafalan();
//     },
//     refetchOnWindowFocus: false,
//   });
// }

// function useUpdateHafalan() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (hafalan: Hafalan) => {
//       await hafalanService.updateHafalan(hafalan.id, hafalan);
//     },
//     onMutate: (newHafalanInfo: Hafalan) => {
//       queryClient.setQueryData(['hafalan'], (prevHafalan: any) =>
//         prevHafalan?.map((prevHafalan: Hafalan) =>
//           prevHafalan.id === newHafalanInfo.id ? newHafalanInfo : prevHafalan,
//         ),
//       );
//     },
//   });
// }

// function useDeleteHafalan() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (hafalanId: string) => {
//       await hafalanService.deleteHafalan(hafalanId);
//     },
//     onMutate: (hafalanId: string) => {
//       queryClient.setQueryData(['hafalan'], (prevHafalan: any) =>
//         prevHafalan?.filter((hafalan: Hafalan) => hafalan.id !== hafalanId),
//       );
//     },
//   });
// }

// const queryClient = new QueryClient();

// const ExampleWithProviders = () => (
//   <QueryClientProvider client={queryClient}>
//     <ModalsProvider>
//       <Example />
//     </ModalsProvider>
//   </QueryClientProvider>
// );

// export default ExampleWithProviders;

// const validateRequired = (value: string) => !!value.length;
// const validateNumber = (value: number) => !isNaN(value);
// function validateHafalan(hafalan: Hafalan) {
//   return {
//     juz: !validateNumber(hafalan.juz) ? 'Juz is required' : '',
//     surat: !validateNumber(hafalan.surat) ? 'Surat is required' : '',
//     awal_ayat: !validateNumber(hafalan.awal_ayat) ? 'Awal Ayat is required' : '',
//     akhir_ayat: !validateNumber(hafalan.akhir_ayat) ? 'Akhir Ayat is required' : '',
//     nilai: !validateNumber(hafalan.nilai) ? 'Nilai is required' : '',
//     komentar: !validateRequired(hafalan.komentar) ? 'Komentar is required' : '',
//   };
// }
