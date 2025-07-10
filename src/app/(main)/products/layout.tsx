// /app/(main)/products/layout.tsx

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return <div className="container mx-auto px-4 py-8">{children}</div>;
}
