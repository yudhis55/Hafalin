import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar";
  
  type RecentSalesProps = {
    data: Array<{
      nama: string;
      jumlah_hafalan: number;
    }>;
  };
  
  export function RecentSales({ data }: RecentSalesProps) {
    return (
      <div className="space-y-4">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Nama Siswa</th>
              <th className="px-4 py-2">Jumlah Hafalan</th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 flex items-center">
                  <Avatar className="h-9 w-9 mr-4">
                    <AvatarImage src={`/avatars/${index + 1}.png`} alt="Avatar" />
                    <AvatarFallback>{item.nama[0]}</AvatarFallback>
                  </Avatar>
                  <span>{item.nama}</span>
                </td>
                <td className="px-4 py-2">{item.jumlah_hafalan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  