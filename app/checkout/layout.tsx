import CartProviderWrapper from '@/components/CartProviderWrapper';

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CartProviderWrapper>{children}</CartProviderWrapper>;
}
