export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      '--background': '220 60% 5%',
      '--foreground': '210 20% 98%',
      '--accent': '195 85% 42%',
      '--accent-foreground': '0 0% 100%',
      '--primary': '195 85% 42%',
      '--primary-foreground': '0 0% 100%',
      '--border': '220 30% 18%',
      '--input': '220 30% 12%',
      '--card': '220 40% 8%',
      '--muted-foreground': '220 10% 70%',
      '--ring': '195 85% 42%',
    } as React.CSSProperties & Record<string, string>}>
      {children}
    </div>
  );
}