export function Card({ children }: { children: any }) {
    return <div className="bg-white shadow rounded-lg overflow-hidden">{children}</div>;
}

export function CardHeader({ children }: { children: any }) {
    return <div className="px-4 py-5 sm:px-6 border-b border-gray-200">{children}</div>;
}

export function CardTitle({ children }: { children: any }) {
    return <h3 className="text-lg leading-6 font-medium text-gray-900">{children}</h3>;
}

export function CardContent({ children }: { children: any }) {
    return <div className="px-4 py-5 sm:p-6">{children}</div>;
}
