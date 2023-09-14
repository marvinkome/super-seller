import { getSellerObject } from "./util";

type LayoutProps = {
  children: React.ReactNode;
  params: { id: string };
};
const Layout = async ({ children, params }: LayoutProps) => {
  await getSellerObject(params.id);

  return <>{children}</>;
};

export default Layout;
