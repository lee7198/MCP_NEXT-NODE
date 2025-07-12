import ContainerWrapper from './components/ContainerWrapper';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ContainerWrapper>{children}</ContainerWrapper>;
}
